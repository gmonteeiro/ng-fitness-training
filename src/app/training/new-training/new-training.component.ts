import { Component, OnInit, OnDestroy} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';

import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: any = [];
  exerciseSubscription!: Subscription;
  loadingSubs!: Subscription;
  isLoading: boolean = false;

  constructor(private trainingService: TrainingService, private uiService: UIService) { }

  ngOnInit() {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    });

    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(exercises => {
      this.exercises = exercises;
    });
    this.trainingService.fetchAvailableExcercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExcercise(form.value.exercise);
  }

  ngOnDestroy(){
    this.exerciseSubscription.unsubscribe();
    this.loadingSubs.unsubscribe();
  }

}
