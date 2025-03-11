export interface IOtherPaymentList {
     id: number;
     orNo: string;
     orDate: string;
     meterNo: string;
     customerId: number;
     customerName: string;
     totalAmountToPay: PaymentCurrencyAmount;
     status:string; 
}


export interface IOtherPaymentData {
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

export interface IOtherPaymentDetails {
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
