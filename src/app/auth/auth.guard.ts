import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, CanLoad } from "@angular/router";

import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    if(this.authService.isAuth()){
      return true;
    }else{
      this.router.navigate(['/login']);
    }
  }

  canLoad(route: Route): any {
    if(this.authService.isAuth()){
      return true;
    }else{
      this.router.navigate(['/login']);
    }
  }
}
