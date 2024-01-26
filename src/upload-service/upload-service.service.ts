import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';

@Injectable()
export class UploadServiceService {
    private readonly awsS3: S3Client;

    constructor(private readonly configService: ConfigService) {
        this.awsS3 = new S3Client({
            region: 'ap-northeast-2',
            credentials: {
                accessKeyId: 'AKIA6PH7ZQOV3ERNQBH5',
                secretAccessKey: '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',
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
            // ACL: 'public-read',
            ContentType: file.mimetype,
        });

        await this.awsS3.send(uploadCommend);

        return `https://nestjs-project-images.s3.ap-northeast-2.amazonaws.com/${uuid}`;
    }
}
