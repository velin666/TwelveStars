import type {
  ActCommonGiftDTO,
  ActCommonRankResponse,
  ActCommonRankRewardResponse,
  ActDateResponse,
  ActivityCommonReward,
  ActRoomInfoDTO,
  ActUserInfoDTO,
  BaseRankInfo,
  FriendInfo,
} from '@/interface/public'

interface IDataInfo {
  /** 时间信息 */
  resActDate: ActDateResponse
  /** 通用礼物 */
  resBaseGift: ActCommonGiftDTO[]
  /** 房间信息 */
  resFindRoom: Omit<ActRoomInfoDTO, 'roomId'> & { roomId: number | '' }
  /** 精确查询用户 */
  resFindUser: ActUserInfoDTO
  /** 用户好友 */
  resFriends: FriendInfo[]
  /** 运营位信息 */
  resOperation: Partial<BaseRankInfo>
  /** 站外用户信息 */
  resOutsideInfo: Omit<ActUserInfoDTO, 'uid'> & { uid: number | '' }
  /** 活动榜单奖励 */
  resReward: ActCommonRankRewardResponse[]
  /** 用户基础信息 */
  resUserInfo: ActUserInfoDTO
  /** 榜单信息 */
  resActRank: ActCommonRankResponse
  /** 通用奖励信息 */
  resCommonReward: ActivityCommonReward[]
}

/**
 * @description: 通用接口 hooks
 */
export const usePublicRequest = () => {
  /**
   * 数据初始化
   */
  /** 房间信息 */
  const initRoomInfo = (): {
    imgUrl: ''
    roomId: ''
    roomName: ''
  } => ({
    imgUrl: '',
    roomId: '',
    roomName: '',
  })
  /** 用户信息 */
  const initUserInfo = () => ({
    uid: 0,
    nickname: '',
    imgUrl: '',
    sex: 0,
    state: 0,
    beanAmount: 0,
  })

  /**
   * 请求汇总
   */
  /** 数据集合 */
  const dataInfo = reactive<IDataInfo>({
    resActDate: {
      countdown: 0,
      curTime: '',
      curTimeMs: '',
      dateInfos: [],
      state: 0,
    },
    resBaseGift: [],
    resFindRoom: initRoomInfo(),
    resFindUser: initUserInfo(),
    resFriends: [],
    resOperation: {},
    resOutsideInfo: initUserInfo(),
    resReward: [],
    resUserInfo: initUserInfo(),
    resActRank: {
      totalPage: 1,
      pageSize: 10,
      pageNum: 1,
      baseInfo: {},
      rankList: [],
    },
    resCommonReward: [],
  })

  return {
    /** 初始化房间信息 */
    initRoomInfo,
    /** 初始化用户信息 */
    initUserInfo,
    ...toRefs(dataInfo),
  }
}
