import { PrismaService } from 'src/common/services/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FollowersService {
  constructor(private readonly prismaService: PrismaService) {}
}
