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
     readingNo: string; 
     mobileReadingNo: string;
     meterNo: string;
     customerId: string; //CustId
     accountId: string;
     billingMonth: string; //MonthOf
     billingStart: string; //DateFrom
     billingEnd: string; //DateTo
     billingDueDate: string; //DueDate
     previousM3: number; //previous
     presentM3: number; //present
     m3Used: number; 
     rate: number; 
     billingAmount: number; //readingAmount
     partsAmount: number; //parts
     maintenanceFee: number; 
     lessAmount: number;
     totalAmount: number;
     septageFee: number;
     remarks: string;
     status: string;
}