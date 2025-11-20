import type { User } from '@/types/user.ts'

export interface Transaction {
  id:number,
  sender:User,
  receiver:User,
  type:string,
  amount:number,
  fees:number
  created_at:string
}

export interface TransactionStat {
  total_received:number,
  total_balance:number,
  total_sent: number
  total_commission:number,
}

export interface TransferMoney {
  receiver_id:number,
  amount:number,
}

export interface TransferMoneyStart {
  status : string,
  request_id:string
}
