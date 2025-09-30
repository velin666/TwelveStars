import { defineStore } from 'pinia'
import router from '../router'

export type IPosition = null | {
  x: string
  y: string
}

export const useDialog = defineStore('dialog', () => {
  const mask = reactive({
    maskNumber: 0,
    scrollTopNum: 0,
  })
  const position = ref<IPosition>(null)

  /** 记录弹框数量 */
  const setMaskNumber = (counting: number): void => {
    if (counting === 1 && mask.maskNumber < counting) {
      const scrollTopNum =
        window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      mask.scrollTopNum = scrollTopNum
      document.body.setAttribute('style', `position: fixed; top: -${scrollTopNum}px; width: 100vw`)
    } else if (!counting) {
      document.body.removeAttribute('style')
      window.scrollTo(0, mask.scrollTopNum)
    }
    mask.maskNumber = counting
  }
  /** 记录点击位置 */
  const setPosition = (e: MouseEvent) => {
    const { innerWidth, innerHeight } = window
    const centerX = innerWidth / 2
    const centerY = innerHeight / 2
    const pageY = e.clientY - centerY
    const pageX = e.clientX - centerX
    position.value = {
      x: `${(pageX / innerWidth) * 100}vw`,
      y: `${(pageY / innerHeight) * 100}vh`,
    }

    // 兼容非点击方式展开
    setTimeout(() => {
      position.value = null
    }, 300)
  }

  router.beforeEach((to, from, next) => {
    setMaskNumber(0)
    next()
  })

  return { mask, position, setMaskNumber, setPosition }
})

export const dialogRewardInfo = [
  {
    id: 2083,

    rewardType: 5,
    rewardId: 3014,
    rewardName: '图标-馒头',
    rewardImg:
      'https://image.tidutec.com/cms/b6f77a94c9e7fec0/70c3d931b893724454cae3285a0e6fc0.png?imageView/3/w/200/h/200',
    count: 2,
    sort: 1,

    category: 0,
    cost: 0,
    probability: 0,
    stock: -1,

    unit: '个',
    multipleCount: 1,

    sendType: 0,
    sendNum: 0,
    canExpire: 0,
    expireDay: 1,
    cornerMark: '',
    cornerBgColor: '',

    price: 0,
  },
  {
    id: 2085,

    rewardType: 5,
    rewardId: 27,
    rewardName: '图标-圣诞卡',
    rewardImg: 'https://image.tidutec.com/vgift/new_shengdanka.png?imageView/3/w/200/h/200',
    count: 2,
    sort: 1,

    category: 0,
    cost: 0,
    probability: 0,
    stock: -1,

    unit: '个',
    multipleCount: 2,

    sendType: 0,
    sendNum: 0,
    canExpire: 0,
    expireDay: 1,
    cornerMark: '',
    cornerBgColor: '',

    price: 0,
  },
  {
    id: 2086,

    rewardType: 1,
    rewardId: 10345,
    rewardName: '座驾-柯基',
    rewardImg:
      'https://image.tidutec.com/weImage/2020/12/23/3c34a3f48991e7882c7b77506f36c758-bbs.png',
    count: 1,
    sort: 1,

    category: 0,
    cost: 0,
    probability: 0,
    stock: -1,

    unit: '天',
    multipleCount: 1,

    sendType: 0,
    sendNum: 0,
    canExpire: 0,
    expireDay: 1,
    cornerMark: '',
    cornerBgColor: '',

    price: 0,
  },
  {
    id: 2087,

    rewardType: -2,
    rewardId: 0,
    rewardName: '随机靓号',
    rewardImg: 'https://image.tidutec.com/image/activity/2021/iconlh.png',
    count: 2,
    sort: 1,

    category: 0,
    cost: 0,
    probability: 0,
    stock: -1,

    unit: '个',
    multipleCount: 1,

    sendType: 0,
    sendNum: 0,
    canExpire: 0,
    expireDay: 1,
    cornerMark: '',
    cornerBgColor: '',

    price: 0,
  },
  {
    id: 2088,

    rewardType: 4,
    rewardId: 10797,
    rewardName: '浮屏-小桃夭',
    rewardImg: 'https://image.tidutec.com/4ce2604189f8d4f76715a4897c8cacf2.png',
    count: 3,
    sort: 1,

    category: 0,
    cost: 0,
    probability: 0,
    stock: -1,

    unit: '天',
    multipleCount: 2,

    sendType: 0,
    sendNum: 0,
    canExpire: 0,
    expireDay: 1,
    cornerMark: '',
    cornerBgColor: '',

    price: 0,
  },
]
