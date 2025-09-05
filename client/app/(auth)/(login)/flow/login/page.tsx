import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/app/(auth)/(login)/_components/login-form";

const LoginScreen = () => {
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

        <div className="pb-16">
          <LoginForm title="Sign in to X" />
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
