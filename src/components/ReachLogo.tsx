import React from "react";

export default function ReachLogo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <div className={`flex items-center justify-center select-none ${className}`}>
      {/* 
        The user has been instructed to upload their logo as 'logo.png' into the 'public' folder.
        We'll use an img tag to display it exactly as provided without any CSS redesigning.
      */}
      <img 
        src="/logo.png" 
        alt="Reach Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  );
}
