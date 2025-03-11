export class Utils {


     public isTokenValid(token: string): boolean {
          if(token === null || token === '') {
               return false;
          }

          return true;
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

}