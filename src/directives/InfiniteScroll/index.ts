import type { Directive } from 'vue'
import { isFunction } from '@/util/typeTools'
import type { IBinding } from '@/interface/directive'

// 上拉无限加载
export const infiniteScroll: Directive = {
  mounted: function (el: HTMLElement, binding: IBinding) {
    const { value } = binding
    const SPL = 4 // 灵敏度
    if (value === null) {
      // 取消绑定事件
      return
    } else if (!isFunction(value)) {
      console.error("'v-infinite-scroll'指令需要绑定一个用于加载的回调函数")
      return
    }

    el.setAttribute('style', `overflow-x: hidden; overflow-y: scroll;`)
    el.addEventListener('scroll', () => {
      // 即将滚动到底部
      if (el.scrollHeight - el.clientHeight - el.scrollTop <= SPL) {
        console.log('已滚动到底部')
        value()
      }
    })
  },
}
