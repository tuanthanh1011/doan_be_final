import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly maxSize: number = 4096 * 1024; // 4MB

  transform(value: Express.Multer.File) {
    if (!value) throw new BadRequestException('File chưa được đính kèm');
    this.validateSize(value);
    this.validateFormat(value);
    return value;
  }

  private validateSize(file: Express.Multer.File): void {
    if (file.size > this.maxSize) {
      throw new BadRequestException(
        'Kích cỡ file quá lớn (Kích thước hợp lệ: <4MB)',
      );
    }
  }

  private validateFormat(file: Express.Multer.File): void {
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('File không đúng định dạng hình ảnh');
    }
  }
}
