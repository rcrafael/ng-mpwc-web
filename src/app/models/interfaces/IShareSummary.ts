export interface IShareSummary {
     id: string|null;
     customerId: string;
     totalShareCap: number;
     totalCbu: number;
     totalSavings: number;
     totalDividend: number;
     rate: number;
     totalPatronageRefundWater: number;
     totalPatronageRefundRefilling: number;
     dateCreated: string | null;
     createdBy: string | null;
     dateUpdated?: string | null;
     updatedBy?: string | null;
}