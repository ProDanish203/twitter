import { Prisma } from '@prisma/client';

export const userSelect = {
  id: true,
  email: true,
  username: true,
  role: true,
  name: true,
  phone: true,
  avatar: true,
  createdAt: true,
  lastActiveAt: true,
  onboarded: true,
} satisfies Prisma.UserSelect;

export type UserSelect = Prisma.UserGetPayload<{
  select: typeof userSelect;
}>;
