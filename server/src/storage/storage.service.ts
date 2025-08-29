import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from '@aws-sdk/client-cloudfront';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ApiResponse, MulterFile } from 'src/common/types/types';
import { getRandomFilename, throwError } from 'src/common/utils/helpers';
import { GeneratePresignedUrlResponse } from './types';
import { GeneratePresignedUploadUrlDto } from './dto';
import { User } from '@prisma/client';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private cloudFrontClient: CloudFrontClient;

  private readonly bucketName: string;
  private readonly bucketRegion: string;
  private readonly accessKeyId: string;
  private readonly secretAccessKey: string;
  private readonly cloudFrontDistributionId: string;
  private readonly cloudFrontUrl: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>('BUCKET_NAME');
    this.bucketRegion = this.configService.get<string>('BUCKET_REGION');
    this.accessKeyId = this.configService.get<string>(
      'AWS_BUCKET_ACCESS_KEY_ID',
    );
    this.secretAccessKey = this.configService.get<string>(
      'AWS_BUCKET_SECRET_ACCESS_KEY',
    );
    this.cloudFrontDistributionId = this.configService.get<string>(
      'CLOUDFRONT_DISTRIBUTION_ID',
    );
    this.cloudFrontUrl = this.configService.get<string>('CLOUDFRONT_URL');

    if (
      !this.bucketName ||
      !this.bucketRegion ||
      !this.accessKeyId ||
      !this.secretAccessKey ||
      !this.cloudFrontDistributionId ||
      !this.cloudFrontUrl
    ) {
      throw new Error(
        'Missing required environment variables for StorageService',
      );
    }

    // Initialize AWS clients
    this.s3Client = new S3Client({
      region: this.bucketRegion,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    });

    this.cloudFrontClient = new CloudFrontClient({
      region: this.bucketRegion,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    });
  }

  async uploadFile(file: MulterFile) {
    try {
      const filename = `uploads/inventory/${getRandomFilename()}-${file.originalname}`;
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      const response = await this.s3Client.send(command);
      return { response, filename };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('File upload failed');
    }
  }

  async removeFile(filename: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: filename,
      });

      await this.s3Client.send(command);
      await this.invalidateCloudFrontCache(filename);
    } catch (error) {
      console.error('Error removing file:', error);
      throw new Error('File removal failed');
    }
  }

  private async invalidateCloudFrontCache(filename: string) {
    try {
      const invalidationCommand = new CreateInvalidationCommand({
        DistributionId: this.cloudFrontDistributionId,
        InvalidationBatch: {
          CallerReference: Date.now().toString(),
          Paths: {
            Quantity: 1,
            Items: [`/${filename}`],
          },
        },
      });

      await this.cloudFrontClient.send(invalidationCommand);
    } catch (error) {
      console.error('Error invalidating CloudFront cache:', error);
      throw new Error('Cache invalidation failed');
    }
  }

  getImageUrl(filename: string) {
    return `${this.cloudFrontUrl}/${filename}`;
  }

  async generatePresignedUploadUrl(
    user: User,
    dto: GeneratePresignedUploadUrlDto,
    expiresIn = 300, // default 5 minutes
  ): Promise<ApiResponse<GeneratePresignedUrlResponse[]>> {
    try {
      const urlPromises = dto.files.map(async (file) => {
        const key = `uploads/inventory/${getRandomFilename()}-${file.filename}`;
        const command = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          ContentType: file.filetype,
        });

        const uploadUrl = await getSignedUrl(this.s3Client, command, {
          expiresIn,
        });

        return { url: uploadUrl, key };
      });
      const response: GeneratePresignedUrlResponse[] =
        await Promise.all(urlPromises);

      return {
        message: 'Upload url generated',
        success: true,
        data: response,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to generate presigned url',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
