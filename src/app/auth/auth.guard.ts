import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, CanLoad } from "@angular/router";
import { Store } from "@ngrx/store";
import { take } from "rxjs/operators";

import * as fromRoot from '../app.reducer';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private store: Store<fromRoot.State>, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.store.select(fromRoot.getIsAuth);
  }

  canLoad(route: Route): any {
    return this.store.select(fromRoot.getIsAuth).pipe(take(1));
  }
}
