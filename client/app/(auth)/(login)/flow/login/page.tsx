"use client";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LoginForm, PasswordLoginForm } from "@/app/(auth)/(login)/_components";
import { useState } from "react";
import { cn } from "@/lib/utils";

const LoginScreen = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="bg-primary/5 backdrop-blur-sm flex items-center justify-center p-4 min-h-screen">
      <div className="relative md:w-xl max-h-[90vh] rounded-lg shadow-xl overflow-hidden bg-background">
        {/* Header with close button */}
        <div className="flex items-start justify-between p-6">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <X size={30} className="text-white size-5" />
            </Button>
          </Link>
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
    </div>
  );
};

export default LoginScreen;
