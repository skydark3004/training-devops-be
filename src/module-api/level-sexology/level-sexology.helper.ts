import { Injectable, NotFoundException } from '@nestjs/common';
import { LevelSexologyEntity } from 'src/core/entity';
import { UpdateLevelSexologyDto } from './admin/dto';

@Injectable()
export class LevelSexologyHelper {
  constructor() {}

  getParamToUpdateLevelSexology(levelSexology: LevelSexologyEntity, body: UpdateLevelSexologyDto) {
    let listIdsLevelSexologyMapToDelete = levelSexology.listExercises.map((el) => el.id);
    const paramToInsertLevelSexologyMapExercise: any[] = [];
    const listParamToUpdateLevelSexologyMap: any[] = [];

    for (const [index, exercise] of body.listExericses.entries()) {
      if (exercise.id) {
        listIdsLevelSexologyMapToDelete = listIdsLevelSexologyMapToDelete.filter((el) => el !== exercise.id);

        const LevelSexologyMapFromDb = levelSexology.listExercises.find((el) => el.id === exercise.id);
        if (!LevelSexologyMapFromDb) throw new NotFoundException();

        // update practice day
        listParamToUpdateLevelSexologyMap.push({ id: LevelSexologyMapFromDb.id, exerciseId: exercise.exerciseId, index: index + 1 });
      }

      if (!exercise.id) {
        paramToInsertLevelSexologyMapExercise.push({
          index: index + 1,
          levelSexologyId: levelSexology.id,
          exerciseId: exercise.exerciseId,
        });
      }
    }

    return {
      listIdsLevelSexologyMapToDelete,
      paramToInsertLevelSexologyMapExercise,
      listParamToUpdateLevelSexologyMap,
    };
  }
}
