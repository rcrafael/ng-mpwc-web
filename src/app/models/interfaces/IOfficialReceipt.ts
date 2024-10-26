import { NumberValueAccessor } from "@angular/forms";

export interface IOfficialReceiptData {
     id: number;
     orNo: string;
     orDate: string;
     entryDate: string;
     createdby: string;
     meterNo: string;
     accountNo: number;
     customerId: number;
     shareCapital: number;
     cbu: number;
     savings: number;
     totalBillingAmount: number;
     totalShareAmount: number;
     shareAsPayment: number;
     seniorDiscount: number;
     totalAmountToPay: number;
     checkNo: string;
     checkBankName: string;
     checkDate: string;
     checkAmount: number;
     status: number;
     isOutsideCollection: boolean;
     outsideCustomerNameL: string;
     isPartSale: boolean;
}


export interface IOfficialReceiptList {
     id: number;
     orNo: string;
     orDate: string;
     customerId: number;
     meterNo: string;
     accountNo: string;
     customerName: string;
     totalBillingAmount: number;
     totalShareAmount: number;
     totalAmountToPay: number;
     status: string;
}

export interface IOfficialReceiptDetail {
     id:number;
     readingNo: number;
     mobileReadingNo: number;
     readingAmount: number;
     parts: number;
     maintenanceFee: number;
     septageFee: number;
     membershipFee: number;
     tapping: number;
     calibration: number;
     reconnection: number;
     subReceivable: number;
     penalty:number;
     otherCollection:number;
     otherDescription: string;
     seniorDiscount: number;
     remarks: string;
     totalAmount: number;
}