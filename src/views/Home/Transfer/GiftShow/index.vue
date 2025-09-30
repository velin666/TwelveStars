<template>
  <CommonFrame class="GiftShow" title="gift-title">
    <div class="base-tips">
      活动期间赠送或收到礼物即可上榜<br />
      1爱豆=1星际值=1星辰值
      <!-- <img
        src="@/assets/icon/white-star.png"
        alt=""
      /> -->
    </div>
    <div class="gift-list">
      <div class="gift-item" v-for="(item, index) in resBaseGift" :key="index">
        <div class="gift-frame">
          <img :src="item.vgImg" alt="" />
        </div>
        <p class="name">{{ item.vgName }}</p>
        <p class="count">{{ item.price }}爱豆</p>
      </div>
    </div>
  </CommonFrame>
</template>

<script setup lang="ts">
import CommonFrame from '@/views/components/CommonFrame.vue'
import { baseKey } from '@/views/data'

const { resBaseGift } = inject(baseKey)!
</script>

<style scoped lang="less">
.GiftShow {
  position: relative;
  .base-tips {
    .decor {
      content: '';
      .ab-X;
      .linear-bg(#EBD8FF);
      width: fit-content;
      .flex-center;
      width: 2.7rem;
      height: 0.01rem;
    }
    &::before {
      .decor;
      top: 0;
    }
    &::after {
      .decor;
      bottom: 0;
    }
    margin-top: 0.2rem;
    .flex-center;
    width: 2.7rem;
    height: 0.32rem;
    .linear-bg(#5821d0, 20% 80%);
    font-size: 0.09rem;
    font-family: Source Han Serif CN;
    font-weight: 300;
    color: #ffffff;
    position: relative;
    > img {
      position: absolute;
      z-index: 1;
      width: 0.12rem;
      height: 0.17rem;
      top: 0.02rem;
      right: 0.4rem;
    }
  }
  .gift-list {
    .flex-center;
    margin: 0.08rem 0 0.4rem;
    .gift-item {
      .flex-column;
      .bg-normal('@/assets/bg/gift-frame.png');
      width: 1.08rem;
      height: 1.39rem;
      .gift-frame {
        margin-top: 0.25rem;
        width: 0.71rem;
        height: 0.62rem;
        > img {
          width: 0.71rem;
          height: 0.62rem;
          object-fit: contain;
        }
      }
      .name {
        margin-top: 0.05rem;
        font-size: 0.09rem;
        font-family: Source Han Serif CN;
        font-weight: 600;
        color: #fffffe;
      }
      .count {
        font-size: 0.09rem;
        font-family: Source Han Serif CN;
        font-weight: 500;
        color: #fffffe;
      }
    }
  }
}
</style>
