import { Injectable } from '@nestjs/common';
import 'moment-timezone';
import { TempFileRepository } from 'src/module-repository/repository';

@Injectable()
export class UploadServiceAdmin {
  constructor(private readonly tempFileRepository: TempFileRepository) {}

  async uploadFile(file: Express.Multer.File, folder: string) {
    const path = `${folder}/${file.filename}`;
    const entity = this.tempFileRepository.typeOrm.create({ path: path });
    const create = await this.tempFileRepository.typeOrm.save(entity);
    return { path: create.path };
  }
}
