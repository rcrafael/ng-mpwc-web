import { formatCurrency, formatDate, formatNumber } from "@angular/common";

export class Utils {


     public isTokenValid(token: string): boolean {
          if(token === null || token === '') {
               return false;
          }

          return true;
     }

     public static sanitizeAmount(amount: String): number {
          return parseFloat(amount.replace(/,/g, ''));
     }

     public static getStatusName(statusId: number): string {

          switch(statusId) {
               case 1:
                    return 'Complete';
               case 2:
                    return 'Incomplete';
               case 3:
                    return 'Pending';
               case 4:
                    return 'Void';
               case 5:
                    return 'Rejected';
               case 6:
                    return 'Active';
               case 7:
                    return 'Inactive';
               default:
                    return 'Unknown';
          }

     }

     public static getBranchCode(branchCode: number): string{
          switch(branchCode) {
               case 1:
                    return 'Patubig';
               case 2:
                    return 'Mahabang Parang';
               case 3: 
                    return 'Santa Rosa';
               case 4:
                    return 'Duhat';
               default:
                    return 'Unknown';
          }
     }

     public static getCustomerType(customerType: number): string {
          switch(customerType) {
               case 1:
                    return 'Residential';
               case 2:
                    return 'Commercial';
               default:
                    return 'Unknown';
          }
     }

     public static getPhase(phase: number): string {
          switch(phase) {
               case 1:
                    return 'Phase 1';
               case 2:
                    return 'Phase 2';
               default:
                    return 'Unknown';
          }
     }

     public static formatCurrency(currency: number): string { 
          let amount = formatCurrency(currency, 'en-Ph', '₱ ','PHP');
          return amount;
     }

     public static getMonth(month: number): string {
          const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov','Dec'];
          return months[month - 1];
     }

     public static dateFormatter(date: string, format: string = "MMM dd yyyy"): string {
          const d = new Date(date);
          return formatDate(d, format, 'en-PH');
     }
 
     public static formatNumber(number: number): string {
          return new Intl.NumberFormat('en-PH',{style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2}).format(number);
     }

}