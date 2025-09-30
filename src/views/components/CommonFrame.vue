<template>
  <div class="CommonFrame">
    <slot name="upper" />
    <p class="decor"></p>
    <p class="decor"></p>
    <img v-if="title" :src="getImageFile(`text/${title}.png`)" alt="" class="title" />
    <div class="sec-frame">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getImageFile } from '@/util'

const { title } = defineProps<{
  title?: string
}>()
</script>

<style scoped lang="less">
.CommonFrame {
  position: relative;
  &::before {
    content: '';
    .bg-normal('@/assets/bg/common-bg-upper.png');
    width: 3.62rem;
    height: 0.59rem;
    .ab-X(5);
    top: -0.09rem;
  }
  &::after {
    content: '';
    width: 3.62rem;
    height: 0.25rem;
    .bg-normal('@/assets/bg/common-bg-under.png');
    .ab-X(5);
    bottom: -0.07rem;
  }
  .decor {
    position: absolute;
    z-index: 6;
    top: 0.1rem;
    width: 0.12rem;
    height: 0.72rem;
    .bg-normal('@/assets/bg/wand-decor.png');
    transform-origin: center top;
    @keyframes wind {
      0% {
        transform: rotate(-15deg);
      }
      100% {
        transform: rotate(15deg);
      }
    }
    &:nth-of-type(1) {
      left: 0;
      animation: wind 2s ease-in-out infinite alternate;
    }
    &:nth-of-type(2) {
      right: 0;
      animation: wind 2s ease-in-out 0.5s infinite alternate;
    }
  }
  .title {
    height: 0.55rem;
    .ab-X(10);
    top: -0.05rem;
  }
  .sec-frame {
    .flex-column;
    position: relative;
    z-index: 3;
    padding-top: 0.36rem;
    width: 3.62rem;
    min-height: 1.36rem;
    background-image: url('@/assets/bg/common-bg.png'), url('@/assets/bg/star-bg.png');
    background-size:
      100% 100%,
      3.56rem 2.76rem;
    background-repeat: no-repeat, repeat-y;
    background-position: center;
    background-blend-mode: screen;
    box-sizing: border-box;
    // mask-image: url('@/assets/bg/bg-mask.png'), linear-gradient(0, #fff 0% 100%);
    mask-image: url('@/assets/bg/bg-mask.png'), url('@/assets/bg/common-bg.png');
    mask-size:
      3.62rem 0.32rem,
      100% 100%;
    mask-position: center top;
    mask-repeat: no-repeat;
    mask-composite: exclude;
  }
  &.dash {
    .sec-frame {
      padding-top: 0;
    }
  }
}
</style>
