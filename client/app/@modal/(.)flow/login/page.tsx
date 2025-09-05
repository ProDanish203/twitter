"use client";

import { LoginForm } from "@/app/(auth)/(login)/_components/login-form";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function LoginModal() {
  const router = useRouter();

  // Remove scroll when modal is open
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
      className="fixed inset-0 bg-primary/10 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="relative md:w-xl max-h-[90vh] rounded-lg shadow-xl overflow-hidden bg-background"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="flex items-start justify-between p-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="size-8 rounded-full hover:bg-gray-100 cursor-pointer"
          >
            <X size={30} className="text-white size-5" />
          </Button>
          <Image
            src="/assets/icons/logo.svg"
            alt="Logo"
            width={24}
            height={24}
          />
          <div />
        </div>

        <div className="pb-16">
          <LoginForm title="Sign in to X" />
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
}
