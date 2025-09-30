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
    uid: 16935575,
    nickname: '带头骨头肉荷包蛋',
    imgUrl:
      'https://image.tidutec.com/2019/08/28/162004500/50807677-user.png?imageView/3/w/100/h/100',
    state: 0,
    sex: 2,
    birthday: null,
    beanAmount: 99148925,
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
    resBaseGift: [
      {
        vgId: 1,
        vgName: '幸运草',
        vgImg: 'https://image.tidutec.com/vgift/new_xyc.png',
        price: 5,
        num: 0,
      },
      {
        vgId: 2564,
        vgName: '桃花仙',
        vgImg: 'https://image.tidutec.com/cms/b6f77a94c9e7fec0/taohuaxian.png',
        price: 500,
        num: 0,
      },
      {
        vgId: 2689,
        vgName: '时光穿梭',
        vgImg: 'https://image.tidutec.com/cms/b6f77a94c9e7fec0/shiguangchuansuo.png',
        price: 1000,
        num: 0,
      },
    ],
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
