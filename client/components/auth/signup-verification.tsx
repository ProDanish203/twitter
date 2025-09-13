"use client";
import { useSignupStore } from "@/store/signup-store";
import { OtpSchema, otpSchema } from "@/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "../ui/button";

export const SignupVerification = () => {
  const { setCurrentStep, setVerificationCode, email } = useSignupStore();

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OtpSchema>({
    resolver: zodResolver(otpSchema),
  });

  const otpValue = watch("otp")?.toString() ?? "";

  const handleResendOtp = () => {
    try {
      // Call an api to resend the otp code to the user's email
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const onSubmit: SubmitHandler<OtpSchema> = async (data) => {
    try {
      const result = otpSchema.safeParse(data);
      if (result.success) {
        // Call an api that will verify the otp code
        setVerificationCode(data.otp.toString());
        setCurrentStep(2);
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
          We sent you a code
        </h2>
        <p className="mt-2 block text-neutral-500 text-[15px]">
          Enter it below to verify {email}.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
          <div className="">
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
          <p
            className="mt-2 text-primary text-sm hover:underline cursor-pointer mb-4"
            onClick={handleResendOtp}
          >
            Didn&apos;t receive email?
          </p>

          <div className="overflow-hidden w-full mt-40 mb-8">
            <Button
              variant="secondary"
              type="submit"
              className="flex items-center justify-center w-full py-6 px-4 cursor-pointer hover:bg-secondary/90 h-10 rounded-full"
              disabled={isSubmitting || !otpValue || otpValue.length < 6}
            >
              <span className="text-[#0f1419] text-[16px] font-extrabold">
                Next
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
