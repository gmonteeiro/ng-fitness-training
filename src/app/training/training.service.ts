
import { Injectable } from '@angular/core';
import { Subject, Subscription, VirtualTimeScheduler } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { Exercise } from './exercise.model';
import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as fromRoot from '../app.reducer';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<any>();
  exercisesChanged = new Subject();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExcercises: Exercise[] = [];
  private runningExercise: Exercise | any;
  private fbSubs: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromRoot.State>) { }

  fetchAvailableExcercises() {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(this.db
      .collection('availableExercises')
      .snapshotChanges()
      .pipe(map(docArray => {
        // throw(new Error());
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
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
        this.exercisesChanged.next([ ...this.availableExcercises ]);
      }, error => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar('Fetching Exercises failed, please try again later', 'Close', 3000);
        this.exercisesChanged.next(null);
      })
    );
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
    this.fbSubs.push(this.db
      .collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises: Exercise[]|any) => {
        this.finishedExercisesChanged.next(exercises);
      })
    );
  }

  cancelSubscriptions(){
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise){
    console.log(exercise);
    this.db.collection('finishedExercises').add(exercise);
  }
};
