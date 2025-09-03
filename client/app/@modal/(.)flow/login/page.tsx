"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function LoginModal() {
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  function handleClose() {
    router.back();
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-[50vw] max-h-[90vh] rounded-lg shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Login</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8 rounded-full hover:bg-gray-100"
          >
            <X size={16} />
          </Button>
        </div>

        {/* Content area with auto height and scroll if needed */}
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Your login content goes here */}
          <div className="space-y-4">
            <p>Login Route Content</p>
            {/* Add your form fields and content here */}
            <div className="h-96 bg-gray-100 rounded flex items-center justify-center">
              <p>Login form content area</p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
}
