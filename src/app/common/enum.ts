import { IBranchCode, IGender, ICustomerType, IPhase, ITransactionStatus, ISideBarMenu } from "../models/interfaces/ICommon"


 export const naviMenus: ISideBarMenu[] = [
    {
      id: 1,
      name: 'dashboard',
      url: '/dashboard',
      label:'Dashboard',
      icon: '/assets/icons/chart-pie.svg'
    },
    {
      id: 2,
      name: 'customers',
      url: '/customer',
      label:'Customer',
      icon: '/assets/icons/group.svg'
    },
    {
      id: 3,
      name: 'or-payment',
      url: '/payment/official-receipt',
      label:'OR Payment',
      icon: '/assets/icons/payments.svg'
    },
    {
      id: 4,
      name: 'other-payment',
      url: '/payment/other-receipt',
      label:'Other Payment',
      icon: '/assets/icons/bank-notes.svg'
    },
    {
      id: 5,
      name: 'billing',
      url: '/billing',
      label:'Billing',
      icon: '/assets/icons/newspaper.svg'
    },
    {
      id: 6,
      name:'other-transaction',
      url: '/other-transaction',
      label:'Others',
      icon: '/assets/icons/dynamic-feed.svg'
    },
    {
      id: 7,
      name:'reports',
      url: '/reports',
      label:'Reports',
      icon: '/assets/icons/reports.svg'
    },
    {
      id: 8,
      name:'settings',
      url: '/settings',
      label:'Settings',
      icon: '/assets/icons/settings-gear.svg',
      subItems: [
        {
          id: 1,
          name: 'parts',
          url: '/settings/water-rates',
          label:'Water Rates'
        },
        {
          id: 2,
          name: 'parts',
          url: '/settings/parts',
          label:'Parts Master List'
        },
        {
          id: 3,
          name: 'default-values',
          url: '/settings/default-values',
          label:'Default Values'
        },
      ]
    } 
  ]


export const branchCodeData: IBranchCode[] = [
  { id: 1, name: 'Patubig' },
  { id: 2, name: 'Mahabang Parang' },
  { id: 3, name: 'Sta. Rosa' },
  { id: 4, name: 'Duhat' },
]
  
export const genderData: IGender[] = [
  { id: 1, name: 'Male' },
  { id: 2, name: 'Female' },
]

export const customerTypeData: ICustomerType[] = [
  { id: 1, name: 'Residential' },
  { id: 2, name: 'Commercial' },
]

export const phaseData: IPhase[] = [
  { id: 1, name: 'Phase 1'},
  { id: 2, name: 'Phase 2'},
]

export const transactionStatus: ITransactionStatus[] = [
  { id: 1, name: 'Complete' },
  { id: 2, name: 'Inclomplete' },
  { id: 3, name: 'Pending'},
  { id: 4, name: 'Void'},
  { id: 5, name: 'Rejected'},
  { id: 6, name: 'Active'},
  { id: 7, name: 'Inactive'},
  { id: 8, name: 'Disposed'},
  { id: 9, name: 'Deleted'},
]