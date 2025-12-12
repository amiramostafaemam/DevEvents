// components/admin/DeleteModal.tsx
"use client";

import { X, AlertTriangle } from "lucide-react";
import LoadingButton from "../LoadingButton";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  isDeleting?: boolean;
}

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isDeleting = false,
}: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#0D161A] border-[#243B47]  rounded-xl border  p-6 max-w-md w-full mx-4 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 bg-red-600/10 rounded-full mb-4">
          <AlertTriangle className="text-red-500" size={24} />
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold mb-2 capitalize">{title}</h3>
        <p className="text-slate-400 mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-3  hover:bg-[#243B47] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors bg-[#182830] text-[#DCFFF8] cursor-pointer"
          >
            Cancel
          </button>
          <LoadingButton
            onClick={onConfirm}
            isLoading={isDeleting}
            loadingText="Deleting"
            variant="danger"
            size="md"
            className="flex-1 cursor-pointer"
          >
            Delete
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
