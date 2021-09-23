
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

import { Exercise } from './exercise.model';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<any>();
  exercisesChanged = new Subject();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExcercises: Exercise[] = [];
  private runningExercise: Exercise | any;

  constructor(private db: AngularFirestore) { }

  fetchAvailableExcercises() {
    this.db
    .collection('availableExercises')
    .snapshotChanges()
    .pipe(map(docArray => {
      return docArray.map(doc => {
        const data = doc.payload.doc.data() as Exercise
        return {
          id: doc.payload.doc.id,
          name: data.name,
          duration: data.duration,
          calories: data.calories
        };
      });
    }))
    .subscribe((exercises: Exercise[]) => {
      console.log(exercises);
      this.availableExcercises = exercises;
      this.exercisesChanged.next([ ...this.availableExcercises ]);
    });
  }

  startExcercise(selectedId: string) {
    // this.db.doc('availableExercises/' + selectedId).update({lastSelected: new Date()});
    this.runningExercise = this.availableExcercises.find(ex => ex.id === selectedId);
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise(){
    this.addDataToDatabase({ ...this.runningExercise, date: new Date(), state: 'completed' });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number){
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise(){
    return { ...this.runningExercise };
  }

  fetchCompletedOrCancelledExercises(){
    this.db
      .collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises: Exercise[]|any) => {
        this.finishedExercisesChanged.next(exercises);
      });
  }

  private addDataToDatabase(exercise: Exercise){
    console.log(exercise);
    this.db.collection('finishedExercises').add(exercise);
  }
};
