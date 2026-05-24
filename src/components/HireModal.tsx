import React, { useState } from "react";
import { X, ShieldCheck, DollarSign, PenTool, CheckCircle, Flame, CreditCard, Lock, Info, Zap } from "lucide-react";
import { Influencer, Contract } from "../types";

interface HireModalProps {
  influencer: Influencer;
  isOpen: boolean;
  onClose: () => void;
  onHireSuccess: (contract: Contract) => void;
}

export default function HireModal({ influencer, isOpen, onClose, onHireSuccess }: HireModalProps) {
  const [campaignName, setCampaignName] = useState("Q3 Product Sponsorship");
  const [expirationDate, setExpirationDate] = useState("");
  const [terms, setTerms] = useState(
    `1x Dedicated YouTube integration segment (60-90s) reviewing product main qualities. 
Link placement top-of-description and comment mention. 
Release criteria: Submission of raw draft video within 14 days.`
  );
  const [amount, setAmount] = useState(influencer.costPerPost.toString());
  const [step, setStep] = useState<"fill_details" | "payment" | "success">("fill_details");

  // Payment form states
  const [cardNumber, setCardNumber] = useState("4111 2222 3333 4444");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("123");
  const [billingName, setBillingName] = useState("Enterprise Brand Inc");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeContract, setActiveContract] = useState<Contract | null>(null);

  if (!isOpen) return null;

  const handleQuickHire = () => {
    setCampaignName(`Quick-Hire: ${influencer.niche} Integration`);
    setTerms(`Standard 60-second integrated shoutout in a ${influencer.niche} video.
Link placement required in description and pinned comment.
Targeting ${influencer.location} audience.
Please follow standardized brand guidelines.
Submit draft for review within 10 days.`);
    setAmount(influencer.costPerPost.toString());
    setExpirationDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  };

  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName || !amount) {
      setErrorMessage("Please complete all required fields.");
      return;
    }
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/hire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          influencerId: influencer.id,
          businessName: billingName || "Brand Partner",
          campaignName,
          terms,
          amount: Number(amount),
          expirationDate
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initiate proposal.");

      setActiveContract(data);
      setStep("payment");
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEscrowPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeContract) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId: activeContract.id,
          cardNumber: cardNumber.replace(/\s/g, ""),
          cardExpiry: expiry,
          cardCvc: cvc
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Escrow processing declined.");

      // Set state to success
      setActiveContract(data.contract);
      onHireSuccess(data.contract);
      setStep("success");
    } catch (err: any) {
      setErrorMessage(err.message || "Payment authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in duration-300">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              {step === "fill_details" && "Negotiate Creator Campaign"}
              {step === "payment" && "Secure Escrow Payment"}
              {step === "success" && "Milestone Secured!"}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="bg-rose-950/40 border border-rose-800/50 p-3 text-xs text-rose-300 flex items-center space-x-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Content Stages */}
        {step === "fill_details" && (
          <form onSubmit={handleCreateContract} className="p-5 space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
              <img 
                src={influencer.avatar} 
                alt={influencer.name} 
                className="w-10 h-10 rounded-full object-cover border border-slate-800"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="text-xs text-slate-400 font-mono">{influencer.handle}</p>
                <h4 className="text-sm font-bold text-slate-100">{influencer.name}</h4>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[10px] uppercase text-slate-500 tracking-wider font-semibold">Min Budget</p>
                <p className="text-sm font-bold text-emerald-400">${influencer.costPerPost}</p>
              </div>
            </div>

            {/* Quick-Hire Trigger */}
            <div 
              onClick={handleQuickHire}
              className="flex justify-between items-center bg-indigo-950/40 p-3 rounded-2xl border border-indigo-900/40 cursor-pointer hover:bg-indigo-900/60 transition group shadow-sm shadow-indigo-900/20"
            >
              <div className="flex items-center space-x-2">
                <div className="bg-amber-400/20 p-1.5 rounded-lg text-amber-400 group-hover:scale-110 transition">
                  <Zap className="w-4 h-4 fill-amber-400" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Quick-Hire Auto-Draft</h5>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider">Prefill {influencer.niche} contract terms</p>
                </div>
              </div>
              <span className="text-[10px] bg-indigo-900/50 text-indigo-400 font-bold px-2 py-1 rounded border border-indigo-500/20 uppercase">
                Apply Template
              </span>
            </div>

            {/* Campaign Name & Expiration */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Campaign Name
                </label>
                <input 
                  type="text" 
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Product Feature Launch"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Expiration Date
                </label>
                <input 
                  type="date" 
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Funding Amount */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Funding Escrow Amount ($ Budget)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={influencer.costPerPost.toString()}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-bold text-emerald-400"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Fund remains locked. Released only upon deliverable review/completion.
              </p>
            </div>

            {/* Terms Description */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Campaign Terms & Requirements
              </label>
              <textarea 
                rows={3}
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                placeholder="Describe timeline and media objectives..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-sans"
                required
              />
            </div>

            {/* Brand Representative */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Business Organization Name
              </label>
              <input 
                type="text" 
                value={billingName}
                onChange={(e) => setBillingName(e.target.value)}
                placeholder="Alpha Gear LLC"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            {/* Submit */}
            <button
              id="initiate-proposal-btn"
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>{isLoading ? "Initiating Contract..." : "Confirm & Pay Escrow"}</span>
            </button>
          </form>
        )}

        {step === "payment" && activeContract && (
          <form onSubmit={handleEscrowPayment} className="p-5 space-y-4">
            
            {/* ESCROW EXPLAINER */}
            <div className="bg-indigo-950/50 border border-indigo-800/40 p-3 rounded-2xl flex space-x-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <h5 className="text-[11px] font-bold text-indigo-200 uppercase tracking-wide">Reach Escrow Protection</h5>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Your funds are secure. Payment will NOT go directly to the influencer. It is deposited in an audited state escrow hold, and only released once deliverables are successfully verified.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Contract ID:</span>
                <span className="font-mono text-[10px] text-slate-300">{activeContract.id}</span>
              </div>
              <div className="flex justify-between text-xs mt-2 pt-2 border-t border-slate-900/40 text-slate-400">
                <span>Campaign Base Budget:</span>
                <span className="font-semibold text-slate-200">${activeContract.amount}</span>
              </div>
              <div className="flex justify-between text-xs mt-1 text-slate-400">
                <span>0.1% Escrow Commission Fee:</span>
                <span className="font-semibold text-indigo-400">+${activeContract.commission ?? (activeContract.amount * 0.001).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs mt-2 pt-2 border-t border-slate-850 text-slate-200 font-bold">
                <span>Total Secured Hold (incl. fee):</span>
                <span className="text-sm font-black text-emerald-400">${activeContract.totalAmount ?? (activeContract.amount * 1.001).toFixed(2)}</span>
              </div>
            </div>

            {/* Card Information */}
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                  <input 
                    type="text" 
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4111 2222 3333 4444"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                    maxLength={19}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Expiration Date
                  </label>
                  <input 
                    type="text" 
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Security CVC
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                    <input 
                      type="password" 
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      placeholder="123"
                      maxLength={4}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit secure payment with lock graphic */}
            <button
              id="confirm-payment-btn"
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-200" />
              <span>{isLoading ? "Validating Secure Payment Token..." : `Authorize Escrow Deposit ($${activeContract.totalAmount ?? (activeContract.amount * 1.001).toFixed(2)})`}</span>
            </button>
            <p className="text-[10px] text-center text-slate-500">
              Payments processing is powered by Reach Secured Gateways. Your credentials are encrypted.
            </p>
          </form>
        )}

        {step === "success" && activeContract && (
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-emerald-900/30 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400">
              <CheckCircle className="w-10 h-10 animate-bounce" />
            </div>
            
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-100">Escrow Transfer Secured!</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                ${activeContract.totalAmount ?? (activeContract.amount * 1.001).toFixed(2)} (including 0.1% escrow commission fee) has been successfully registered onto contract <span className="font-mono text-indigo-400 select-all">{activeContract.id}</span>.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 text-left space-y-2">
              <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                <span>RECIPIENT CREATOR:</span>
                <span className="text-slate-200">{activeContract.influencerName}</span>
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                <span>ESCROW STATE:</span>
                <span className="text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-full text-[9px] border border-amber-500/20">
                  FUNDS HELD SECURELY
                </span>
              </div>
            </div>

            <button
              id="close-success-btn"
              onClick={onClose}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs py-2.5 rounded-xl transition"
            >
              Return to Profile View
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
