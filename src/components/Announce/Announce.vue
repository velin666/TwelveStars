<template>
  <div class="announce-container">
    <transition name="scrollUp" mode="out-in">
      <div
        class="announce-item"
        v-if="computeContent"
        :key="scrollData.scrollIndex"
      >
        <slot :item="computeContent" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any> | string">
interface IProps<T> {
  /** 滚动列表 */
  list: Array<T> | Map<string | number, T>
  /** 文字轮播时间 */
  duration?: number
  /** 是否无限滚动 */
  infiniteScroll?: boolean
}
const {
  list,
  duration = 3000,
  infiniteScroll = true,
} = defineProps<IProps<T>>()
const emit = defineEmits(['scrollDone'])

const scrollData = reactive({
  /** 滚动下标 */
  scrollIndex: 0,
  /** 滚动定时器 */
  scrollTimer: 0,
})

const computeContent = ref<T>()
const handleScroll = () => {
  if (list instanceof Map) {
    computeContent.value = list.get([...list][scrollData.scrollIndex][0])
  } else {
    computeContent.value = list.length
      ? list[scrollData.scrollIndex]
      : undefined
  }
  clearTimeout(scrollData.scrollTimer)
  scrollData.scrollTimer = window.setTimeout(() => {
    if (
      scrollData.scrollIndex ===
      (list instanceof Map ? list.size - 1 : list.length - 1)
    ) {
      if (infiniteScroll) {
        scrollData.scrollIndex = 0
        handleScroll()
      } else {
        emit('scrollDone')
      }
    } else {
      scrollData.scrollIndex += 1
      handleScroll()
    }
  }, duration)
}

watch(
  () => list,
  val => val && (val instanceof Map ? val.size : val.length) && handleScroll(),
  { immediate: true }
)

// const computeContent = computed<T | undefined>(() => {
//   // 公告轮播
//   if (list instanceof Map) {
//     return list.get([...list][scrollData.scrollIndex][0])
//   } else {
//     return list.length ? list[scrollData.scrollIndex] : undefined
//   }
// })

onBeforeUnmount(() => clearTimeout(scrollData.scrollTimer))
</script>

<style scoped lang="less">
@import '@/styles/animate.less';

.announce-container {
  margin: 0 auto;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .flex-center;
}
</style>
