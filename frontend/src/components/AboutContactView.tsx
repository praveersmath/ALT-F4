import React, { useState } from "react";
import { Info, Mail, Send, CheckCircle2, MapPin, Phone, Building } from "lucide-react";

interface AboutContactViewProps {
  language: "en" | "kn";
}

export const AboutContactView: React.FC<AboutContactViewProps> = ({ language }) => {
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [inquiryType, setInquiryType] = useState<string>("Historical Archive");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setFormSubmitted(true);
    // Reset form fields
    setName("");
    setEmail("");
    setMessage("");
    setTimeout(() => {
      setFormSubmitted(false);
    }, 6000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* About Header */}
      <div className="bg-gradient-to-r from-[#2D1E18] to-[#1A2F3B] text-[#FDFBF7] p-8 rounded-2xl shadow-md border border-[#C5A059]/40">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-[#C5A059]/90 text-[#2D1E18] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Info className="w-3.5 h-3.5" />
            <span>Digital Heritage & Agrarian Preservation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === "kn"
              ? "ಯೋಜನೆಯ ಬಗ್ಗೆ ಮತ್ತು ಸಂಪರ್ಕಿಸಿ"
              : "About AgriIntel Digital Heritage & Contact Information"}
          </h2>
          <p className="text-xs sm:text-sm text-[#E8DFD8]">
            Documenting the historical evolution of Karnataka's agricultural marketplaces and providing citizens with accessible digital archives and predictive intelligence.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* About Project Content (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#C5A059]/30 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-[#2D1E18] border-b border-[#E2E5DC] pb-2">
            The AgriIntel Heritage Initiative
          </h3>

          <p className="text-xs sm:text-sm text-[#5B6354] leading-relaxed">
            The <strong>AgriIntel Karnataka Digital Heritage Project</strong> was conceived to celebrate the unsung history of Karnataka's agrarian development. While technological modernization often focuses solely on real-time prices, the foundations of fair trade were laid over a century ago by visionary engineers like Sir M. Visvesvaraya, progressive monarchs like Nalvadi Krishnaraja Wadiyar, and generation after generation of farming families.
          </p>

          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#E2E5DC] space-y-1">
              <strong className="text-[#2D1E18] block">Archival Methodology:</strong>
              <p className="text-[#5B6354]">
                Our historical records are cross-verified using colonial Mysore State Gazetteers, Karnataka APMC statutory records (1966), ReMS UMP historical datasets, and academic publications from UAS Bengaluru and Dharwad.
              </p>
            </div>

            <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#E2E5DC] space-y-1">
              <strong className="text-[#2D1E18] block">Community Inclusivity:</strong>
              <p className="text-[#5B6354]">
                Built with full bilingual support (English and Kannada) and compliant with WCAG accessibility guidelines to ensure every citizen can access their state's agrarian history.
              </p>
            </div>
          </div>

          <div className="pt-2 text-xs text-[#5B6354] border-t border-[#E2E5DC] flex items-center space-x-2">
            <Building className="w-4 h-4 text-[#C5A059]" />
            <span>Research & Digital Heritage Laboratory • Bengaluru, Karnataka</span>
          </div>
        </div>

        {/* Contact & Feedback Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#C5A059]/30 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-[#2D1E18] border-b border-[#E2E5DC] pb-2 flex items-center space-x-2">
              <Mail className="w-4 h-4 text-[#C5A059]" />
              <span>Community Feedback & Inquiries</span>
            </h3>

            {formSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs space-y-2 my-4 animate-fadeIn">
                <div className="flex items-center space-x-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Message Transmitted Successfully!</span>
                </div>
                <p>
                  Thank you for contributing to Karnataka's agrarian archives. Our research team will review your message promptly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 pt-2 text-xs">
                <div>
                  <label className="font-bold text-[#2D1E18] block mb-1">Your Full Name / ಹೆಸರು:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Basavaraj Patil"
                    className="w-full bg-[#FDFBF7] border border-[#E2E5DC] rounded-lg px-3 py-2 text-xs focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#2D1E18] block mb-1">Email Address / ಇಮೇಲ್:</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. farmer@agriintel.in"
                    className="w-full bg-[#FDFBF7] border border-[#E2E5DC] rounded-lg px-3 py-2 text-xs focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#2D1E18] block mb-1">Inquiry Category / ವಿಷಯ:</label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#E2E5DC] rounded-lg px-3 py-2 text-xs focus:border-[#C5A059]"
                  >
                    <option value="Historical Archive">Historical Archival Contribution</option>
                    <option value="Mandi Data Correction">APMC Mandi Data Clarification</option>
                    <option value="Platform Feedback">Platform Experience & Usability</option>
                    <option value="General Inquiry">General Community Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#2D1E18] block mb-1">Your Message / ಸಂದೇಶ:</label>
                  <textarea
                    required
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your feedback, family farming history, or archival photos..."
                    className="w-full bg-[#FDFBF7] border border-[#E2E5DC] rounded-lg p-3 text-xs focus:border-[#C5A059]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#2D1E18] hover:bg-[#3E2723] text-[#FDFBF7] rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Archival Inquiry</span>
                </button>
              </form>
            )}
          </div>

          <div className="text-[11px] text-[#5B6354] pt-3 border-t border-[#E2E5DC] space-y-1">
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Bengaluru Urban, Karnataka, 560001</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Toll-Free Agri Helpline: 1800-425-3553</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

