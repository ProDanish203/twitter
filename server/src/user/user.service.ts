import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/services/prisma.service';
import { StorageService } from 'src/common/services/storage.service';
import { ApiResponse } from 'src/common/types/types';
import { throwError } from 'src/common/utils/helpers';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async getProfile(
    user: User,
  ): Promise<ApiResponse<Omit<User, 'password' | 'salt'>>> {
    try {
      const userProfile = await this.prismaService.user.findUnique({
        where: { id: user.id },
        omit: {
          password: true,
          salt: true,
        },
      });

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

  async updateProfile(user: User) {
    try {
    } catch (err) {
      throw throwError(
        err.message || 'Failed to update user profile',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteProfile(user: User) {
    try {
    } catch (err) {
      throw throwError(
        err.message || 'Failed to delete user profile',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
