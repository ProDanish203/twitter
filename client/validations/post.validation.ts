import { PostVisibility } from "@/types/post";
import { z } from "zod";

const createPostSchema = z.object({
  content: z
    .string()
    .max(280, { message: "Post can't be longer than 280 characters" })
    .optional(),
  media: z.array(z.string()).max(10).optional(),
  mentions: z.array(z.string()).optional(),
  visibility: z.enum(Object.values(PostVisibility)).optional(),
  tags: z.array(z.string()).optional(),
  parentId: z.string().optional(),
  repostId: z.string().optional(),
});

type CreatePostSchema = z.infer<typeof createPostSchema>;

export { createPostSchema, type CreatePostSchema };
