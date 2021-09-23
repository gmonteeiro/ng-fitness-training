import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

import { AuthData } from "./auth-data.model";
import { User } from "./user.model";

@Injectable()
export class AuthService {
    authChange = new Subject<boolean>();
    private user: User | any;

    constructor(private router: Router, private afAuth: AngularFireAuth){

    }

    registerUser(authData: AuthData) {
      this.afAuth.createUserWithEmailAndPassword(
        authData.email,
        authData.password
      )
      .then(result => {
        console.log(result);
        this.authSuccessfully();
      })
      .catch(error => {
        console.log(error);
      })
    }

    login(authData: AuthData) {
      this.afAuth.signInWithEmailAndPassword(
        authData.email,
        authData.password
      )
      .then(result => {
        console.log(result);
        this.authSuccessfully();
      })
      .catch(error => {
        console.log(error);
      })
    }

    logout() {
        this.user = null as any;
        this.authChange.next(false);
        this.router.navigate(['/login']);
    }

    getUser() {
        return { ...this.user };
    }

    isAuth() {
        return this.user != null;
    }

    private authSuccessfully() {
        this.authChange.next(true);
        this.router.navigate(['/training']);
    }
}
