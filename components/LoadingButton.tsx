import React from "react";
import { cn } from "@/lib/utils";

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    {
      isLoading = false,
      loadingText,
      children,
      variant = "primary",
      size = "md",
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary:
        "bg-[#59DECA] hover:bg-[#4FB8A6] text-[#030708] disabled:bg-[#182830] disabled:text-[#DCFFF8]",
      secondary:
        "bg-[#182830] hover:bg-[#243B47] text-[#DCFFF8] border border-[#243B47]",
      danger:
        "bg-red-600 hover:bg-red-700 text-white disabled:bg-red-900 disabled:text-gray-400",
      ghost:
        "bg-transparent hover:bg-[#182830] text-[#DCFFF8] border border-[#243B47]",
    };

    const sizes = {
      sm: "py-2 px-4 text-sm",
      md: "py-3 px-5 text-base",
      lg: "py-4 px-6 text-lg",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "w-full rounded-xl font-semibold transition-all duration-200",
          "disabled:cursor-not-allowed disabled:opacity-70",
          "flex items-center justify-center gap-1",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="loading-text">
            {loadingText || "Loading"}
            <span className="animate-dots">
              <span className="dot-1">.</span>
              <span className="dot-2">.</span>
              <span className="dot-3">.</span>
            </span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";

export default LoadingButton;
