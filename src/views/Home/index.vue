<template>
  <div class="Home">
    <!-- 头部展示 -->
    <Header />
    <div class="tab-zone">
      <div
        class="tab-item"
        v-for="item in tabInfo"
        :class="['tab' + item.realIndex, 'number' + (item.index + 1)]"
        :style="{
          transform: `translate3d(${item.x}rem, ${item.y}rem, ${item.z}rem)`,
        }"
        :key="item.realIndex + 'tab'"
      >
        <div class="ball" :class="{ active: item.realIndex === tabData.tabCount }">
          <p @click="tabSwitch(item)"></p>
        </div>
      </div>
    </div>
    <!-- 主信息展示 -->
    <div class="data-zone">
      <transition :name="tabData.tabAnimate">
        <component :is="comp[tabData.tabIndex]" />
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from './Header/index.vue'
//
import { baseKey } from '../data'
/**
 * tab相关
 */
/** tab数据 */
const tabData = reactive({
  tabAnimate: 'tab-l',
  tabIndex: Number(sessionStorage.getItem('tab')) || 0,
  tabCount: 4,
  /** 动画状态 0 动画结束 1 动画执行中 */
  animateState: 0,
})
/** tab位置信息 */
const tabInfo = ref(
  Array(12)
    .fill('')
    .map((_, i) => ({
      index: i % 4,
      realIndex: i,
      x: (i - 4) * 1 + 1.1,
      y: Math.cos((((i - 4 - 0.5) * Math.PI) / 180) * 30) * 0.9 - 0.9,
      z: (4 - i) * 0.3,
    })),
)

/**
 * @description: 切换tab
 * @param {*} tabIndex 下标idx
 * @return {*}
 */
const tabSwitch = (info: (typeof tabInfo)['value'][number]): void => {
  if (tabData.tabIndex === info.index || tabData.animateState) {
    return
  }
  tabData.animateState = 1
  if (tabData.tabCount > info.realIndex) {
    tabData.tabAnimate = 'tab-r'
    if (tabData.tabIndex < info.index) {
      const firstIndex = tabInfo.value[0].realIndex
      // tabInfo.value.splice(8, 4)
      const insertArray = [
        ...tabInfo.value.slice(8).map((_, i) => ({
          index: i,
          realIndex: firstIndex - (4 - i),
          x: (firstIndex - (4 - i) - tabData.tabCount) * 1 + 1.1,
          y:
            Math.cos((((firstIndex - (4 - i) - tabData.tabCount - 0.5) * Math.PI) / 180) * 30) *
              0.9 -
            0.9,
          z: (tabData.tabCount - firstIndex - (4 - i)) * 0.3,
        })),
        ...tabInfo.value.slice(0, 8),
      ]
      tabInfo.value = insertArray
    }
  } else {
    tabData.tabAnimate = 'tab-l'
    if (tabData.tabIndex > info.index) {
      const lastIndex = tabInfo.value[tabInfo.value.length - 1].realIndex
      const insertArray = [
        ...tabInfo.value.slice(4),
        ...tabInfo.value.slice(0, 4).map((_, i) => ({
          index: i,
          realIndex: lastIndex + i + 1,
          x: (lastIndex + i + 1 - tabData.tabCount) * 1 + 1.1,
          y:
            Math.cos((((lastIndex + i + 1 - tabData.tabCount - 0.5) * Math.PI) / 180) * 30) * 0.9 -
            0.9,
          z: (tabData.tabCount - lastIndex + i + 1) * 0.3,
        })),
      ]
      tabInfo.value = insertArray
      // tabInfo.value.splice(0, 4)
    }
  }
  setTimeout(() => {
    tabData.tabCount = info.realIndex
    tabData.tabIndex = info.index
    tabInfo.value = tabInfo.value.map((v) => ({
      ...v,
      x: (v.realIndex - tabData.tabCount) * 1 + 1.1,
      y: Math.cos((((v.realIndex - tabData.tabCount - 0.5) * Math.PI) / 180) * 30) * 0.9 - 0.9,
      z: (tabData.tabCount - v.realIndex) * 0.3,
    }))
  })
  setTimeout(() => {
    tabData.animateState = 0
  }, 520)
}

/**
 * 主信息区
 */
/** 切换组件 */
const comp = [
  defineAsyncComponent(() => import('./Transfer/index.vue')),
  defineAsyncComponent(() => import('./Rank/index.vue')),
  defineAsyncComponent(() => import('./Rank/index.vue')),
  defineAsyncComponent(() => import('./HandBook/index.vue')),
]

const { resBaseGift } = usePublicRequest()
// getBaseGift()

provide(baseKey, {
  tabIndex: toRef(tabData, 'tabIndex'),
  resBaseGift,
})
</script>

<style scoped lang="less">
.Home {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  margin-bottom: 0.4rem;
  .bg-normal('@/assets/bg/dashboard.png');
  &::before {
    .ab-X;
    top: 5.3rem;
    content: '';
    width: 3.75rem;
    height: 2.61rem;
    .bg-normal('@/assets/bg/tab-bg.png');
    transform: scale(-1, 0.9);
  }
  .tab-zone {
    margin-bottom: 0.3rem;
    transform-style: preserve-3d;
    width: 3.75rem;
    position: relative;
    z-index: 2;
    height: 1.2rem;
    perspective: 2rem;
    pointer-events: none;
    .tab-item {
      pointer-events: auto;
      position: absolute;
      left: 0;
      bottom: 0;
      z-index: 2;
      .flex-center;
      transition: transform 0.5s;

      .ball {
        width: 1.09rem;
        height: 0.99rem;
        .flex-center;
        transition:
          transform 0.5s,
          filter 0.5s;
        pointer-events: none;
        transform: scale(0.8);
        filter: brightness(0.6);
        &.active {
          transform: scale(1.2);
          filter: brightness(1);
        }
        > p {
          pointer-events: auto;
          .rect(0.5rem);
        }
      }
      each(range(4), {
        &.number@{value} {
          .ball {
            .bg-normal('@/assets/tab/tab@{value}.png');
          }
        }
      });
    }
  }
  .data-zone {
    margin-top: 0.2rem;
    position: relative;
    min-height: 85vh;
    width: 100vw;
    > div {
      width: 100vw;
    }
  }
}
</style>
