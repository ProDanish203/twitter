"use client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { maskEmail, maskPhoneNumber } from "@/lib/utils";
import { useForgotPasswordStore } from "@/store/forgot-password.store";
import { OtpSchema, otpSchema } from "@/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { PrimaryButton, SecondaryButton } from "../common";

export const OtpVerificationForm = () => {
  const { identifier } = useForgotPasswordStore();

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpSchema>({
    resolver: zodResolver(otpSchema),
  });

  const otpValue = watch("otp")?.toString() ?? "";

  const handleResendOtp = () => {
    try {
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const onSubmit: SubmitHandler<OtpSchema> = (data) => {
    try {
      const result = otpSchema.safeParse(data);
      if (result.success) {
        // Call an API to verify the OTP
      } else {
        toast.error(result.error.issues[0].message);
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-full mx-auto sm:px-20 px-4">
      <div>
        <h2 className="md:text-3xl text-2xl break-words font-bold">
          Verify OTP
        </h2>
        <p className="mt-2 block text-neutral-500 text-[15px]">
          Enter the OTP sent to your{" "}
          {identifier.includes("@")
            ? maskEmail(identifier)
            : maskPhoneNumber(identifier)}
          .
        </p>

        {/* Identifier Input */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
          <div className="mb-6">
            {/* OTP Input */}
            <InputOTP
              maxLength={6}
              value={otpValue}
              onChange={(value) => setValue("otp", Number(value))}
              containerClassName="w-full"
              pattern={REGEXP_ONLY_DIGITS}
            >
              <InputOTPGroup className="w-full">
                <InputOTPSlot
                  index={0}
                  className="p-6 py-8 !bg-transparent font-bold sm:text-xl w-full"
                />
                <InputOTPSlot
                  index={1}
                  className="p-6 py-8 !bg-transparent font-bold sm:text-xl w-full"
                />
                <InputOTPSlot
                  index={2}
                  className="p-6 py-8 !bg-transparent font-bold sm:text-xl w-full"
                />
              </InputOTPGroup>
              <InputOTPSeparator className=" text-neutral-700" />
              <InputOTPGroup className="w-full">
                <InputOTPSlot
                  index={3}
                  className="p-6 py-8 !bg-transparent font-bold sm:text-xl w-full"
                />
                <InputOTPSlot
                  index={4}
                  className="p-6 py-8 !bg-transparent font-bold sm:text-xl w-full"
                />
                <InputOTPSlot
                  index={5}
                  className="p-6 py-8 !bg-transparent font-bold sm:text-xl w-full"
                />
              </InputOTPGroup>
            </InputOTP>
            {errors.otp && (
              <span className="text-sm text-red-500 mt-2 block">
                {errors.otp.message}
              </span>
            )}
          </div>

          <div className="overflow-hidden w-full mt-40">
            <PrimaryButton
              text="Verify"
              type="submit"
              disabled={isSubmitting || !otpValue || otpValue.length < 6}
              className="py-6 text-[16px] font-extrabold"
            />
            <SecondaryButton
              text="Resend OTP"
              onClick={handleResendOtp}
              type="button"
              className="py-6 text-[16px] font-bold mt-4"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
