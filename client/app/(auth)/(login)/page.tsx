import { BottomLinks } from "./_components/bottom-links";
import Image from "next/image";

const AuthScreen = () => {
  return (
    <main className="relative min-h-screen w-screen flex flex-col items-center justify-between">
      <div className="max-sm:container max-sm:mx-auto flex flex-1 w-full h-full divide-red-500 divide-x-2">
        <div className="flex items-center justify-center w-full">
          <Image
            src="/assets/icons/logo.svg"
            alt="X Logo"
            width={250}
            height={250}
            className="object-contain"
          />
        </div>
        <div className="p-4 w-full flex flex-col justify-center">
          <div className="p-5">
            <h2 className="my-12 text-6xl font-bold">Happening now</h2>
            <p className="mb-8 text-3xl font-bold">Join today.</p>
          </div>
        </div>
      </div>

      <BottomLinks />
    </main>
  );
};

export default AuthScreen;
