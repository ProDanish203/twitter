import { Button } from "@/components/ui/button";
import { AppleButton } from "./apple-button";
import { GoogleButton } from "./google-button";
import Link from "next/link";

interface LoginFormProps {
  title: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ title }) => {
  return (
    <div className="max-w-sm mx-auto py-8 sm:px-6 px-4">
      <div>
        <h2 className="md:text-3xl text-2xl break-words font-bold mb-8">
          {title}
        </h2>

        {/* Auth Buttons */}
        <div className="mt-4">
          <div className="mb-6">
            <GoogleButton text="Sign in with Google" />
          </div>
          <div>
            <AppleButton text="Sign in with Apple" />
          </div>
        </div>

        {/* Separator */}
        <div className="relative my-3 flex items-center justify-center gap-x-2">
          <div className="bg-[#2f3336] h-[1px] w-full" />
          <span className="block text-center font-light">or</span>
          <div className="bg-[#2f3336] h-[1px] w-full" />
        </div>

        {/* Email Input */}
        <div></div>

        <div className="overflow-hidden w-full">
          <Button
            variant="secondary"
            className="flex items-center justify-center w-full py-5 px-4 cursor-pointer hover:bg-secondary/90 h-10 rounded-full"
          >
            <span className="text-[#0f1419] text-[15px] font-bold">Next</span>
          </Button>
        </div>

        <div className="overflow-hidden w-full mt-6">
          <Button
            variant="outline"
            className="flex items-center justify-center w-full py-4 px-4 cursor-pointer hover:bg-secondary/90 h-10 rounded-full"
          >
            <span className="text-white text-[15px] font-bold">
              Forgot password?
            </span>
          </Button>
        </div>

        <p className="mt-10 block text-neutral-500">
          Don&apos;t have an account?{" "}
          <Link href="/flow/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
