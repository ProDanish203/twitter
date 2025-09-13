"use client";
import { useSignupStore } from "@/store/signup-store";
import {
  createPasswordSchema,
  CreatePasswordSchema,
} from "@/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { PasswordInput } from "../form";
import Link from "next/link";

export const SignupPasswordForm = () => {
  const { email, setCurrentStep } = useSignupStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CreatePasswordSchema>({
    resolver: zodResolver(createPasswordSchema),
  });

  const onSubmit: SubmitHandler<CreatePasswordSchema> = async (data) => {
    try {
      const result = createPasswordSchema.safeParse(data);
      if (result.success) {
        // Call an API to create the password for the user with the email from the store
        // Login the user based on its credentials
        // Navigate to the onboarding steps
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
          You&apos;ll need a password
        </h2>
        <p className="mt-2 block text-neutral-500 text-[15px]">
          Make sure it&apos;s 8 characters or more.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
          <div className="">
            <PasswordInput
              register={register}
              className=""
              name="password"
              placeholder="Password"
              isError={!!errors.password}
            />
            {errors.password && (
              <span className="text-[12px] break-words text-red-500/80">
                {errors.password?.message}
              </span>
            )}
          </div>

          <div className="overflow-hidden w-full mt-40 mb-8">
            <p className="text-[11px] text-neutral-500 mb-4 break-words">
              By signing up, you agree to the{" "}
              <Link href="#" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              , including{" "}
              <Link href="#" className="text-primary hover:underline">
                Cookie Use
              </Link>
              . X may use your contact information, including your email address
              and phone number for purposes outlined in our Privacy Policy, like
              keeping your account secure and personalizing our services,
              including ads.{" "}
              <Link href="#" className="text-primary hover:underline">
                Learn more
              </Link>
              . Others will be able to find you by email or phone number, when
              provided, unless you choose otherwise{" "}
              <Link href="#" className="text-primary hover:underline">
                here
              </Link>
              .
            </p>
            <Button
              variant="secondary"
              type="submit"
              className="flex items-center justify-center w-full py-6 px-4 cursor-pointer hover:bg-secondary/90 h-10 rounded-full"
              disabled={isSubmitting || !isDirty}
            >
              <span className="text-[#0f1419] text-[16px] font-extrabold">
                Sign up
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
