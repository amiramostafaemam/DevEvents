"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Lock } from "lucide-react";
import LoadingButton from "./LoadingButton";

const Navbar = () => {
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogoClick = () => {
    // Clear previous timeout
    if (timeoutId) clearTimeout(timeoutId);

    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount === 3) {
      setShowModal(true);
      setClickCount(0);
      return;
    }

    const id = setTimeout(() => {
      setClickCount(0);
    }, 1000);

    setTimeoutId(id);
  };

  const handleSubmitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (data.success) {
        setShowModal(false);
        setCode("");
        router.push("/admin");
        router.refresh();
      } else {
        setError("Invalid access code");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCode("");
    setError("");
  };

  return (
    <>
      <header>
        <nav>
          <Link
            href="/"
            className="logo"
            onClick={handleLogoClick}
            title="Triple click for admin access"
          >
            <Image src="/icons/logo.png" alt="Logo" width={24} height={24} />
            <p>DevEvent</p>
          </Link>
          <ul>
            <Link href="/">Home</Link>
            <Link href="/events">Events</Link>
            <Link href="/events/create">Create Event</Link>
          </ul>
        </nav>
      </header>

      {/* Admin Access Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#0D161A] border-[#243B47] rounded-xl border  p-8 w-full max-w-md relative animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              disabled={loading}
            >
              <X
                size={22}
                className="text-white hover:text-[#59DECA] cursor-pointer"
              />
            </button>

            {/* Header */}
            <div className="text-center mb-3">
              <div className="w-16 h-16 bg-[#182830] rounded-full flex items-center justify-center mx-auto">
                <Lock size={32} className="text-[#59DECA]" />
              </div>

              <h1 className="text-4xl font-bold py-2">Admin Access</h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitCode} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter access code"
                  required
                  disabled={loading}
                  autoFocus
                  className="bg-[#182830] border-[#243B47] text-[#DCFFF8] py-3 w-full px-4 mt-3 rounded-xl text-base placeholder:text-[#DCFFF8] placeholder:text-lg focus:border-[#DCFFF8] focus:outline-1 text-center"
                />
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-red-600 text-base mt-1 font-medium">
                  {error}
                </p>
              )}

              {/* Submit Button */}

              <LoadingButton
                type="submit"
                isLoading={loading}
                disabled={!code}
                loadingText="Verifying"
                variant="primary"
                size="md"
                className="w-full rounded-lg cursor-pointer"
              >
                Access Dashboard
              </LoadingButton>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
