import React, { useState, useEffect } from "react";
import { Smartphone, Monitor, ShieldCheck, Wifi, Battery, Radio } from "lucide-react";

interface DeviceSimulatorProps {
  children: React.ReactNode;
  deviceType: "ios" | "android" | "desktop";
  setDeviceType: (type: "ios" | "android" | "desktop") => void;
}

export default function DeviceSimulator({ children, deviceType, setDeviceType }: DeviceSimulatorProps) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      setCurrentTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="device-root" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Top Navbar */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/60 sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent flex items-center">
              REACH <span className="text-[10px] ml-2 px-2 py-0.5 bg-indigo-900/50 text-indigo-300 rounded-full border border-indigo-700/30">INTELLIGENT INSIGHTS</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">Influencer Escrow & Performance AI Radar</p>
          </div>
        </div>

        {/* Workspace Mode Controls */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 space-x-1">
          <button
            id="sim-ios-btn"
            onClick={() => setDeviceType("ios")}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
              deviceType === "ios"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">iOS App</span>
          </button>
          
          <button
            id="sim-android-btn"
            onClick={() => setDeviceType("android")}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
              deviceType === "android"
                ? "bg-emerald-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Android App</span>
          </button>

          <button
            id="sim-desktop-btn"
            onClick={() => setDeviceType("desktop")}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
              deviceType === "desktop"
                ? "bg-slate-800 text-white shadow"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop Web</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-6 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/20 overflow-y-auto">
        {deviceType === "desktop" ? (
          /* Desktop Simulator View */
          <div className="w-full max-w-7xl mx-auto bg-slate-900 rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden flex flex-col h-[85vh]">
            {/* Top Chrome header bar */}
            <div className="bg-slate-950/80 px-4 py-2 flex items-center justify-between border-b border-slate-800/60 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              </div>
              <div className="bg-slate-900 px-4 py-1 rounded-lg border border-slate-800 text-[11px] font-mono select-text text-indigo-400 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>https://reach-influencers.secure/agency-portal</span>
              </div>
              <div className="text-[11px] font-mono text-slate-500">{currentTime}</div>
            </div>
            {/* Contents */}
            <div className="flex-1 overflow-y-auto bg-slate-950 relative">
              {children}
            </div>
          </div>
        ) : (
          /* Mobile Device Simulator Frame (iOS or Android Style) */
          <div className="relative mx-auto my-2">
            {/* Glossy Edge Glow */}
            <div className={`absolute -inset-1.5 rounded-[52px] blur-xl opacity-40 transition-all duration-1000 ${
              deviceType === "ios" ? "bg-indigo-500" : "bg-emerald-500"
            }`} />

            {/* Mobile Outer Device Hull */}
            <div className={`relative w-[390px] h-[820px] rounded-[48px] bg-slate-950 border-4 shadow-2xl overflow-hidden flex flex-col transition-all duration-500 ${
              deviceType === "ios" ? "border-slate-800 ring-8 ring-slate-900" : "border-zinc-800 ring-8 ring-zinc-900"
            }`}>
              
              {/* Dynamic Island or Notch bar */}
              <div className="absolute top-0 inset-x-0 h-11 bg-transparent flex items-center justify-between px-6 z-40">
                {/* Simulated Time */}
                <span className="text-[13px] font-semibold text-slate-100 font-sans tracking-tight">
                  {currentTime.split(" ")[0]}
                </span>

                {/* Notch Capsule */}
                <div className={`h-[24px] rounded-full bg-black flex items-center justify-center transition-all duration-500 ${
                  deviceType === "ios" ? "w-[110px]" : "w-[64px]"
                }`}>
                  <div className="w-3 h-3 rounded-full bg-indigo-950/80 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                  </div>
                </div>

                {/* Status Bar Icons */}
                <div className="flex items-center space-x-2 text-slate-100">
                  <Wifi className="w-3.5 h-3.5 text-slate-200" />
                  <span className="text-[10px] font-semibold">5G</span>
                  <Battery className="w-4 h-4 text-slate-200" />
                </div>
              </div>

              {/* Simulated OS Screen Space */}
              <div className="flex-1 pt-11 overflow-y-auto bg-slate-950 relative scrollbar-none flex flex-col">
                {children}
              </div>

              {/* iOS Home Indicator Bar or Android Navigation Pill */}
              <div className="h-5 bg-slate-950 flex items-center justify-center pb-2 z-40 border-t border-slate-900/40">
                {deviceType === "ios" ? (
                  <div className="w-32 h-[4px] rounded-full bg-slate-400/80" />
                ) : (
                  <div className="flex items-center justify-around w-2/5 px-2">
                    <div className="w-2.5 h-2.5 border border-slate-400 rotate-45 rounded-sm" />
                    <div className="w-3 h-3 border border-slate-400 rounded-full" />
                    <div className="w-3.5 h-[2px] bg-slate-400 rounded-lg" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
