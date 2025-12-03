import { Post } from "@/types/post";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { PostCardFooter } from "./post-card-footer";

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
