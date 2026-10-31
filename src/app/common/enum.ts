import { IBranchCode, IGender, ICustomerType, IPhase, ITransactionStatus, ISideBarMenu } from "../models/interfaces/ICommon"


export interface IPageDefinition {
  code: string;
  label: string;
  description: string;
}

export const ALL_PAGE_DEFINITIONS: IPageDefinition[] = [
  { code: 'dashboard', label: 'Dashboard', description: 'Overview and analytical charts' },
  { code: 'customer', label: 'Customer', description: 'Customer profiles and meter assignments' },
  { code: 'billing', label: 'Billing', description: 'Meter readings and bill creation' },
  { code: 'payment_or', label: 'OR Payment', description: 'Official receipt payment processing' },
  { code: 'payment_other', label: 'Other Payment', description: 'Miscellaneous and non-OR collections' },
  { code: 'reports', label: 'Reports', description: 'Collection and billing reports' },
  { code: 'settings', label: 'Settings', description: 'Water rates, parts master list, and default values' },
  { code: 'admin_users', label: 'Administration', description: 'User accounts and page access configuration' },
];

 export const naviMenus: ISideBarMenu[] = [
    {
      id: 1,
      name: 'dashboard',
      url: '/dashboard',
      label:'Dashboard',
      icon: '/assets/icons/chart-pie.svg',
      visible: true,
      pageCode: 'dashboard'
    },
    {
      id: 2,
      name: 'customers',
      url: '/customer',
      label:'Customer',
      icon: '/assets/icons/group.svg',
      visible: true,
      pageCode: 'customer'
    },
    {
      id: 3,
      name: 'or-payment',
      url: '/payment/official-receipt',
      label:'OR Payment',
      icon: '/assets/icons/payments.svg',
      visible: true,
      pageCode: 'payment_or'
    },
    {
      id: 4,
      name: 'other-payment',
      url: '/payment/other-receipt',
      label:'Other Payment',
      icon: '/assets/icons/bank-notes.svg',
      visible: true,
      pageCode: 'payment_other'
    },
    {
      id: 5,
      name: 'billing',
      url: '/billing',
      label:'Billing',
      icon: '/assets/icons/newspaper.svg',
      visible: true,
      pageCode: 'billing'
    },
    {
      id: 6,
      name:'other-transaction',
      url: '/other-transaction',
      label:'Others',
      icon: '/assets/icons/dynamic-feed.svg',
      visible: false
    },
    {
      id: 7,
      name:'reports',
      url: '/reports',
      label:'Reports',
      icon: '/assets/icons/reports.svg',
      visible: true,
      pageCode: 'reports'
    },
    {
      id: 8,
      name:'settings',
      url: '/settings',
      label:'Settings',
      icon: '/assets/icons/settings-gear.svg',
      visible: true,
      pageCode: 'settings',
      subItems: [
        {
          id: 1,
          name: 'water-rates',
          url: '/settings/water-rates',
          label:'Water Rates',
          pageCode: 'settings'
        },
        {
          id: 2,
          name: 'parts',
          url: '/settings/parts',
          label:'Parts Master List',
          pageCode: 'settings'
        },
        {
          id: 3,
          name: 'default-values',
          url: '/settings/default-values',
          label:'Default Values',
          pageCode: 'settings'
        },
      ]
    },
    {
      id: 9,
      name:'admin',
      url: '/admin',
      label:'Administration',
      icon: '/assets/icons/admin-panel.svg',
      visible: true,
      pageCode: 'admin_users',
      subItems: [
        {
          id: 1,
          name: 'users',
          url: '/admin/users',
          label:'Users',
          pageCode: 'admin_users'
        },
        {
          id: 2,
          name: 'page-access',
          url: '/admin/page-access',
          label:'Page Access',
          pageCode: 'admin_users'
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