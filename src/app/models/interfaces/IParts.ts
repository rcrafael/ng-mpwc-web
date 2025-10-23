export interface IPartsList {
     id: string,
     description: string,
     sellingPrice: number
}

export interface IPartItem {
     id: string,
     description: string,
     amount: string,
     remarks: string,
}

export interface IPartDetails {
     id?: string,
     description: string,
     measurement: string,
     unitCost: number,
     sellingPrice: number
}