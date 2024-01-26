import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';

@Injectable()
export class UploadServiceService {
    private readonly awsS3: S3Client;

    constructor(private readonly configService: ConfigService) {
        this.awsS3 = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY,
            },
        });
    }

    /**
     * s3 이미지 업로드
     * @param file
     */
    async uploadFile(file: Express.Multer.File) {
        const uuid = v4();

        const uploadCommend = new PutObjectCommand({
            Bucket: 'nestjs-project-images',
            Key: uuid,
            Body: file.buffer,
            ACL: 'public-read',
            ContentType: file.mimetype,
        });

        await this.awsS3.send(uploadCommend);

        return `https://nestjs-project-images.s3.ap-northeast-2.amazonaws.com/${uuid}`;
    }
}
