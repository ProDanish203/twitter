import Image from "next/image";
import { GoogleButton, AppleButton, BottomLinks } from "./_components";
import Link from "next/link";
import { SecondaryButton, PrimaryButton } from "@/components/common";

const AuthScreen = () => {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-between">
      <div className="flex-1 container flex md:flex-row flex-col px-4 pt-8 h-full">
        {/* Left Section */}
        <div className="max-md:hidden flex-1/6 w-full flex items-center justify-center">
          <Image
            src="/assets/icons/logo.svg"
            alt="X Logo"
            width={250}
            height={250}
            className="object-contain"
          />
        </div>
        <div className="md:hidden block w-fit px-8">
          <Image
            src="/assets/icons/logo.svg"
            alt="X Logo"
            width={30}
            height={30}
            className="object-contain"
          />
        </div>
        {/* Right Section */}
        <div className="md:flex-1 w-full max-md:mt-4 flex flex-col justify-center">
          <div className="md:p-5 p-4">
            <h2 className="sm:my-12 max-sm:mt-12 md:text-7xl text-5xl font-bold break-words">
              Happening now
            </h2>
            <p className="sm:mb-6 max-sm:mt-6 md:text-3xl sm:text-2xl text-xl font-extrabold">
              Join today.
            </p>
          </div>
          <div className="max-w-xs w-full">
            <div className="mb-4">
              <GoogleButton text="Sign in with Google" />
            </div>
            <div>
              <AppleButton text="Sign in with Apple" />
            </div>

            {/* Separator */}
            <div className="relative my-2 flex items-center justify-center gap-x-2">
              <div className="bg-[#2f3336] h-[1px] w-full" />
              <span className="block text-center font-light">OR</span>
              <div className="bg-[#2f3336] h-[1px] w-full" />
            </div>

            {/* For signup */}
            <Link
              href="/flow/signup"
              className="block mb-4 overflow-hidden w-full"
            >
              <PrimaryButton text="Create account" />
            </Link>

            <p className="text-xs text-[#71767b]">
              By signing up, you agree to the
              <Link href="#" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              , including{" "}
              <Link href="#" className="text-primary hover:underline">
                Cookie Use.
              </Link>
            </p>
          </div>

          <div className="max-w-xs w-full md:mt-8 mt-4">
            <p className="font-bold text-lg mb-4">Already have an account?</p>
            <Link href={"/flow/login"}>
              <SecondaryButton text="Sign in" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-sm:mt-4">
        <BottomLinks />
      </div>
    </main>
  );
};

export default AuthScreen;
