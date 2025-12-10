"use client";

import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className=" bg-transparent flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number with Animation */}
        <div className="relative mb-8">
          <h1 className="text-[180px] md:text-[220px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#59DECA] to-[#4FB8A6] leading-none animate-pulse-slow">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#59DECA]/10 blur-3xl animate-pulse"></div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#E7F2FF]">
            Oops! Nothing Here.
          </h2>
        </div>

        {/* Decorative Elements */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#59DECA]"></div>
          <Link href="/">
            <Home className="text-[#59DECA] animate-bounce" size={24} />
          </Link>

          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#59DECA]"></div>
        </div>

        {/* Floating Particles Effect */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#59DECA] rounded-full animate-float-slow"></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-[#4FB8A6] rounded-full animate-float-medium"></div>
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-[#59DECA] rounded-full animate-float-fast"></div>
          <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-[#4FB8A6] rounded-full animate-float-slow"></div>
        </div>
      </div>
    </div>
  );
}
