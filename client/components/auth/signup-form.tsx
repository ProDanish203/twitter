"use client";
import { useSignupStore } from "@/store/signup-store";
import { FloatingInput } from "../form";
import { Button } from "../ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema, signupSchema } from "@/validations/auth.validation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { months, days, years } from "@/lib/utils";

export const SignupForm = () => {
  const { setCurrentStep } = useSignupStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit: SubmitHandler<SignupSchema> = (data) => {
    try {
      const result = signupSchema.safeParse(data);
      if (result.success) {
        // Initiate an api call that will check whether the user exists or not
        setCurrentStep(1);
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
          Create your account
        </h2>

        {/* Email Input */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <FloatingInput
              register={register}
              name="name"
              type="text"
              placeholder="Name"
              className=""
              isError={!!errors.name}
              errorMessage={errors.name?.message}
            />
          </div>

          <div className="mb">
            <FloatingInput
              register={register}
              name="email"
              placeholder="Email"
              type="email"
              className=""
              isError={!!errors.email}
              errorMessage={errors.email?.message}
            />
          </div>

          <div className="mt-8">
            <p className="mb-1">Date of birth</p>
            <p className="block text-neutral-500 text-sm">
              This will not be shown publicly. Confirm your own age, even if
              this account is for a business, pet, or something else.
            </p>

            {/* Date inputs */}
            <div className="mt-4 flex items-center gap-x-3 justify-between w-full">
              {/* Month input */}
              <Select onValueChange={(value) => setValue("month", value)}>
                <SelectTrigger className="w-[180px] rounded-[4px] !bg-transparent border-neutral-800 py-6">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent className="max-h-80 rounded-[4px]">
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Day input */}
              <Select onValueChange={(value) => setValue("day", value)}>
                <SelectTrigger className="w-[90px] rounded-[4px] !bg-transparent border-neutral-800 py-6">
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent className="max-h-80 rounded-[4px]">
                  {days.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Year input */}
              <Select onValueChange={(value) => setValue("year", value)}>
                <SelectTrigger className="w-[130px] rounded-[4px] !bg-transparent border-neutral-800 py-6">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="max-h-80 rounded-[4px]">
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-hidden w-full mt-32">
            <Button
              variant="secondary"
              type="submit"
              className="flex items-center justify-center w-full py-6 px-4 cursor-pointer hover:bg-secondary/90 h-10 rounded-full"
              disabled={isSubmitting || !isDirty}
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
