import { Component, OnInit, OnDestroy} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { TrainingService } from '../training.service';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: any = [];
  exerciseSubscription!: Subscription;
  isLoading$: Observable<boolean>;

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);

    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(exercises => {
      this.exercises = exercises;
      console.log(exercises);
    });
    this.fetchExercises();
  }

  fetchExercises(){
    this.trainingService.fetchAvailableExcercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExcercise(form.value.exercise);
  }

  ngOnDestroy(){
    if(this.exerciseSubscription){
      this.exerciseSubscription.unsubscribe();
    }
  }
}
