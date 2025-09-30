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
