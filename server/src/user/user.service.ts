import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/common/services/prisma.service';
import { StorageService } from 'src/common/services/storage.service';
import { ApiResponse, MulterFile, QueryParams } from 'src/common/types/types';
import { throwError } from 'src/common/utils/helpers';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UpdateUserNameDto } from './dto/user-common.dto';
import { minimalUserSelect, userSelect } from './queries';
import {
  GetAllUserResponse,
  StatsAction,
  UserStatsNumericFields,
} from './types';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async getAllUsers(
    user: User,
    query?: QueryParams,
  ): Promise<ApiResponse<GetAllUserResponse>> {
    try {
      const {
        page = 1,
        limit = 20,
        search = '',
        filter = '',
        sort = '',
      } = query || {};

      const where: Prisma.UserWhereInput = {
        deletedAt: null,
        id: { not: user.id },
      };
      const orderBy: Prisma.UserOrderByWithRelationInput = {};

      if (search) {
        where.OR = [
          { username: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (filter) orderBy[filter] = 'asc';
      if (sort) orderBy[sort] = 'desc';

      const [users, totalCount] = await Promise.all([
        this.prismaService.user.findMany({
          select: userSelect,
          where,
          orderBy,
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
        }),
        this.prismaService.user.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / Number(limit));

      // TODO: Generate signedurls for user images

      return {
        message: 'Users retrieved successfully',
        success: true,
        data: {
          users,
          pagination: {
            totalCount,
            totalPages,
            page: Number(page),
            limit: Number(limit),
            hasNextPage: Number(page) < totalPages,
            hasPrevPage: Number(page) > 1,
          },
        },
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to retrieve users',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProfile(
    user: User,
  ): Promise<ApiResponse<Omit<User, 'password' | 'salt' | 'providerId'>>> {
    try {
      const userProfile = await this.prismaService.user.findUnique({
        where: { id: user.id },
        omit: {
          password: true,
          salt: true,
          providerId: true,
        },
      });

      // TODO: Generate signedurls for user images

      return {
        message: 'User profile retrieved successfully',
        success: true,
        data: userProfile,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to retrieve user profile',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserProfile(
    userId: string,
  ): Promise<ApiResponse<Omit<User, 'password' | 'salt'>>> {
    try {
      const userProfile = await this.prismaService.user.findUnique({
        where: { id: userId },
        omit: {
          password: true,
          salt: true,
        },
      });

      if (!userProfile)
        throw throwError('User not found', HttpStatus.NOT_FOUND);

      // TODO: Generate signedurls for user images

      return {
        message: 'User profile retrieved successfully',
        success: true,
        data: userProfile,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to retrieve user profile',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProfile(
    user: User,
    dto: UpdateUserProfileDto,
  ): Promise<ApiResponse<Omit<User, 'password' | 'salt' | 'providerId'>>> {
    try {
      // check for email uniqueness
      const userProfile = await this.prismaService.user.findUnique({
        where: { id: user.id },
        omit: {
          password: true,
          salt: true,
          providerId: true,
        },
      });

      if (dto.email) {
        const existingUser = await this.prismaService.user.findUnique({
          where: { email: dto.email.trim().toLowerCase() },
        });

        if (existingUser && existingUser.id !== userProfile.id) {
          throw throwError('Email already exists', HttpStatus.BAD_REQUEST);
        }
      }
      const updatedUser = await this.prismaService.user.update({
        where: { id: user.id },
        data: {
          email: dto.email ? dto.email.trim().toLowerCase() : userProfile.email,
          name: dto.name ? dto.name.trim() : userProfile.name,
          bio: dto.bio ? dto.bio.trim() : userProfile.bio,
          city: dto.city ? dto.city.trim() : userProfile.city,
          country: dto.country ? dto.country.trim() : userProfile.country,
          gender: dto.gender ? dto.gender : userProfile.gender,
          birthDate: dto.birthDate
            ? new Date(dto.birthDate)
            : userProfile.birthDate,
        },
        omit: {
          password: true,
          salt: true,
          providerId: true,
        },
      });

      if (!updatedUser)
        throw throwError(
          'Failed to update user profile',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

      return {
        message: 'User profile updated successfully',
        success: true,
        data: updatedUser,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to update user profile',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteProfile(user: User): Promise<ApiResponse<void>> {
    try {
      await this.prismaService.user.update({
        where: { id: user.id },
        data: { deletedAt: new Date() },
      });

      return {
        message: 'User profile deleted successfully',
        success: true,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to delete user profile',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadProfileImage(
    user: User,
    image: MulterFile,
  ): Promise<ApiResponse<Omit<User, 'password' | 'salt' | 'providerId'>>> {
    try {
      if (!image || !image.filename)
        throw throwError('No image file provided', HttpStatus.BAD_REQUEST);

      const imageUrl = await this.storageService.uploadFile(image);
      if (!imageUrl)
        throw throwError(
          'Failed to upload image',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

      const updatedUser = await this.prismaService.user.update({
        where: { id: user.id },
        data: { avatar: imageUrl.filename },
        omit: {
          password: true,
          salt: true,
          providerId: true,
        },
      });

      // TODO: Generate signedurls for user images

      return {
        message: 'Profile image uploaded successfully',
        success: true,
        data: updatedUser,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to upload profile image',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUsername(
    user: User,
    { username }: UpdateUserNameDto,
  ): Promise<ApiResponse<Omit<User, 'password' | 'salt' | 'providerId'>>> {
    try {
      const usernameExists = await this.prismaService.user.findUnique({
        where: { username },
      });

      if (usernameExists && usernameExists.id !== user.id)
        throw throwError('Username already exists', HttpStatus.BAD_REQUEST);

      const updatedUser = await this.prismaService.user.update({
        where: { id: user.id },
        data: { username: username.trim().toLowerCase() },
        omit: {
          password: true,
          salt: true,
          providerId: true,
        },
      });

      return {
        message: 'Username updated successfully',
        success: true,
        data: updatedUser,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to update username',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUserStats<T extends UserStatsNumericFields>(
    userId: string,
    field: T,
    action: StatsAction,
    count: number = 1,
  ) {
    try {
      const updateData: Prisma.UserStatsUpdateInput = {
        [field]: {
          [action]: count,
        } as Prisma.IntFieldUpdateOperationsInput,
        lastStatsUpdate: new Date(),
      };

      await this.prismaService.userStats.update({
        where: {
          userId,
        },
        data: updateData,
      });
    } catch (err) {
      throw throwError(
        err.message || 'Failed to update user stats',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserByQuery<T extends Prisma.UserSelect>(
    where: Prisma.UserWhereInput,
    select: T = minimalUserSelect as T,
  ): Promise<ApiResponse<Prisma.UserGetPayload<{ select: T }>[]>> {
    try {
      const users = await this.prismaService.user.findMany({
        where,
        select,
      });

      // TODO: Generate signedurls for user images

      return {
        message: 'Users retrieved successfully',
        success: true,
        data: users,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to get users',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
