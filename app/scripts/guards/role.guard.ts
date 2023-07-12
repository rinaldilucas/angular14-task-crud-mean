import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { AuthService } from '@services/auth.service';
import { SharedService } from '@services/shared.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard {
  constructor(
    private authService: AuthService, //
    private router: Router,
    private sharedService: SharedService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const currentUser = this.authService.getLoggedUser();
    const expectedRole = route.data.expectedRole;

    if (currentUser.role === expectedRole) return true;

    this.sharedService.handleSnackbarMessages({ translationKey: 'messages.user-without-permission', success: false });
    this.router.navigate(['tasks']);
    return false;
  }
}
