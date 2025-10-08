import { Post } from "@/types/post";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import {
  BookmarkIcon,
  ChartNoAxesColumn,
  Heart,
  MessageCircle,
  Repeat2,
  UploadIcon,
} from "lucide-react";
import { Button } from "../ui/button";

interface PostCardProps {
  post: Post;
  type: "FEED" | "REPLY" | "QUOTE" | "REPOST" | "SINGLE";
  className?: string;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  type,
  className,
}) => {
  const { author, media, stats } = post;
  return (
    <Card className="bg-transparent border-b border-b-neutral-800 p-0 rounded-none w-full">
      <CardHeader>
        {/* Author details */}
        <div></div>
        {/* Post Options */}
        <div></div>
      </CardHeader>
      {/* Post Content */}
      <CardContent></CardContent>
      {/* Post Stats */}
      <CardFooter>
        <PostCardFooter stats={stats} />
      </CardFooter>
    </Card>
  );
};

interface PostCardFooterProps {
  stats: Post["stats"];
}

const PostCardFooter: React.FC<PostCardFooterProps> = ({ stats }) => {
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
      {/* Repost button */}
      <button className="flex items-center group cursor-pointer outline-[#00a87b1a]">
        <div className="rounded-full p-2 group-hover:bg-[#00a87b1a] transition-all duration-100">
          <Repeat2 className="size-4 text-neutral-700 group-hover:text-[#00a87b] transition-colors duration-100" />
        </div>
        <p className="text-neutral-700 text-sm group-hover:text-[#00a87b] transition-colors duration-100">
          {stats.repostsCount}
        </p>
      </button>
      {/* Like button */}
      <button className="flex items-center group cursor-pointer outline-[#f918801a]">
        <div className="rounded-full p-2 group-hover:bg-[#f918801a] transition-all duration-100">
          <Heart className="size-4 text-neutral-700 group-hover:text-[#f91880] transition-colors duration-100" />
        </div>
        <p className="text-neutral-700 text-sm group-hover:text-[#f91880] transition-colors duration-100">
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
      <div className="flex items-center gap-x-1">
        <div>
          <BookmarkIcon className="size-4 text-neutral-700" />
        </div>
        <div>
          <UploadIcon className="size-4 text-neutral-700" />
        </div>
      </div>
    </div>
  );
};
