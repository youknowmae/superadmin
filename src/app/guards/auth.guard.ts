import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return true  //la pang gamit to
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): boolean {
    var userLogState
    //prevent sst from reading sessionStorage
    if (!isPlatformBrowser(this.platformId)) {
        return false
    }

    userLogState = sessionStorage.getItem('userLogState')
    console.log(userLogState)
    if(userLogState == 'true'){
        return true
    }  

    sessionStorage.clear()
    this.router.navigate(['/login']);
    return false
  }
}
