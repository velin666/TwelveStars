import { GetQueryString } from '@/util'

/** 活动名 */
export const activityName = 'twelve_stars_' + (GetQueryString('month') || 'Sept')

// 声明 webridge > state > userData接口规范
export interface UserData {
  birthday: string
  charm: number
  city: string
  headImgIconUrl: string
  is_mobile_phone?: number
  nickname: string
  sex: number
  token: string
  treasure: number
  uid: number
  user_number?: number
  /** 优先显示suid，没有值再用uid+10000显示 */
  suid?: number
}

/** 对象类型 等同于Record<string | number, any> */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IObject<T = any> = {
  [attrName in string | number]: T
}

/**
 * 业务相关
 */
