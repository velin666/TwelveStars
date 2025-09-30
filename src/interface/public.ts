// 活动通用接口 https://we520.yuque.com/qng8ta/ylgbf9/veeow0#url9h

/** 活动时间 */
export interface ActDateResponse {
  /** 为负数就过期了 毫秒 */
  countdown: number
  /** 当前时间yyyy-MM-dd HH:mm:ss */
  curTime: string
  /** 当前时间戳/ms */
  curTimeMs: string
  /** 每日时间序列 */
  dateInfos: Array<{
    /** MM.dd */
    key: string
    /** yyyy-MM-dd */
    value: string
  }>
  /** 活动状态：0：未开始；1：进行中；2：活动结束 */
  state: number
}

// 通用礼物信息
export interface ActCommonGiftDTO {
  /** 礼物id */
  vgId: number
  /** 礼物的名称 */
  vgName: string
  /** 礼物的图片 */
  vgImg: string
  /** 礼物的价格 */
  price: number
  /** 用户拥有的免费票数量 */
  num: number
}

// 通用榜单信息
export interface ActCommonRankInfo {
  /** 分数/数值 */
  score: number
  /** uid/房间ID/公会ID */
  dataId: number
  /** 昵称/房间名/公会名 */
  name: string
  /** 头像/房间头像/公会头像 */
  imgUrl: string
  /** 榜单排名 */
  rank: number
}

// 通用用户信息
export interface ActCommonBaseInfo {
  /** 分数/数值 */
  score: number
  /** uid/房间ID/公会ID */
  dataId: number
  /** 昵称/房间名/公会名 */
  name: string
  /** 头像/房间头像/公会头像 */
  imgUrl: string
  /** 榜单排名 */
  rank: number
  /** 距离上一名/距离上榜 */
  distanceScore: number
  /** 是否可以跳转个人信息 */
  isShow: 0 | 1
}

// 通用榜单响应
export interface ActCommonRankResponse<T = ActCommonBaseInfo, U = ActCommonRankInfo> {
  /** 总页数 */
  totalPage: number
  /** 条数 */
  pageSize: number
  /** 页码 */
  pageNum: number
  /** 基本信息 */
  baseInfo: Partial<T>
  /** 榜单信息 */
  rankList: U[]
}

// 通用奖励响应
export interface ActCommonRankRewardResponse {
  /** 最小排行 */
  from: number
  /** 最大排行 */
  to: number
  /** 奖励信息列表 */
  detailInfos: Array<{
    rewardName: string
    rewardNum: number
    rewardImg: string
    unit: string
    allocateNum: number
    price?: number
  }>
}

// 通用奖励信息
export interface ActivityCommonReward {
  /** 配置ID */
  id: number
  /** 奖励类型 */
  rewardType: number
  /** 奖励ID */
  rewardId: number
  /** 奖励名称 */
  rewardName: string
  /** 奖励图链 */
  rewardImg: string
  /** 排序 */
  sort: number
  /** 兑换花费 */
  cost: number
  /** 剩余数量 -1为无限量 */
  stock: number
  /** 分类 对于不同活动会有不同意义 */
  category: number
  /** 奖励数量 */
  multipleCount: number
  /** 价值 仅钻石礼物返回 rewardType = 10   */
  price: number
  /** 单位  天/个 */
  unit: string
  /** 发送类型  0: 自动,  2: 手动指定(用户指定) */
  sendType: number
  /** 发送人数，send_type=2 */
  sendNum: number
  /** 赠送后是否过期 1->是 0->否 仅使用于钻石/背包礼物 */
  canExpire: number
  /** 发送后过期天数 */
  expireDay: number
  /** 角标文字 */
  cornerMark: string
  /** 角标文字颜色 */
  cornerBgColor: string
  /** 得到概率 总和为1 */
  probability: number
  count: number
}

// 通用用户信息
export interface ActUserInfoDTO {
  uid: number
  nickname: string
  imgUrl: string
  /** 1是男性，2是女性，0是未知 */
  sex: number
  /** 对于情人节活动:1->已签到 0->未签到 */
  state: number
}

// 媒体信息
export interface WorkInfo {
  /** 宣言文案  判空展示 */
  content: string
  /** 图片列表 判空展示 */
  imgList: string[]
  /** 音频链接 判空展示 */
  audioLink: string
  /** 视频链接 判空展示 */
  videoLink: string
}

// 多人活动信息
export interface MultiInfo {
  content: string
  /**
   * 是否为情侣 1->是 0->否
   * 用于情侣特殊UI展示
   */
  isCouple: number
  id?: number
  freeBless?: number
}

// 用户/房间列表
export interface DataInfo {
  dataId: number
  name: string
  imgUrl: string
}

/** 通用活动运营位信息展示 */
export interface BaseRankInfo {
  /** 当前排名 */
  rank: number
  /** 榜单名 */
  rankName: string
  /** XX值 */
  scoreName: string
  /** 当前分数 (为空时不展示 帮TA打榜按钮) */
  score: number
  /** 用于打榜的相关礼物 */
  giftList: ActCommonGiftDTO
  /** 参赛作品类活动 图片/视频/音频 */
  workInfo: WorkInfo
  /** 多人/情侣活动 */
  multiInfo: MultiInfo
  /** 活动链接 */
  actUrl: string
  /**
   * 活动使用的额外信息
   * 默认null 值存在则使用
   * "workInfo","multiInfo"
   */
  refField: string
  /** 用户/房间列表  */
  dataList: DataInfo[]
}

/** 通用房间信息 */
export interface ActRoomInfoDTO {
  /** 房间图 */
  imgUrl: string
  /** 房间ID */
  roomId: number
  /** 房间名称 */
  roomName: string
}

/** 通用好友信息 */
export interface FriendInfo {
  /** uid */
  uid: number
  /** 昵称 */
  nickname: string
  /** 头像 */
  imgUrl: string
}

/**
 * 业务相关
 */
