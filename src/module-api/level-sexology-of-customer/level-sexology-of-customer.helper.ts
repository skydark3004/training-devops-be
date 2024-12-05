import { Injectable } from '@nestjs/common';

import { ExerciseRepository } from 'src/module-repository/repository';

@Injectable()
export class LevelOfCustomerHelper {
  constructor(private readonly exerciseRepository: ExerciseRepository) {}
}
