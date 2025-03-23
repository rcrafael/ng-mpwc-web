import { ICustomerProfile } from "./ICustomer";

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