export interface ICustomerList {
     customerId: number;
     nationalId: string; //for future adoptability of national id and unified identifier (future use)
     accountNo: string;
     meterNo: string;
     alias: string;
     lastName: string;
     firstName: string;
     middleName: string;
     branchCode: number;
     address: string;
     customerType: number
}

export interface ICustomerProfile {
     customerId: number;
     nationalId: string; //for future adoptability of national id and unified identifier (future use)
     meterNo: string;
     alias: string;
     firstName: string;
     middleName: string;
     lastName: string;
     branchCode: number;
     address: string;
     gender: number;
     civilStatus: string;
     dateOfBirth: Date;
     occupation: string;
     educationLevel: string;
     noOfDependents: number;
     religion: string;
     annualIncome: number;
     dateAccepted: Date;
     dateUpdated: Date;
     updatedBy: string;
     customerType: number;
     phase: number;
     accountNo: string; //use for universal account number instead of customerId
     userId: number; //connect for user login if system is ready to go online
}