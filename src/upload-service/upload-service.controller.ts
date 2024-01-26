import { Controller } from '@nestjs/common';
import { UploadServiceService } from './upload-service.service';

@Controller('upload-service')
export class UploadServiceController {
  constructor(private readonly uploadServiceService: UploadServiceService) {}
}
