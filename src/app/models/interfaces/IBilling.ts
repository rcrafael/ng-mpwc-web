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
}

export interface IBillingInfo {
     readingNo: string;
     meterNo: string;
     customerId: string;
     accountId: string;
     billingMonth: string;
     billingStart: string;
     billingEnd: string;
     billingDueDate: string;
     previousM3: number;
     presentM3: number;
     m3Used: number;
     rate: number;
     billingAmount: number;
     partsAmount: number;
     maintenanceFee: number;
     lessAmount: number;
     totalAmount: number;
     remarks: string;
}