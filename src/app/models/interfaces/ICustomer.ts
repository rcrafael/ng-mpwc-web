export interface ICustomerList {
     customerId: number;
     nationalId: string; //for future adoptability of national id and unified identifier (future use)
     accountNo: string;
     lastName: string;
     firstName: string;
     middleName: string;
     address: string;
}

export interface ICustomerProfile {
     id?: string;
     nationalId: string; //for future adoptability of national id and unified identifier (future use)
     firstName: string;
     middleName: string;
     lastName: string;
     address: string;
     gender: number;
     civilStatus: string;
     dateOfBirth: string;
     occupation: string;
     educationalLevel: string;
     numberOfDependent: number;
     religion: string;
     annualIncome: number;
     dateAccepted: string;
     dateUpdated?: string;
     updatedBy?: string;
     accountNo: string; //use for universal account number instead of customerId
     userId?: string | null; //connect for user login if system is ready to go online
     tin: string;
}