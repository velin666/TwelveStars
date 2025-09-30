import { defineStore } from 'pinia'

export interface IBulletItem {
  /**
   * 弹幕
   */
  barrage: string
  /** 房间ID */
  roomId: number
  /** 房间头像 */
  roomImg: string
}
export const useBullet = defineStore('bullet', () => {
  const selfBulletItem = ref<IBulletItem>({
    barrage: '',
    roomImg: '',
    roomId: 0,
  })

  const setBullet = (info: IBulletItem) => (selfBulletItem.value = info)
  return {
    /** 设置个人弹幕信息 */
    selfBulletItem,
    /** 设置个人弹幕信息 */
    setBullet,
  }
})
