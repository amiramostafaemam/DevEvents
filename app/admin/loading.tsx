"use client";

import { Settings, UserStar } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="bg-transparent">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        {/* Admin Icon with Enhanced Animation */}
        <div className="relative w-28 h-28 mx-auto">
          {/* Outer Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#59DECA]/30 via-[#4FB8A6]/20 to-transparent blur-3xl animate-pulse"></div>

          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border border-[#59DECA]/20"></div>

          {/* Center Shield with Glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative p-7 rounded-full bg-gradient-to-br from-[#59DECA]/10 to-transparent backdrop-blur-sm">
              <UserStar
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
                size={20}
                strokeWidth={2.5}
              />
            </div>
          </div>

          {/* Orbiting Icons */}
          <div
            className="absolute inset-1 animate-spin"
            style={{ animationDuration: "3s" }}
          >
            <Settings
              className="absolute -top-3 left-1/2 -translate-x-1/2 text-[#59DECA] opacity-70 drop-shadow-[0_0_4px_rgba(89,222,202,0.6)]"
              size={18}
            />
          </div>
        </div>
      </div>
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-[#59DECA] rounded-full animate-float-slow opacity-40 blur-sm"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-[#4FB8A6] rounded-full animate-float-medium opacity-60 blur-sm"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 bg-[#59DECA] rounded-full animate-float-fast opacity-30 blur-sm"></div>
        <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-[#59DECA]/60 rounded-full animate-float-slow opacity-50 blur-sm"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-[#4FB8A6]/80 rounded-full animate-float-medium opacity-40 blur-sm"></div>
      </div>
    </div>
  );
}
