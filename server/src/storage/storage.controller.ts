import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { StorageService } from './storage.service';
import { User, UserRole } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { GeneratePresignedUploadUrlDto } from './dto';

@UseGuards(AuthGuard)
@ApiTags('Storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Generate presigned upload urls' })
  @Post('generate-upload-urls')
  async createPost(
    @CurrentUser() user: User,
    @Body() dto: GeneratePresignedUploadUrlDto,
  ) {
    return await this.storageService.generatePresignedUploadUrl(user, dto);
  }
}
