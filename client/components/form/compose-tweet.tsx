"use client";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { PrimaryButton } from "../common";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AtSign,
  CalendarClock,
  Check,
  Globe,
  ImageIcon,
  MapPin,
  Smile,
  Sparkle,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreatePostSchema,
  createPostSchema,
} from "@/validations/post.validation";
import { EmojiPicker } from "./emoji-picker";

export const ComposeTweet = () => {
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreatePostSchema>({
    resolver: zodResolver(createPostSchema),
  });

  const handleFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files;
      if (files) {
        // Handle file uploads
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreatePost: SubmitHandler<CreatePostSchema> = (data) => {
    try {
      const result = createPostSchema.safeParse(data);
      if (result.success) {
        // Call the API to create the post
        console.log("Post created:", data);
        toast.success("Post created successfully!");
        // Clear the textarea after successful post creation
        setValue("content", "");
      } else {
        toast.error(result.error.issues[0].message);
      }
    } catch (err) {
      toast.error("Failed to create post. Please try again.");
      console.error("Error creating post:", err);
    }
  };

  return (
    <div className="p-4 pb-2 border-b border-neutral-800">
      <div className="relative flex w-full items-start">
        {/* avatar */}
        <div className="shrink-0">
          <Image
            src={"/assets/images/user.webp"}
            alt="User avatar"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        </div>
        {/* input area */}
        <form
          onSubmit={handleSubmit(handleCreatePost)}
          className="w-[calc(100%_-_40px)] ml-1"
        >
          <div className="flex flex-col space-y-3 border-b border-neutral-800 pb-3">
            <Textarea
              className="!bg-transparent min-h-6 max-h-32 overflow-y-auto resize-none border-none outline-none !text-lg focus:ring-0 focus-visible:ring-0 font-light w-full p-0 rounded-none pl-2"
              placeholder="What's happening?"
              rows={0}
              {...register("content")}
            />
            <div>
              <PostOptionsDropdown />
            </div>
          </div>

          {/* Post options */}
          <div className="flex items-center justify-between gap-x-2 pt-2">
            <div className="flex items-center text-primary">
              <input
                type="file"
                multiple
                id="file-upload"
                className="hidden"
                onChange={handleFilesUpload}
              />
              <label
                htmlFor="file-upload"
                className="size-8 p-2 center rounded-full hover:bg-neutral-900 cursor-pointer transition-all duration-200"
              >
                <ImageIcon className="size-5" />
              </label>
              <div className="size-8 p-2 center rounded-full hover:bg-neutral-900 cursor-pointer transition-all duration-200">
                <Sparkle className="size-4" />
              </div>
              <EmojiPicker
                onEmojiClick={(emoji) => {
                  const currentContent = watch("content") || "";
                  setValue("content", currentContent + emoji);
                }}
                className="size-8 p-2 center rounded-full hover:bg-neutral-900 cursor-pointer transition-all duration-200"
              >
                <Smile className="size-4" />
              </EmojiPicker>
              <div className="size-8 p-2 center rounded-full hover:bg-neutral-900 cursor-pointer transition-all duration-200">
                <CalendarClock className="size-4" />
              </div>
              <div className="size-8 p-2 center rounded-full hover:bg-neutral-900 cursor-pointer transition-all duration-200">
                <MapPin className="size-4" />
              </div>
            </div>
            <div>
              <PrimaryButton
                text="Post"
                className="px-5 h-8 py-2"
                type="submit"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const PostOptionsDropdown = () => {
  const options = [
    {
      label: "Everyone",
      selectedText: "Everyone can reply",
      icon: Globe,
      value: "everyone",
    },
    {
      label: "People you follow",
      selectedText: "People you follow can reply",
      icon: User,
      value: "followers",
    },
    {
      label: "Only people you mention",
      selectedText: "Mentioned users can reply",
      icon: AtSign,
      value: "mention",
    },
  ];

  const [selectedOption, setSelectedOption] = useState<
    (typeof options)[number]
  >(options[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-primary flex items-center gap-x-1 focus-visible:outline-none p-0 bg-transparent rounded-full px-3 py-0.5 hover:bg-primary/10 transition-all duration-200 cursor-pointer">
        <Globe className="size-4" />
        <span className="text-sm break-words">
          {selectedOption.selectedText}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="py-4 px-2">
        <div>
          <DropdownMenuLabel className="text-white -mb-1">
            Who can reply?
          </DropdownMenuLabel>
          <p className="text-neutral-500 text-xs pl-2 mt-0">
            Choose who can reply to this post. <br /> Anyone mentioned can
            always reply
          </p>
        </div>
        <div className="mt-2 space-y-1">
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              className="relative flex items-center justify-between gap-x-1"
              onClick={() => setSelectedOption(option)}
            >
              <div className="flex items-center">
                <div className="bg-primary size-6 p-4 rounded-full relative flex items-center justify-center">
                  <option.icon className="size-4 text-white" />
                </div>
                <span className="ml-2 text-white">{option.label}</span>
              </div>
              <div className="relative">
                {selectedOption.value === option.value && (
                  <div>
                    <span className="size-1 rounded-full bg-white absolute top-1/2 transform -translate-y-1/2 right-10"></span>
                    <Check className="text-primary" />
                  </div>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
