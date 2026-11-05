"""Marketplace router: listings, create with price-check, status updates."""
import datetime as dt
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.contracts.constants import CROPS
from app.contracts.db_models import Listing, Market, User
from app.contracts.schemas import (
    ApiResponse,
    Listing as SchemaListing,
    ListingCreate,
    Meta,
    StatusUpdate,
)
from app.core.db import get_db
from app.modules.auth.auth_service import get_current_user
from app.modules.marketplace.marketplace_service import (
    db_listing_to_schema,
    perform_price_check,
)

router = APIRouter(prefix="/listings", tags=["marketplace"])


def make_meta(notes: Optional[List[str]] = None) -> Meta:
    return Meta(
        data_source="live",
        generated_at=dt.datetime.now(dt.timezone.utc),
        notes=notes or ["Marketplace Module"],
    )


@router.get("", response_model=ApiResponse[List[SchemaListing]])
def list_listings(
    crop: Optional[str] = Query(None, description="Filter by crop"),
    district: Optional[str] = Query(None, description="Filter by district"),
    status: Optional[str] = Query("open", description="Filter by status (open, sold, cancelled)"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    query = db.query(Listing)
    if crop:
        query = query.filter(Listing.crop_id == crop.lower())
    if district:
        query = query.filter(Listing.district.ilike(f"%{district}%"))
    if status:
        query = query.filter(Listing.status == status)

    db_items = (
        query.order_by(Listing.created_at.desc()).offset(offset).limit(limit).all()
    )

    data = [db_listing_to_schema(db, item) for item in db_items]

    return ApiResponse(
        data=data,
        meta=make_meta(
            [
                f"Fetched {len(data)} listings",
                "Includes automated fair-market price validation and statutory MSP guards",
            ]
        ),
    )


@router.post(
    "",
    response_model=ApiResponse[SchemaListing],
    status_code=status.HTTP_201_CREATED,
)
def create_listing(
    req: ListingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    crop_lower = req.crop.lower()
    if crop_lower not in CROPS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported crop: {req.crop}",
        )

    # Validate market if provided
    if req.market_id is not None:
        market = db.query(Market).filter(Market.id == req.market_id).first()
        if not market:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Market #{req.market_id} not found",
            )

    new_listing = Listing(
        user_id=current_user.id,
        crop_id=crop_lower,
        market_id=req.market_id,
        district=req.district,
        quantity_qtl=req.quantity_qtl,
        asking_price_per_qtl=req.asking_price_per_qtl,
        status="open",
    )
    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)

    schema_obj = db_listing_to_schema(db, new_listing)

    return ApiResponse(
        data=schema_obj,
        meta=make_meta(
            [
                "Listing created successfully",
                f"Automated price check: {schema_obj.price_check.verdict}",
            ]
        ),
    )


@router.get("/{listing_id}", response_model=ApiResponse[SchemaListing])
def get_listing(listing_id: int, db: Session = Depends(get_db)):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Listing #{listing_id} not found",
        )

    return ApiResponse(
        data=db_listing_to_schema(db, listing),
        meta=make_meta(["Listing details retrieved"]),
    )


@router.patch("/{listing_id}/status", response_model=ApiResponse[SchemaListing])
def update_listing_status(
    listing_id: int,
    req: StatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Listing #{listing_id} not found",
        )

    if listing.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the listing owner can change its status",
        )

    listing.status = req.status
    db.commit()
    db.refresh(listing)

    return ApiResponse(
        data=db_listing_to_schema(db, listing),
        meta=make_meta([f"Listing status updated to '{req.status}'"]),
    )
