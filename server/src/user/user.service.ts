import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { StorageService } from 'src/common/services/storage.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService,
  ) {}
}
