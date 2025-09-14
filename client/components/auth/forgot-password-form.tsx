"use client";
import { FloatingInput } from "@/components/form/floating-input";
import { useForgotPasswordStore } from "@/store/forgot-password.store";
import { VerificationOption } from "@/types/auth";
import {
  forgotPasswordSchema,
  ForgotPasswordSchema,
} from "@/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SetStateAction } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { PrimaryButton } from "../common";

interface ForgotPasswordFormProps {
  setActiveTab: React.Dispatch<SetStateAction<number>>;
  setVerificationOptions: React.Dispatch<SetStateAction<VerificationOption[]>>;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  setActiveTab,
  setVerificationOptions,
}) => {
  const { setIdentifier } = useForgotPasswordStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit: SubmitHandler<ForgotPasswordSchema> = async (data) => {
    try {
      const result = forgotPasswordSchema.safeParse(data);
      if (result.success) {
        // Initiate an api call that will return the options that user can use to receive the confirmation code based on the provided identifier.
        setIdentifier(data.identifier);
        setActiveTab(1);
        // setVerificationOptions()
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
          Find your X account
        </h2>
        <p className="mt-2 block text-neutral-500 text-[15px]">
          Enter the email, phone number, or username associated with your
          account to change your password.
        </p>

        {/* Identifier Input */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
          <div className="mb-6">
            <FloatingInput
              register={register}
              name="identifier"
              placeholder="Email, phone number, or username"
              isError={!!errors.identifier}
              errorMessage={errors.identifier?.message}
              type="text"
              className=""
            />
          </div>

          <div className="overflow-hidden w-full mt-40">
            <PrimaryButton
              text="Next"
              type="submit"
              disabled={isSubmitting || !!errors.identifier}
              className="py-6 text-[16px] font-extrabold"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
