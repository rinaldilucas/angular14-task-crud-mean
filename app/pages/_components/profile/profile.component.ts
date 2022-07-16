import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { IUser } from '@app/scripts/models/user.interface';
import { UserService } from '@app/scripts/services/user.service';
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

    constructor(
        private userService: UserService,
        private authService: AuthService,
        private titleService: Title,
        private formBuilder: FormBuilder,
        private translateService: TranslateService,
        private router: Router,
        private sharedService: SharedService,
        private changeDetector: ChangeDetectorRef,
    ) {
        this.form = this.formBuilder.group({
            password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(150)]],
        });
    }

    ngOnInit(): void {
        this.sharedService.inputErrorListener.subscribe(() => this.changeDetector.detectChanges());
        this.translateService.get('title.profile').subscribe((text: string) => this.titleService.setTitle(`${text} — Mean Stack Template`));
    }

    async saveAsync(): Promise<void> {
        if (!this.sharedService.isValidForm(this.form)) return;

        const password = this.form.controls['password'].value;
        const [, error] = await this.sharedService.handlePromises(this.userService.changePassword(this.authService.getUserId(), password));
        if (!!error) this.sharedService.handleSnackbarMessages('profile.edit-error', false);

        this.sharedService.handleSnackbarMessages('profile.edit-success');
        this.form.reset();
        this.router.navigate(['tasks']);
    }
}
