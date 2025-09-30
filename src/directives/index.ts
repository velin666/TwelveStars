import { infiniteScroll } from './InfiniteScroll'

const GLOBAL_DIRECTIVES = {
  infiniteScroll,
}
export default {
  install(Vue: { directive: (arg0: string, arg1: any) => void }) {
    Object.keys(GLOBAL_DIRECTIVES).forEach(key => {
      Vue.directive(key, (GLOBAL_DIRECTIVES as { [key: string]: object })[key])
    })
  },
}
