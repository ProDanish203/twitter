"use client";

import { PasswordLoginForm } from "@/app/(auth)/(login)/_components";
import { LoginForm } from "@/app/(auth)/(login)/_components/login-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function LoginModal() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
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
    setOpen(false);
    router.back();
  }

  useEffect(() => {
    if (!pathname.includes("login")) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [pathname]);

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      handleClose();
    }
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

        <div className={cn(activeTab === 0 ? "pb-16" : "")}>
          {activeTab === 0 && (
            <LoginForm title="Sign in to X" setActiveTab={setActiveTab} />
          )}
          {activeTab === 1 && <PasswordLoginForm />}
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
}
