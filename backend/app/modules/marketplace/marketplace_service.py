"""Marketplace service: price-checked listings, fair-value benchmarks, and MSP guards."""
from typing import Optional, Tuple
from sqlalchemy.orm import Session

from app.contracts.constants import CROPS
from app.contracts.db_models import Listing, Market, MspRecord, PriceRecord, User
from app.contracts.schemas import Listing as SchemaListing, PriceCheck, UserPublic, Verdict
from app.modules.auth.auth_service import user_to_public


def perform_price_check(
    db: Session,
    crop_id: str,
    asking_price: float,
    market_id: Optional[int] = None,
    district: Optional[str] = None,
) -> PriceCheck:
    crop_meta = CROPS.get(crop_id, {})
    msp_applicable = crop_meta.get("msp_applicable", False)

    # Check MSP
    msp_inr = None
    if msp_applicable:
        msp_rec = (
            db.query(MspRecord)
            .filter(MspRecord.crop_id == crop_id)
            .order_by(MspRecord.marketing_year.desc())
            .first()
        )
        if msp_rec:
            msp_inr = float(msp_rec.msp_inr_per_qtl)

    # Check prevailing market price
    query = db.query(PriceRecord).filter(PriceRecord.crop_id == crop_id)
    if market_id:
        query = query.filter(PriceRecord.market_id == market_id)
    latest_rec = query.order_by(PriceRecord.obs_date.desc()).first()
    market_price = float(latest_rec.modal_price) if latest_rec else None

    # Predicted price reference
    predicted_price = round(market_price * 1.02, 2) if market_price else None

    # Determine verdict
    verdict: Verdict
    note: str
    if msp_applicable and msp_inr and asking_price < msp_inr:
        verdict = "below_msp"
        note = (
            f"Asking price (₹{asking_price:,.0f}/qtl) is below the statutory Government MSP "
            f"of ₹{msp_inr:,.0f}/qtl."
        )
    elif market_price is None:
        verdict = "no_reference"
        note = "No active APMC modal price reference available for this market/crop."
    else:
        diff_pct = ((asking_price - market_price) / market_price) * 100.0
        if diff_pct < -15.0:
            verdict = "below_market"
            note = (
                f"Asking price is {abs(diff_pct):.1f}% below the current APMC modal price "
                f"(₹{market_price:,.0f}/qtl). Fast trade likely."
            )
        elif diff_pct > 15.0:
            verdict = "above_market"
            note = (
                f"Asking price is {diff_pct:.1f}% above the current APMC modal price "
                f"(₹{market_price:,.0f}/qtl)."
            )
        else:
            verdict = "fair"
            note = (
                f"Asking price is within fair market band (within ±15% of ₹{market_price:,.0f}/qtl)."
            )

    return PriceCheck(
        msp_applicable=msp_applicable,
        msp_inr_per_qtl=msp_inr,
        current_market_price=market_price,
        predicted_price=predicted_price,
        verdict=verdict,
        note=note,
    )


def db_listing_to_schema(db: Session, listing: Listing) -> SchemaListing:
    owner = db.query(User).filter(User.id == listing.user_id).first()
    owner_public = (
        user_to_public(owner)
        if owner
        else UserPublic(
            id=listing.user_id,
            name="Unknown",
            email="unknown@agriintel.in",
            role="farmer",
            district=listing.district,
        )
    )

    price_check = perform_price_check(
        db,
        listing.crop_id,
        listing.asking_price_per_qtl,
        market_id=listing.market_id,
        district=listing.district,
    )

    return SchemaListing(
        id=listing.id,
        owner=owner_public,
        crop=listing.crop_id,
        quantity_qtl=listing.quantity_qtl,
        asking_price_per_qtl=listing.asking_price_per_qtl,
        district=listing.district,
        market_id=listing.market_id,
        status=listing.status,
        created_at=listing.created_at,
        price_check=price_check,
    )
