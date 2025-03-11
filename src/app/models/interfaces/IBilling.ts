export interface IBillingList {
     readingNo: string;
     meterNo: string;
     customerId: string;
     accountId: string;
     firstName: string;
     middleName: string;
     lastName: string;
     alias: string;
     branchCode: number;
     address:string;
     billingMonth: string;
     billingStart: string;
     billingEnd: string;
     billingDueDate: string;
     totalAmount: number;
     status: string;
}

export interface IBillingInfo {
     readingNo?: string; 
     meterNo: string;
     customerId: string; 
     accountId?: string;
     monthOf: number; 
     dateFrom: string; 
     dateTo: string; 
     dueDate: string; 
     previous: number; 
     present: number; 
     m3Used: number; 
     rating: number; 
     readingAmount: number;
     parts: number; 
     maintenanceFee: number; 
     lessAmount: number;
     totalAmount: number;
     septageFee: number;
     remarks: string;
     status: string;
}

export interface IWaterRates {
     id: string;
     groupRatingId: string;
     heirarchy: number;
     from: number;
     to: number;
     ratingValue: number;
     description: string;
     isBaseAmount: boolean;
     isActive: boolean;
}