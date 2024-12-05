export interface IGetActualPracticeDayIds {
  levelOfCustomerId: string;
  actualPracticeDayIds: string[];
}

export interface IGetNumberOfCompleteDoneExerciseGroupByExerciseId {
  exerciseId: string;
  totalCompleted: string;
  total: string;
  exercise: {
    id: string;
    name: string;
    thumbnail: any;
  };
}

export interface IGetListExerciseOfPracticeDayMapExercise {
  exerciseId: string;
  total: string;
  exercise: {
    id: string;
    name: string;
    thumbnail: any;
  };
}

export interface IGetListActualExerciseOfActualPracticeDayMapExercise {
  exerciseId: string;
  totalCompleted: string;
}
