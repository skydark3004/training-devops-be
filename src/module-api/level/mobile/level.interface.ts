export interface IGetListExerciseDoneGroupByExericseId {
  exerciseId: string;
  totalDone: string;
}

export interface IGetListExerciseGroupByExericseId {
  exerciseId: string;
  total: string;
  exercise: {
    id: string;
    name: string;
    thumbnail: string;
  };
}
