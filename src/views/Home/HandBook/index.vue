<template>
  <div class="HandBook">
    <CommonFrame class="book-zone" title="handbook-title">
      <div class="tab-zone">
        <div
          class="tab-bar"
          v-for="(item, index) in ['星辰演变图鉴', '十二星辰图鉴']"
          :key="index"
          @click="tabSwitch(index)"
        >
          <div class="tab-item" :class="{ active: index === bookIndex }">
            <p>{{ item }}</p>
          </div>
        </div>
      </div>
      <!-- 主信息展示 -->
      <div class="map-zone">
        <transition :name="tabAnimate">
          <component :is="comp[bookIndex]" />
        </transition>
      </div>
    </CommonFrame>
  </div>
</template>

<script setup lang="ts">
import CommonFrame from '@/views/components/CommonFrame.vue'

const bookIndex = ref(0)
const tabAnimate = ref('tab-l')

/**
 * @description: 切换tab
 * @param {*} tabIndex 下标idx
 * @return {*}
 */
const tabSwitch = (idx: number): void => {
  if (bookIndex.value === idx) {
    return
  }
  tabAnimate.value = bookIndex.value > idx ? 'tab-r' : 'tab-l'
  bookIndex.value = idx
}

/**
 * 主信息区
 */
/** 切换组件 */
const comp = shallowRef([
  defineAsyncComponent(() => import('./StarMap/index.vue')),
  defineAsyncComponent(() => import('./TwelveMap/index.vue')),
])
</script>

<style scoped lang="less">
.HandBook {
  position: relative;
  .flex-column;
  .book-zone {
    :deep(.title) {
      width: 1.17rem;
      height: 0.55rem;
    }
    .tab-zone {
      .flex-center;
      margin-top: 0.3rem;
      .tab-bar {
        margin: 0 0.03rem;
        width: 1.49rem;
        height: 0.56rem;
        .bg-normal('@/assets/tab/handbook-tab-bg.png');
        .flex-center;
        .tab-item {
          .flex-center;
          width: 1.16rem;
          height: 0.33rem;
          margin-top: 0.03rem;
          position: relative;
          &::before {
            content: '';
            .ab-center;
            width: 1.16rem;
            height: 0.33rem;
            .bg-normal('@/assets/tab/handbook-tab-active.png');
            transform: scale(0);
            transition: transform 0.3s;
          }
          > p {
            position: relative;
            z-index: 2;
            font-size: 0.14rem;
            font-family: Source Han Serif CN;
            font-weight: 600;
            font-style: italic;
            color: #ffffff;
            .word-stroke(#6b31dd);
            transition: color 0.3s, text-shadow 0.3s;
          }
          &.active {
            &::before {
              transform: scale(1);
            }
            > p {
              color: #b53c0c;
              .word-stroke(#FFFFFF);
            }
          }
        }
      }
    }
    .map-zone {
      margin-top: 0.1rem;
      position: relative;
    }
  }
}
</style>
