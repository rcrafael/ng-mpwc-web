import { Component, OnInit } from '@angular/core';
import { CommonStyles } from '../../../common/common-styles';
import { NgClass } from '@angular/common';
import { Utils } from '../../../common/util';
import { IReportFilters, IReportTypes } from '../../../models/interfaces/IReports';
import { CollectionApi } from '../../../common/constants';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportsService } from '../../../services/reports.service';


@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [
    NgClass,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.css'
})
export class CollectionComponent implements OnInit {

  constructor(
    private reportService: ReportsService
  ) { }

  commonStyles = new CommonStyles();
  datePresetStyles: string = "border border-gray-200 rounded-md p-2 w-24 md:lg:w-full text-center bg-blue-500 text-white hover:bg-blue-700 cursor-pointer";
  activeCard: number = 0;
  dateFormatter = Utils.dateFormatter;

  collectionReports: IReportTypes[] = [
    {
      id: 1,
      title: "Collection Report Summary",
      api: CollectionApi.GET_COLLECTION_REPORT_SUMMARY,
      filters: {
        startDate: true,
        endDate: true,
        branchCode: false,
        phase: false
      }
    },
    {
      id: 2,
      title: "Collection Report - Detailed",
      api: CollectionApi.GET_COLLECTION_REPORT_SUMMARY,
      filters: {
        startDate: true,
        endDate: true,
        branchCode: true,
        phase: true
      }
    }
  ]

  reportFilters: IReportFilters = {
    startDate: this.dateFormatter(new Date().toLocaleString(), 'yyyy-MM-dd'),
    endDate: this.dateFormatter(new Date().toLocaleString(), 'yyyy-MM-dd'),
    branchCode: "-1",
    phase: "-1"
  }

  selectedReportType!: IReportTypes;

  formGroup = new FormGroup({
    startDate: new FormControl<string>(''),
    endDate: new FormControl<string>(''),
    branchCode: new FormControl<string>(''),
    phase: new FormControl<string>('')
  })

  ngOnInit(): void {
    this.formGroup.patchValue({
      startDate: this.reportFilters.startDate,
      endDate: this.reportFilters.endDate,
      branchCode: this.reportFilters.branchCode,
      phase: this.reportFilters.phase
    });

  }

  onDatePresetClick(preset: string) {

    if (preset == "Daily") {
      this.reportFilters.startDate = new Date().toLocaleDateString();
      this.reportFilters.endDate = new Date().toLocaleDateString();
    }
    else if (preset == "Weekly") {
      this.reportFilters.startDate = this.subtractDate(this.reportFilters.startDate, 6); // 6 -because date should be inclusive. 7 days a week.
      this.reportFilters.endDate = new Date().toLocaleDateString();
    }
    else if (preset == "Monthly") {
      const date = new Date();
      const numberOfDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      this.reportFilters.startDate = this.subtractDate(date.toLocaleDateString(), numberOfDays);
      this.reportFilters.endDate = new Date().toLocaleDateString();
    }
    else if (preset == "Yearly") {
      const date = new Date();
      this.reportFilters.startDate = new Date(date.getFullYear(), 0, 1).toLocaleDateString();
      this.reportFilters.endDate = new Date(date.getFullYear(), 11, 31).toLocaleString();
    }

    this.formGroup.patchValue({
      startDate: this.dateFormatter(this.reportFilters.startDate, 'yyyy-MM-dd'),
      endDate: this.dateFormatter(this.reportFilters.endDate, 'yyyy-MM-dd')
    });

    console.log('start date', this.reportFilters.startDate);
    console.log('end date', this.reportFilters.endDate);
    console.log('form group', this.formGroup.value);
  }

  subtractDate(date: string, daysToSubtract: number): string {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - daysToSubtract);
    return newDate.toLocaleDateString();
  }

  isGenerating: boolean = false;

  onGenerateReportClick() {
    if (!this.selectedReportType) return;

    this.isGenerating = true;

    const params = this.formGroup.getRawValue(); // getRawValue includes disabled controls

    this.reportService.generateReport(params, this.selectedReportType.api)
      .then((buffer: ArrayBuffer) => {
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `${this.selectedReportType.title}_${params.startDate}_${params.endDate}.xlsx`;
        anchor.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Failed to generate report', error);
      })
      .finally(() => {
        this.isGenerating = false;
      });
  }

  onReportTypeClick(report: IReportTypes) {
    console.log('report', report);
    this.selectedReportType = report;
    this.activeCard = report.id;
    
    //disabled the filter based on the report type
    Object.entries(report.filters).forEach(([key, shouldEnabled]) => {
      const control = this.formGroup.get(key);
      if (!control) return;

      if (shouldEnabled) {
        control.enable();
      } else {
        control.disable();
      }
    });
  }

}
