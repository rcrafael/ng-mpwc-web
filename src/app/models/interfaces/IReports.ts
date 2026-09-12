export interface IReportNav {
     title: string;
     icon: string;
     route: string;
}

export interface IReportFilters {
     startDate: string;
     endDate: string;
     branchCode: string;
     phase: string;
     year: number;
}

export interface IReportTypes {
     id: number;
     title: string;
     api: string;
     type: string;
     icon?: string;
     filters: {
          startDate: boolean;
          endDate: boolean;
          yearOnly: boolean;
          branchCode: boolean;
          phase: boolean;
     }
}

export interface IDashboardDataCards {
     userCount: number;
     activeMeterCount: number;
     totalCubicMeterUsage: number;
     totalUnpaidBillingAmount: number;
     totalOfficialReceiptAmount: number;
     totalOtherCollectionAmount: number;
     totalShareCapAmount: number;
     totalCbuAmount: number;
}
