import { BadRequestException, Injectable } from '@nestjs/common';
import { HelperParent } from '../welcome-video.helper-parent';
import { UpsertSexologyVideoDto, UpsertWelcomeVideoDto } from './dto';
import { TempFileRepository, WelcomeVideoRepository } from 'src/module-repository/repository';
import { In } from 'typeorm';
import { deleteFilesInFolder } from 'src/common';

@Injectable()
export class WelcomeVideoServiceAdmin {
  constructor(
    private helperParent: HelperParent,
    private readonly welcomeVideoRepository: WelcomeVideoRepository,
    private readonly tempFileRepository: TempFileRepository,
  ) {}

  async getCurrent() {
    const result = await this.helperParent.getCurrent();
    return result;
  }

  async upsert(body: UpsertWelcomeVideoDto) {
    const getByName = await this.welcomeVideoRepository.findOneByParams({ conditions: { code: 'DEFAULT' } });

    const listPathsNeedToDeleteInDb = [];
    const listFilesToDelete: string[] = [];
    if (getByName) {
      if (body.first !== getByName.first) {
        await this.tempFileRepository.typeOrm.findOneOrFail({ where: { path: body.first } });
        listFilesToDelete.push(getByName.first);
        listPathsNeedToDeleteInDb.push(body.first);
      }
      if (body.second !== getByName.second) {
        await this.tempFileRepository.typeOrm.findOneOrFail({ where: { path: body.second } });
        listFilesToDelete.push(getByName.second);
        listPathsNeedToDeleteInDb.push(body.second);
      }

      if (body.third !== getByName.third) {
        await this.tempFileRepository.typeOrm.findOneOrFail({ where: { path: body.third } });
        listFilesToDelete.push(getByName.third);
        listPathsNeedToDeleteInDb.push(body.third);
      }

      await this.welcomeVideoRepository.typeOrm.update({ code: 'DEFAULT' }, body);
      await this.tempFileRepository.typeOrm.delete({ path: In(listPathsNeedToDeleteInDb) });
    } else {
      const listPathsNeedToDeleteInDb = [body.first, body.second, body.third];
      const isExist = await this.tempFileRepository.findAllByParams({ conditions: { path: In(listPathsNeedToDeleteInDb) } });
      if (isExist.length !== 3) {
        throw new BadRequestException('Không tồn tại đường dẫn video');
      }
      await this.welcomeVideoRepository.typeOrm.save(body, { transaction: false });
      await this.tempFileRepository.typeOrm.delete({ path: In(listPathsNeedToDeleteInDb) });
    }

    deleteFilesInFolder(listFilesToDelete);

    return await this.getCurrent();
  }

  async upsertSexology(body: UpsertSexologyVideoDto) {
    const getByName = await this.welcomeVideoRepository.findOneByParams({ conditions: { code: 'DEFAULT' } });

    if (body.path !== getByName.sexology) {
      const isExist = await this.tempFileRepository.typeOrm.exists({ where: { path: body.path } });
      if (!isExist) throw new BadRequestException('Không tồn tại video');
    }

    if (getByName) {
      await this.welcomeVideoRepository.typeOrm.update({ code: 'DEFAULT' }, { sexology: body.path });
    } else {
      await this.welcomeVideoRepository.typeOrm.save({ sexology: body.path }, { transaction: false });
    }

    await this.tempFileRepository.typeOrm.delete({ path: body.path });

    return await this.getCurrent();
  }
}
