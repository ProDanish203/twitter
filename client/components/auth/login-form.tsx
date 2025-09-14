"use client";
import { AppleButton, GoogleButton } from "@/app/(auth)/(login)/_components";
import Link from "next/link";
import { FloatingInput } from "@/components/form/floating-input";
import { emailSchema, type EmailSchema } from "@/validations/auth.validation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useLoginStore } from "@/store/login.store";
import { PrimaryButton, SecondaryButton } from "../common";

interface LoginFormProps {
  title: string;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  title,
  setActiveTab,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
  });

  const { setEmail } = useLoginStore();

  const onSubmit: SubmitHandler<EmailSchema> = (data) => {
    try {
      const result = emailSchema.safeParse(data);
      if (result.success) {
        // Initiate an api call that will check whether the user exists or not
        // Set the email to the store if the response is successful
        setEmail(data.email);
        // If the user exists, move to the password tab
        setActiveTab(1);
      } else {
        toast.error(result.error.issues[0].message);
      }
    } catch (err: any) {
      console.log(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-sm w-full mx-auto py-8 sm:px-6 px-4">
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <FloatingInput
              register={register}
              name="email"
              isError={!!errors.email}
              errorMessage={errors.email?.message}
              placeholder="Email"
              type="email"
              className=""
            />
          </div>

          <div className="overflow-hidden w-full">
            <PrimaryButton text="Next" type="submit" disabled={isSubmitting} />
          </div>
        </form>

        <Link
          href="/flow/forgot-password"
          className="block overflow-hidden w-full mt-6"
        >
          <SecondaryButton text="Forgot password?" />
        </Link>

        <p className="text-[15px] mt-10 block text-neutral-500">
          Don&apos;t have an account?{" "}
          <Link href="/flow/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
