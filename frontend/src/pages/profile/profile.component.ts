import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

import { IQueryResult } from '@app/scripts/models/query-result.interface';
import { IUser } from '@app/scripts/models/user.interface';
import { AuthService } from '@app/scripts/services/auth.service';
import { SharedService } from '@app/scripts/services/shared.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  isSaving = false;
  isLoading = true;
  user!: IUser;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private router: Router,
    private sharedService: SharedService,
  ) {
    this.form = this.formBuilder.group({
      password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(150)]],
    });
  }

  ngOnInit(): void {
    this.updateTitle();
  }

  async saveAsync(): Promise<void> {
    if (!this.sharedService.isValidForm(this.form)) return;

    const password = this.form.controls.password.value;
    const [result, error]: IQueryResult<IUser>[] = await this.sharedService.handlePromises(this.authService.changePassword(this.authService.getUserId(), password));
    if (!result || !result.success || error) return this.sharedService.handleSnackbars({ translationKey: 'profile.edit-error', error: true });

    this.sharedService.handleSnackbars({ translationKey: 'profile.edit-success' });
    this.form.reset();
    this.router.navigate(['tasks']);
  }

  updateTitle(): void {
    this.sharedService.handleTitle(this.translate.instant('title.profile'));
    this.sharedService.onTitleChange.pipe(take(1)).subscribe(() => this.sharedService.handleTitle(this.translate.instant('title.profile')));
  }

  togglePasswordVisibility(event: MouseEvent): void {
    event.stopPropagation();
    this.showPassword = !this.showPassword;
  }
}
