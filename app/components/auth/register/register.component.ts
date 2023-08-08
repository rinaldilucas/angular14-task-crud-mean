import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { StatusCode } from 'status-code-enum';

import { CustomValidators } from '@app/scripts/validators/custom.validator';
import { ERole } from '@scripts/models/enum/role.enum';
import { IQueryResult } from '@scripts/models/queryResult.interface';
import { IUser } from '@scripts/models/user.interface';
import { AuthService } from '@services/auth.service';
import { SharedService } from '@services/shared.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private titleService: Title,
    private router: Router,
    private translate: TranslateService,
    private sharedService: SharedService,
  ) {
    this.form = this.formBuilder.group({
      email: [null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(150),
          Validators.pattern(CustomValidators.emailRegex),
        ],
        [CustomValidators.checkEmail(this.authService)],
      ],
      password: [null,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(150),
          CustomValidators.incremental,
          CustomValidators.sequential,
          CustomValidators.capitalized,
          CustomValidators.number,
          CustomValidators.specialCharacters,
        ]],
      confirmPassword: [null, [Validators.required, CustomValidators.equalsTo('password')]],
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle(`${this.translate.instant('title.register')} — Mean Stack Template`);
  }

  async registerAsync(): Promise<void> {
    if (!this.sharedService.isValidForm(this.form)) return;

    const user = { ...this.form.value, role: ERole.user } as IUser;
    const [result, error]: IQueryResult<IUser>[] = await this.sharedService.handlePromises(this.authService.register(user));
    if (!!error || !result || !result?.success) {
      if (error?.status === StatusCode.ClientErrorConflict) return this.sharedService.handleSnackbarMessages({ translationKey: 'register.email-error', success: false });
      else return this.sharedService.handleSnackbarMessages({ translationKey: 'register.create-error', success: false });
    }

    this.sharedService.handleSnackbarMessages({ translationKey: 'register.create-success' });
    this.router.navigate(['login']);
  }

  togglePasswordVisibility(event: MouseEvent): void {
    event.stopPropagation();
    this.showPassword = !this.showPassword;
  }
}
