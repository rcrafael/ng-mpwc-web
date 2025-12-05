export interface ISideBarMenu {
     id: number,
     name: string,
     url: string,
     label: string,
     icon: string,
     subItems?: ISideBarMenuSubItem[],
     visible: boolean
}

export interface ISideBarMenuSubItem {
     id: number,
     name: string,
     url: string,
     label: string
}

export interface IBranchCode {
     id: number,
     name: string,
}

export interface IGender {
     id: number,
     name: string,
}

export interface ICustomerType {
     id: number,
     name: string
}

export interface IPhase {
     id: number,
     name: string
}

export interface ITransactionStatus {
     id: number,
     name: string
}