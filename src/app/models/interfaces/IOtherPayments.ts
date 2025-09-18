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

export interface IOtherPaymentHeader {
     id?: number;
     orNo: string;
     customerId?: string;
     orDate: string;
     totalBillingAmount: number;
     totalAmountPay: number;
     entryDate: string;
     createdBy: string;
     checkNo?: string;
     checkBank?: string;
     checkDate?: string| null;
     status: number;
     isPartSale?: boolean;
     isOutsideCollection?: boolean;
     outsideCustomerName?: string;
}

export interface IOtherPaymentDetail {
     id?: string;
     orNo: string;
     partId: string;
     parts: number;
     remarks: string;
     totalAmount: number;
}

export interface IOtherPaymentPayload {
     header: IOtherPaymentHeader;
     details: IOtherPaymentDetail[];
}



export interface IOtherPaymentTableDetails {
     id: string;
     description: string;
     amount: string;
     remarks: string;
}
