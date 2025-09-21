import { ICustomerProfile } from "./ICustomer";

export interface IOfficialReceiptList {
     id: number;
     orNo: string;
     orDate: string;
     customerId: number;
     customer: ICustomerProfile;
     totalBillingAmount: number;
     totalShareAmount: number;
     totalAmountToPay: number;
     status: string;
}

export interface IOfficialReceiptHeader {
     id?: number;
     orNo: string;
     customerId: string;
     orDate: string;
     totalBillingAmount?: number;
     totalShareAmount?: number;
     totalAmountPay: number;
     seniorDiscount?: number;
     entryDate: string;
     createdBy: string;
     checkNo?: string;
     checkBank?: string;
     checkDate?: string;
     status: number;
     isPartSale?: boolean;
     isOutsideCollection?: boolean;
     outsideCustomerName?: string;
}

export interface IOfficialReceiptHeaderWithCustomer {
     id?: number;
     orNo: string;
     customerId: string;
     customer: ICustomerProfile;
     orDate: string;
     totalBillingAmount: number;
     totalShareAmount: number;
     totalAmountPay: number;
     seniorDiscount: number;
     entryDate: string;
     createdBy: string;
     checkNo?: string;
     checkBank?: string;
     checkDate?: string;
     status: number;
     isPartSale?: boolean;
     isOutsideCollection?: boolean;
     outsideCustomerName?: string;
     outsideCustomerAddress?: string;
}

export interface IOfficialReceiptWithDetails {
     header: IOfficialReceiptHeaderWithCustomer;
     details: IOfficialReceiptDetail[];
     shareCapital: IShareCapital;
     shareCbu: IShareCbu;
     shareSavings: IShareSavings;
}

export interface IOfficialReceiptDetail {
     id?:string;
     orNo?: string;
     readingNo: string;
     meterNo: string;
     readingAmountPaid: number;
     parts: number;
     membership: number;
     tapping: number;
     calibration: number;
     reconnection: number;
     subReceivable: number;
     penalty:number;
     otherCollection:number;
     otherDescription: string;
     maintenanceFee: number;
     seniorDiscount: number;
     septageFee: number;
     totalAmount: number;
     remarks: string;
     billingStatus: number;
}

export interface IShareCapital {
     id?: string;
     orNo: string;
     customerId: string;
     amount: number;
     entryDate: string;
     transactionType: number; // 1 = deposit, 2 = withdraw
}

export interface IShareCbu {
     id?: string;
     orNo: string;
     customerId: string;
     amount: number;
     entryDate: string;
     transactionType: number; // 1 = deposit, 2 = withdraw
}

export interface IShareSavings {
     id?: string;
     orNo: string;
     customerId: string;
     amount: number;
     entryDate: string;
     transactionType: number; // 1 = deposit, 2 = withdraw
}


export interface IOfficialReceipt {
     header: IOfficialReceiptHeader;
     details: IOfficialReceiptDetail[];
     shareCapital?: IShareCapital;
     cbu?: IShareCbu;
     savings?: IShareSavings;
}