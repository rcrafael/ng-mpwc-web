import { IBranchCode, IGender, ICustomerType, IPhase, ITransactionStatus } from "../models/interfaces/ICommon"

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
  { id: 8, name: 'Disposed'}
]