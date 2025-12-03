import { cn } from "@/lib/utils";
import {
  BookmarkIcon,
  ChartNoAxesColumn,
  Heart,
  Link2,
  Mail,
  MessageCircle,
  PenLine,
  Repeat2,
  UploadIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Post } from "@/types/post";

interface PostCardFooterProps {
  stats: Post["stats"];
}

export const PostCardFooter: React.FC<PostCardFooterProps> = ({ stats }) => {
  return (
    <div className="flex items-center justify-between w-full gap-x-2 pb-2">
      {/* Comments button */}
      <button className="flex items-center group cursor-pointer outline-[#1d9bf0]">
        <div className="rounded-full p-2 group-hover:bg-[#1d9bf01a] transition-all duration-100">
          <MessageCircle className="size-4 text-neutral-700 group-hover:text-[#1d9bf0] transition-colors duration-100" />
        </div>
        <p className="text-neutral-700 text-sm group-hover:text-[#1d9bf0] transition-colors duration-100">
          {stats.commentsCount}
        </p>
      </button>
      {/* Repost count and dropdown */}
      <RepostDropdown
        repostsCount={stats.repostsCount}
        repostedByMe={stats.repostedByMe}
      />
      {/* Like button */}
      <button className="flex items-center group cursor-pointer outline-[#f918801a]">
        <div className="rounded-full p-2 group-hover:bg-[#f918801a] transition-all duration-100">
          <Heart
            className={cn(
              "size-4 text-neutral-700 group-hover:text-[#f91880] transition-colors duration-100",
              stats.likedByMe && "text-[#f91880] fill-[#f91880]"
            )}
          />
        </div>
        <p
          className={cn(
            "text-neutral-700 text-sm group-hover:text-[#f91880] transition-colors duration-100",
            stats.likedByMe && "text-[#f91880]"
          )}
        >
          {stats.likesCount}
        </p>
      </button>
      {/* View count */}
      <button className="flex items-center group cursor-pointer outline-[#1d9bf01a]">
        <div className="rounded-full p-2 group-hover:bg-[#1d9bf01a] transition-all duration-100">
          <ChartNoAxesColumn className="size-4 text-neutral-700 group-hover:text-[#1d9bf0] transition-colors duration-100" />
        </div>
        <p className="text-neutral-700 text-sm group-hover:text-[#1d9bf0] transition-colors duration-100">
          {stats.viewsCount}
        </p>
      </button>
      <div className="flex items-center">
        <div className="flex items-center group cursor-pointer outline-[#1d9bf01a] -mr-1">
          <div className="flex items-center justify-center rounded-full p-2 group-hover:bg-[#1d9bf01a] transition-all duration-100">
            <BookmarkIcon className="size-4 text-neutral-700 group-hover:text-[#1d9bf0] transition-colors duration-100" />
          </div>
        </div>
        <div>
          <ShareDropdown />
        </div>
      </div>
    </div>
  );
};

interface RepostDropdownProps {
  repostsCount: number;
  repostedByMe?: boolean;
}

const RepostDropdown: React.FC<RepostDropdownProps> = ({
  repostsCount,
  repostedByMe,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center group cursor-pointer outline-[#00a87b1a] max-xl:justify-center focus-visible:outline-none size-3.5">
        <div className="rounded-full p-2 group-hover:bg-[#00a87b1a] transition-all duration-100">
          <Repeat2
            className={cn(
              "size-4 text-neutral-700 group-hover:text-[#00a87b] transition-colors duration-100",
              repostedByMe && "text-[#00a87b]"
            )}
          />
        </div>
        <p
          className={cn(
            "text-neutral-700 text-sm group-hover:text-[#00a87b] transition-colors duration-100",
            repostedByMe && "text-[#00a87b]"
          )}
        >
          {repostsCount}
        </p>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        className="min-w-24 p-0 py-1 !rounded-[10px]"
      >
        <DropdownMenuItem className="rounded-none p-0 hover:!bg-neutral-950">
          <div className="w-full py-2.5 px-4 hover:bg-neutral-950 text-white sm:text-[15px] font-semibold flex items-center gap-x-2 cursor-pointer transition-all duration-200">
            <Repeat2 className="size-5 text-neutral-300" size={20} />
            <span>Repost</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="rounded-none p-0 hover:!bg-neutral-950">
          <div className="w-full py-2.5 px-4 hover:bg-neutral-950 text-white sm:text-[15px] font-semibold flex items-center gap-x-2 cursor-pointer transition-all duration-200">
            <PenLine className="size-5 text-neutral-300" size={20} />
            <span>Quote</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ShareDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center group cursor-pointer outline-[#1d9bf01a] px-0 py-0 max-xl:justify-center focus-visible:outline-none size-3.5">
        <div className="flex items-center justify-center rounded-full p-2 group-hover:bg-[#1d9bf01a] transition-all duration-100">
          <UploadIcon className="size-4 text-neutral-700 group-hover:text-[#1d9bf0] transition-colors duration-100" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-48 p-0 py-1 !rounded-[10px]"
      >
        <DropdownMenuItem className="rounded-none p-0 hover:!bg-neutral-950">
          <div className="w-full py-2.5 px-4 hover:bg-neutral-950 text-white sm:text-[15px] font-semibold flex items-center gap-x-4 cursor-pointer transition-all duration-200">
            <Link2 className="size-5 text-neutral-300 -rotate-45" size={20} />
            <span>Copy link</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="rounded-none p-0 hover:!bg-neutral-950">
          <div className="w-full py-2.5 px-4 hover:bg-neutral-950 text-white sm:text-[15px] font-semibold flex items-center gap-x-4 cursor-pointer transition-all duration-200">
            <UploadIcon className="size-5 text-neutral-300" size={20} />
            <span>Share post via...</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="rounded-none p-0 hover:!bg-neutral-950">
          <div className="w-full py-2.5 px-4 hover:bg-neutral-950 text-white sm:text-[15px] font-semibold flex items-center gap-x-4 cursor-pointer transition-all duration-200">
            <Mail className="size-5 text-neutral-300" size={20} />
            <span>Send via Direct Message</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
