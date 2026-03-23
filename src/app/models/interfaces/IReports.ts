export interface IReportNav {
     title: string;
     icon: string;
     route: string;
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
