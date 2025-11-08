export interface IMeterDetails {
     id?: string;
     customerId: string;
     meterNo: string;
     serialNo: string;
     alias: string;
     branchCode: number;
     phase: number;
     customerType: number;
     location: string;
     previous: number;
     present: number;
     status: number;
}
