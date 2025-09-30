import { inject } from 'vue'

/**
 * @description: 集合通用方法
 * @return {*}
 */
export const useTools = () => {
  const toast = inject<(text?: string, duration?: number) => void>('$showToast')!
  const showToast = toast

  return {
    showToast,
  }
}
