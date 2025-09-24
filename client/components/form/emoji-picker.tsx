"use client";
import {
  EmojiPicker as Picker,
  EmojiPickerSearch,
  EmojiPickerContent,
  EmojiPickerFooter,
} from "@/components/ui/emoji-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface EmojiPickerProps {
  children?: React.ReactNode;
  onEmojiClick: (emoji: string) => void;
  className?: string;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  children,
  onEmojiClick,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover onOpenChange={setIsOpen} open={isOpen}>
      <PopoverTrigger className={cn("", className)}>{children}</PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <Picker
          className="h-[342px]"
          onEmojiSelect={({ emoji }) => {
            setIsOpen(false);
            onEmojiClick(emoji);
          }}
        >
          <EmojiPickerSearch />
          <EmojiPickerContent />
          <EmojiPickerFooter className="text-white" />
        </Picker>
      </PopoverContent>
    </Popover>
  );
};
