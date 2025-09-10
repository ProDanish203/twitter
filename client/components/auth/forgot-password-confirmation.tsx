"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioCheckItem, RadioGroup } from "@/components/ui/radio-group";
import { maskEmail, maskPhoneNumber } from "@/lib/utils";
import { useForgotPasswordStore } from "@/store/forgot-password.store";
import { VerificationOption } from "@/types/auth";
import Link from "next/link";
import { SetStateAction, useState } from "react";
import { toast } from "sonner";

interface ForgotPasswordConfirmationProps {
  setActiveTab: React.Dispatch<SetStateAction<number>>;
  verificationOptions: VerificationOption[];
}

export const ForgotPasswordConfirmation: React.FC<
  ForgotPasswordConfirmationProps
> = ({ setActiveTab, verificationOptions }) => {
  const { setIdentifier } = useForgotPasswordStore();
  const [selectedOption, setSelectedOption] = useState<string>(
    verificationOptions[0].value
  );

  const getLabelText = (data: VerificationOption): string => {
    const { type, value } = data;
    switch (type) {
      case "email":
        return `Send an email to ${maskEmail(value)}`;
      case "sms":
        return `Send an SMS to ${maskPhoneNumber(value)}`;
      default:
        return "";
    }
  };

  const handleSubmit = () => {
    try {
      if (!selectedOption) return;
      // Make an api call to send the confirmation code to the selected option
      setIdentifier(selectedOption);
      setActiveTab(2);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-full mx-auto sm:px-20 px-4">
      <div>
        <h2 className="md:text-3xl text-2xl break-words font-bold">
          Where should we send a confirmation code?
        </h2>
        <p className="mt-2 block text-neutral-500 text-[15px]">
          Before you can change your password, we need to make sure it&apos;s
          really you.
        </p>

        <p className="mt-4 block text-neutral-500 text-[15px]">
          Start by choosing where to send a confirmation code.
        </p>

        {/* Identifier Input */}
        <form onSubmit={handleSubmit} className="mt-8">
          <RadioGroup
            className="flex flex-col gap-6 mb-6"
            defaultValue={verificationOptions[0].value}
            name="verification-options"
            onValueChange={(value) => setSelectedOption(value)}
          >
            {verificationOptions.map(({ type, value }, index) => (
              <div
                className="flex items-center justify-between gap-x-4"
                key={index}
              >
                <Label htmlFor={`verification-${type}`}>
                  {getLabelText({ type, value })}
                </Label>

                <RadioCheckItem
                  value={value}
                  id={`verification-${type}`}
                  checked={selectedOption === value}
                  className="size-5 border border-neutral-700 ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:!bg-primary data-[state=checked]:border-primary"
                />
              </div>
            ))}
          </RadioGroup>

          <p className="mb-6 text-[15px]">
            Contact{" "}
            <Link href="/" className="text-primary hover:underline">
              X Support
            </Link>{" "}
            if you don&apos;t have access.
          </p>

          <div className="overflow-hidden w-full mt-40">
            <Button
              variant="secondary"
              type="submit"
              className="flex items-center justify-center w-full py-6 px-4 cursor-pointer hover:bg-secondary/90 h-10 rounded-full"
              disabled={!selectedOption}
            >
              <span className="text-[#0f1419] text-[16px] font-extrabold">
                Next
              </span>
            </Button>

            <Link href="/" className="block overflow-hidden w-full mt-4">
              <Button
                variant="outline"
                className="flex items-center justify-center w-full py-6 px-4 cursor-pointer hover:bg-secondary/90 h-10 rounded-full"
              >
                <span className="text-white text-[15px] font-bold">Cancel</span>
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
