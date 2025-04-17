export interface IMeterDetails {
     id?: string;
     customerId: string;
     meterNo: string;
     serialNo: string;
     alias: string;
     branchCode: number;
     meterType: number;
     location: string;
     previous: number;
     present: number;
     status: number;
}
