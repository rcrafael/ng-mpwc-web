import { ICustomerProfile } from "./ICustomer";
import { IMeterDetails } from "./IMeter";

export interface IBillingList {
     readingNo: string;
     meterNo: string;
     customerId: string;
     customer: ICustomerProfile;
     monthOf: string;
     dateFrom: string;
     dateTo: string;
     dueDate: string;
     totalAmount: number;
     status: string;
}

export interface IBillingInfo {
     readingNo?: string; 
     meterNo: string;
     meterInfo?: IMeterDetails;
     customerId: string; 
     customer?: ICustomerProfile;
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
     status: number;
}

export interface IUpdateBilling {
     id: string;
     readingNo: string;
     monthOf: number;
     dateFrom: string;
     dateTo: string;
     dueDate: string;
     previous: number; 
     present: number; 
     m3Used: number; 
     readingAmount: number;
     parts: number; 
     maintenanceFee: number; 
     totalAmount: number;
     septageFee: number;
}
