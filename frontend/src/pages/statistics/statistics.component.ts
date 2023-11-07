import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { lastValueFrom, take } from 'rxjs';

import { TasksDoneComponent } from '@app/components/shared/charts/tasks-done/tasks-done.component';
import { WeeklyDoneComponent } from '@app/components/shared/charts/weekly-done/weekly-done.component';
import { IQueryResult } from '@app/scripts/models/query-result.interface';
import { ITask } from '@app/scripts/models/task.interface';
import { AngularMaterialModule } from '@app/scripts/modules/angular-material.module';
import { CustomComponentsModule } from '@app/scripts/modules/custom-components.module';
import { SharedService } from '@app/scripts/services/shared.service';
import { TaskService } from '@app/scripts/services/task.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, TranslateModule, FlexLayoutModule, AngularMaterialModule, ReactiveFormsModule, FormsModule, TasksDoneComponent, WeeklyDoneComponent, CustomComponentsModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsComponent implements OnInit {
  isLoading = true;

  tasks: ITask[] = [];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private taskService: TaskService,
    private sharedService: SharedService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.updateTitle();
    this.refreshAsync();
  }

  async refreshAsync(): Promise<void> {
    const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handlePromises(lastValueFrom(this.taskService.getAll()));
    if (!result || !result.success || error) return this.sharedService.handleSnackbars({ translationKey: 'task-list.refresh-error', error: true });

    this.tasks = result.data;
    this.isLoading = false;
    this.changeDetector.markForCheck();
  }

  updateTitle(): void {
    this.sharedService.handleTitle(this.translate.instant('title.statistics'));
    this.sharedService.onTitleChange.pipe(take(1)).subscribe(() => this.sharedService.handleTitle(this.translate.instant('title.statistics')));
  }
}
