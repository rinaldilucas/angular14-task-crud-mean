import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';

import { TranslateService } from '@ngx-translate/core';
import { ChartOptions, ChartTitleOptions, ChartTooltipOptions, ChartType } from 'chart.js';
import { Label, MultiDataSet } from 'ng2-charts';
import { take } from 'rxjs/operators';

import { Unsubscriber } from '@app/components/shared/unsubscriber.component';
import { IQueryResult } from '@app/scripts/models/queryResult.interface';
import { ITask } from '@scripts/models/task.interface';
import { SharedService } from '@services/shared.service';
import { TaskService } from '@services/task.service';

@Component({
    selector: 'app-weekly-done',
    templateUrl: './weekly-done.component.html',
    styleUrls: ['./weekly-done.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeeklyDoneComponent extends Unsubscriber implements OnInit {
    tasks!: ITask[];
    chartType: ChartType = 'line';
    chartLabels: Label[] = [];
    chartData: MultiDataSet = [];
    chartOptions: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: { enabled: true },
        legend: { display: false },
        title: { display: true },
        scales: {
            yAxes: [{
                gridLines: {
                    lineWidth: 0.5
                },
                ticks: {
                    display: true,
                    maxTicksLimit: 3,

                    minor: {
                        fontSize: 14
                    }
                }
            }],
            xAxes: [{
                gridLines: {
                    display: false
                },
                ticks: {
                    minor: {
                        fontSize: 14
                    }
                }
            }]
        }
    };

    constructor (
        private taskService: TaskService, //
        private sharedService: SharedService,
        private changeDetector: ChangeDetectorRef,
        private translateService: TranslateService,
        private media: MediaObserver
    ) {
        super();
    }

    ngOnInit (): void {
        this.refresh();
        this.taskService.taskEmitter.pipe(take(1)).subscribe(() => this.refresh());
    }

    async refresh (): Promise<ITask | void> {
        this.translateService.get('statistics.tasks-done-weekly').pipe(take(1)).subscribe((text) => {
            (this.chartOptions.title as any).text = text;
            this.changeDetector.markForCheck();
        });

        const numberOfWeeks = 4;
        const weekDays = 7;
        const startDate = new Date();
        const finalDate = new Date();
        startDate.setDate(finalDate.getDate() - (weekDays * (numberOfWeeks + 1)));

        const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handlePromises(this.taskService.getTasksByDateInterval({ startDate, finalDate }));
        if (!!error || !result || !result?.success) return this.sharedService.handleSnackbarMessages({ translationKey: 'task-list.refresh-error', success: false });
        this.tasks = result.data;

        this.verifyResolutions();

        for (let index = 0, j = numberOfWeeks; j > 0; index++, j--) {
            const initialDate = new Date();
            initialDate.setDate(initialDate.getDate() - (weekDays * (index + 1)));
            const finalDate = new Date();
            finalDate.setDate(finalDate.getDate() - (weekDays * index));

            const tasksByInterval = this.tasks.filter((task) => {
                const taskDate = new Date(task.createdAt);
                return taskDate >= initialDate && taskDate <= finalDate;
            });

            this.chartData.push(tasksByInterval.length as any);
            this.chartLabels.push(`${finalDate.getDate().toLocaleString('default', { minimumIntegerDigits: 2, useGrouping: false })}/${(finalDate.getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}`);
        }
        this.chartData.reverse();
        this.chartLabels.reverse();

        this.changeDetector.markForCheck();
    }

    verifyResolutions (): void {
        this.addSubscription(this.media.asObservable().subscribe((change: MediaChange[]) => {
            if (change[0].mqAlias === 'lt-md' || change[0].mqAlias === 'sm' || change[0].mqAlias === 'xs') {
                (this.chartOptions.title as ChartTitleOptions).fontSize = 20;
                (this.chartOptions.tooltips as ChartTooltipOptions).titleFontSize = 22;
                (this.chartOptions.tooltips as ChartTooltipOptions).bodyFontSize = 22;
                this.chartOptions.scales?.yAxes?.forEach((yAxis) => { (yAxis as any).ticks.minor.fontSize = 14; });
                this.chartOptions.scales?.xAxes?.forEach((xAxis) => { (xAxis as any).ticks.minor.fontSize = 14; });
            } else {
                (this.chartOptions.title as ChartTitleOptions).fontSize = 16;
                (this.chartOptions.tooltips as ChartTooltipOptions).titleFontSize = 14;
                (this.chartOptions.tooltips as ChartTooltipOptions).bodyFontSize = 14;
                this.chartOptions.scales?.yAxes?.forEach((yAxis) => { (yAxis as any).ticks.minor.fontSize = 14; });
                this.chartOptions.scales?.xAxes?.forEach((xAxis) => { (xAxis as any).ticks.minor.fontSize = 14; });
            }
            this.changeDetector.markForCheck();
        }));
    }
}
