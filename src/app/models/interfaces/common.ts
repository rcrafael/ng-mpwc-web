import { Type } from "@angular/core";

export interface ISideBarMenu {
     id: number,
     name: string,
     url: string,
     label: string,
     icon: Type<any>,
}