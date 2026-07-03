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
}

export interface IReportTypes {
     id: number;
     title: string;
     api: string;
     filters: {
          startDate: boolean;
          endDate: boolean;
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
