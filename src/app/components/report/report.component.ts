import { Component, OnInit, ɵbypassSanitizationTrustResourceUrl } from '@angular/core';
import { CommonStyles } from '../../common/common-styles';
import { NgClass } from '@angular/common';
import { Utils } from '../../common/util';
import { IReportFilters, IReportTypes } from '../../models/interfaces/IReports';
import { ReportsApi } from '../../common/constants';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportsService } from '../../services/reports.service';
import { ToastrService } from 'ngx-toastr';
import { ReportCardsComponent } from './report-cards/report-cards.component';
import { branchCodeData, phaseData } from '../../common/enum';
import { IBranchCode, IPhase } from '../../models/interfaces/ICommon';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    NgClass,
    FormsModule,
    ReactiveFormsModule,
    ReportCardsComponent
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit {

  constructor(
    private reportService: ReportsService,
    private toastr: ToastrService
  ) { }

  commonStyles = new CommonStyles();
  activeCard: number = 0;
  yearDefault: number = new Date().getFullYear();
  dateFormatter = Utils.dateFormatter;
  isGenerating: boolean = false;

  availableYears: number[] = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - i);
  branchCodes: IBranchCode[] = branchCodeData;
  phases: IPhase[] = phaseData;

  reports: IReportTypes[] = [
    {
      id: 1,
      title: "Collection Report Summary",
      type: "collection",
      icon: "/assets/icons/payments.svg",
      api: ReportsApi.GET_COLLECTION_REPORT_SUMMARY,
      filters: {
        startDate: true,
        endDate: true,
        branchCode: true,
        phase: true,
        yearOnly: false
      }
    },
    {
      id: 2,
      title: "Collection Report Detailed",
      type: "collection",
      icon: "/assets/icons/payments.svg",
      api: ReportsApi.GET_COLLECTION_REPORT_DETAILED,
      filters: {
        startDate: true,
        endDate: true,
        branchCode: true,
        phase: true,
        yearOnly: false
      }
    },
    {
      id: 3,
      title: "Customer Meter Usage Summary",
      type: "customer",
      icon: "/assets/icons/group.svg",
      api: ReportsApi.GET_CUSTOMER_METER_USAGE_SUMMARY,
      filters: {
        startDate: false,
        endDate: false,
        branchCode: false,
        phase: false,
        yearOnly: true
      }
    }
  ];

  reportFilters: IReportFilters = {
    startDate: this.dateFormatter(new Date().toLocaleString(), 'yyyy-MM-dd'),
    endDate: this.dateFormatter(new Date().toLocaleString(), 'yyyy-MM-dd'),
    branchCode: "-1",
    phase: "-1",
    year: this.yearDefault
  };

  selectedReportType!: IReportTypes;

  formGroup = new FormGroup({
    startDate: new FormControl<string>(''),
    endDate: new FormControl<string>(''),
    year: new FormControl<number | null>(this.yearDefault),
    branchCode: new FormControl<string>(''),
    phase: new FormControl<string>('')
  });

  get isYearOnly(): boolean {
    return !!this.selectedReportType?.filters?.yearOnly;
  }

  get groupedReports(): { type: string; reports: IReportTypes[] }[] {
    const groupMap = new Map<string, IReportTypes[]>();
    for (const report of this.reports) {
      const list = groupMap.get(report.type) || [];
      list.push(report);
      groupMap.set(report.type, list);
    }
    return Array.from(groupMap.entries()).map(([type, reports]) => ({
      type,
      reports
    }));
  }

  ngOnInit(): void {
    this.formGroup.patchValue({
      startDate: this.reportFilters.startDate,
      endDate: this.reportFilters.endDate,
      year: this.reportFilters.year,
      branchCode: this.reportFilters.branchCode,
      phase: this.reportFilters.phase
    });

    if (this.reports.length > 0) {
      this.onReportTypeClick(this.reports[0]);
    }
  }

  onYearChange(yearVal: number | string): void {
    const yearNum = Number(yearVal);
    this.reportFilters.year = yearNum;
    this.reportFilters.startDate = `${yearNum}-01-01`;
    this.reportFilters.endDate = `${yearNum}-12-31`;

    this.formGroup.patchValue({
      year: yearNum,
      startDate: `${yearNum}-01-01`,
      endDate: `${yearNum}-12-31`
    });
  }

  onReportTypeClick(report: IReportTypes): void {
    this.selectedReportType = report;
    this.activeCard = report.id;

    Object.entries(report.filters).forEach(([key, shouldEnabled]) => {
      if (key === 'yearOnly') {
        key = 'year';
      }
      const control = this.formGroup.get(key);
      if (!control) return;

      if (shouldEnabled) {
        control.enable();
      } else {
        control.disable();
      }
    });

    if (report.filters.yearOnly) {
      const currentYear = this.formGroup.get('year')?.value || this.yearDefault;
      this.onYearChange(currentYear);
    }
  }

  onGenerateReportClick(): void {
    if (!this.selectedReportType) {
      this.toastr.warning('Please select a report type first.', 'Warning');
      return;
    }

    this.isGenerating = true;
    const rawParams = this.formGroup.getRawValue();
    const activeParams = this.formGroup.value;

    this.reportService.generateReport(activeParams, this.selectedReportType.api)
      .then((buffer: ArrayBuffer) => {
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;

        const fileSuffix = this.selectedReportType.filters.yearOnly
          ? `${rawParams.year}`
          : `${rawParams.startDate}_${rawParams.endDate}`;
        anchor.download = `${this.selectedReportType.title}_${fileSuffix}.xlsx`;
        anchor.click();
        window.URL.revokeObjectURL(url);
        this.toastr.success('Report generated successfully!', 'Success');
      })
      .catch(error => {
        console.error('Failed to generate report', error);
        this.toastr.error('Failed to generate report. Please try again.', 'Error');
      })
      .finally(() => {
        this.isGenerating = false;
      });
  }

}
