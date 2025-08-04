import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/services/prisma.service';
import { StorageService } from 'src/common/services/storage.service';
import { ApiResponse } from 'src/common/types/types';
import { throwError } from 'src/common/utils/helpers';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService,
  ) {}

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

  async uploadProfileImage(user: User) {
    try {
    } catch (err) {
      throw throwError(
        err.message || 'Failed to upload profile image',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUsername(user: User) {
    try {
    } catch (err) {
      throw throwError(
        err.message || 'Failed to update username',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
