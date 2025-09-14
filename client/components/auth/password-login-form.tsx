"use client";
import { FloatingInput, PasswordInput } from "@/components/form";
import { useLoginStore } from "@/store/login.store";
import { loginSchema, LoginSchema } from "@/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { PrimaryButton } from "../common";

export const PasswordLoginForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const { email } = useLoginStore();

  useEffect(() => {
    setValue("email", email);
  }, [email]);

  const onSubmit: SubmitHandler<LoginSchema> = (data) => {
    try {
      const result = loginSchema.safeParse(data);
      if (result.success) {
        // Initiate an api call that will check whether the user exists or not
      } else {
        toast.error(result.error.issues[0].message);
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-full mx-auto pb-8 sm:px-20 px-4">
      <div>
        <h2 className="md:text-3xl text-2xl break-words font-bold mb-8">
          Enter your password
        </h2>

        {/* Email Input */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <FloatingInput
              register={register}
              name="email"
              placeholder="Email"
              isError={false}
              type="email"
              className=""
              disabled
            />
          </div>

          <div className="mb">
            <PasswordInput
              register={register}
              name="password"
              placeholder="Password"
              type="password"
              className=""
              isError={!!errors.password}
              errorMessage={errors.password?.message}
            />
          </div>

          <Link
            href={"/flow/forgot-password"}
            className="text-[14px] text-primary/90 hover:underline mb-4 inline-block"
          >
            Forgot password?
          </Link>

          <div className="overflow-hidden w-full mt-40">
            <PrimaryButton
              text="Log in"
              type="submit"
              disabled={isSubmitting}
              className="py-6 text-[16px] font-extrabold"
            />
          </div>
        </form>

        <p className="mt-4 block text-neutral-500 text-[15px]">
          Don&apos;t have an account?{" "}
          <Link href="/flow/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
