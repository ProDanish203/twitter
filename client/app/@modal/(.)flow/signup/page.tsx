"use client";

import {
  SignupForm,
  SignupPasswordForm,
  SignupVerification,
} from "@/components/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSignupStore } from "@/store/signup-store";
import { X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function SignupModal() {
  const router = useRouter();
  const { setCurrentStep, currentStep } = useSignupStore();
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  // Remove scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  function handleClose() {
    setCurrentStep(0);
    setOpen(false);
    router.back();
  }

  useEffect(() => {
    if (!pathname.includes("signup")) setOpen(false);
    else setOpen(true);
  }, [pathname]);

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) handleClose();
  }

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 bg-primary/10 backdrop-blur-sm flex items-center justify-center z-50 p-4",
        open ? "opacity-100 visible" : "opacity-0 invisible"
      )}
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-xl max-h-[90vh] rounded-lg shadow-xl overflow-hidden bg-background"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-xl max-h-[90vh] rounded-lg shadow-xl overflow-hidden bg-background">
          {/* Header with close button */}
          <div className="flex items-start justify-between p-6">
            {currentStep !== 2 ? (
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-full hover:bg-gray-100 cursor-pointer"
                type="button"
                onClick={handleClose}
              >
                <X size={30} className="text-white size-5" />
              </Button>
            ) : (
              <div></div>
            )}

            <Image
              src="/assets/icons/logo.svg"
              alt="Logo"
              width={24}
              height={24}
            />
            <div />
          </div>

          <div>
            {currentStep === 0 && <SignupForm />}
            {currentStep === 1 && <SignupVerification />}
            {currentStep === 2 && <SignupPasswordForm />}
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
}
