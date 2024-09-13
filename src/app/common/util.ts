export class Utils {


public isTokenValid(token: string): boolean {
     if(token === null || token === '') {
          return false;
     }

     return true;
}

}