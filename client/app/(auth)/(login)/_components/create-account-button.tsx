import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CreateAccountButtonProps {
  text?: string;
  className?: string;
}

export const CreateAccountButton: React.FC<CreateAccountButtonProps> = ({
  text,
  className,
}) => {
  return (
    <div className="overflow-hidden w-full">
      <Button
        variant="secondary"
        className={cn(
          "flex items-center justify-center w-full py-5 px-4 cursor-pointer hover:bg-secondary/90 h-10 rounded-full",
          className
        )}
      >
        <span className="text-[#0f1419] text-[15px] font-bold">
          {text || "Create account"}
        </span>
      </Button>
    </div>
  );
};
