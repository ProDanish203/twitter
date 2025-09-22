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
import { AtSign, Check, Globe, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const ComposeTweet = () => {
  const [postContent, setPostContent] = useState("");

  const handleCreatePost = () => {
    try {
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
        <div className="w-[calc(100%_-_40px)] ml-1">
          <div className="flex flex-col space-y-3 pl-2 border-b border-neutral-800 pb-3">
            <Textarea
              className="!bg-transparent resize-none border-none outline-none !text-lg focus:ring-0 focus-visible:ring-0 font-light w-full p-0 rounded-none"
              placeholder="What's happening?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
            <div>
              <PostOptionsDropdown />
            </div>
          </div>

          {/* Post options */}
          <div className="flex items-center justify-between gap-x-2 pt-2">
            <div></div>
            <div>
              <PrimaryButton text="Post" className="px-5 h-7" />
            </div>
          </div>
        </div>
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
      <DropdownMenuTrigger className="text-primary flex items-center gap-x-1 focus-visible:outline-none p-0 bg-transparent">
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
