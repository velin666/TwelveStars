<template>
  <header>
    <div class="header-show" :class="{ dim: isBulletActive }">
      <img src="@/assets/bg/star-title.png" alt="" class="star-title" />
      <transition name="actor-trans">
        <div class="actor" :key="activeIndex">
          <img :src="getImageFile(`actor/actor${activeIndex + 1}.png`)" alt="" />
        </div>
      </transition>
    </div>
    <!-- 弹幕墙 -->
    <BulletWall :stop-play="stopPlay" @active-change="(v) => (isBulletActive = v)" />
    <!-- 转盘 -->
    <Turnplate :stop-play="stopPlay" @update-index="(val) => (activeIndex = val)" />
  </header>
</template>

<script setup lang="ts">
import Turnplate from './Turnplate/index.vue'
import BulletWall from './BulletWall/index.vue'
import { getImageFile } from '@/util'

const stopPlay = ref(false)
const activeIndex = ref(0)
const isBulletActive = ref(false)
// const { month } = useRoute().query as { month: keyof typeof MONTH_VALUE }
window.onscroll = () => {
  // 滚动条滚动时，距离顶部的距离
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  // 可视区的高度
  const windowHeight = document.documentElement.clientHeight || document.body.clientHeight

  if (scrollTop - windowHeight - 100 > 0 && !stopPlay.value) {
    stopPlay.value = true
  } else if (scrollTop - windowHeight - 100 <= 0 && stopPlay.value) {
    stopPlay.value = false
  }
}
/**
 * @description: 移动端熄屏动作处理
 */
const checkViChange = (): void => {
  if (!document.hidden) {
    stopPlay.value = true
  } else {
    stopPlay.value = false
  }
}
// 适用于安卓切换后台和息屏， 适用于苹果切换后台
document.addEventListener('visibilitychange', checkViChange)

onBeforeUnmount(() => (window.onscroll = null))
</script>

<style scoped lang="less">
header {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  .header-show {
    .ab-X;
    top: 0;
    width: 3.75rem;
    transition: opacity 0.2s ease;
    &.dim {
      opacity: 0.2;
    }
    @keyframes up-down {
      0% {
        filter: brightness(1.2);
      }
      100% {
        transform: translateY(0.1rem);
      }
    }
    .star-title {
      width: 1.55rem;
      height: 2.19rem;
      animation: up-down 1.5s linear 0.5s alternate infinite;
    }
    .actor {
      position: absolute;
      z-index: 2;
      right: -0.45rem;
      top: 0;
      > img {
        width: 2.53rem;
        height: 3.24rem;
        animation: up-down 1.5s linear alternate infinite;
      }
    }
    &::after {
      content: '';
      .rect(2.4);
      position: absolute;
      z-index: 1;
      right: -0.45rem;
      top: 0;
      .bg-normal('@/assets/bg/moon-bg.png');
      @keyframes fade {
        100% {
          opacity: 0.8;
          filter: brightness(0.8);
        }
      }
      animation: fade 1s linear alternate infinite;
    }
  }
}

.actor-trans-leave-to {
  opacity: 0;
  transform: translateX(-0.8rem) scale(0.5);
  filter: brightness(5);
}
.actor-trans-enter-from {
  opacity: 0;
  transform: rotate(30deg);
  filter: brightness(0.5);
}
.actor-trans-enter-active {
  transform-origin: center 200%;
}
.actor-trans-enter-active,
.actor-trans-leave-active {
  transition: all 0.5s;
}
</style>
