export interface IWaterRates {
     id?: string | null;
     groupRatingId?: string | null;
     heirarchy: number;
     from: number;
     to: number;
     ratingValue: number;
     description: string;
     isBaseAmount: boolean;
     isActive?: boolean;
}