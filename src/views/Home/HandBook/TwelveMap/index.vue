<template>
  <div class="TwelveMap">
    <div class="map-list">
      <div
        class="map-item"
        :class="{
          'not-get': !item.lightState,
          'not-start': item.lightState === -1,
        }"
        v-for="(item, index) in mapInfo"
        :key="index"
      >
        <img
          :src="
            getImageFile(
              `handbook/handbook${
                [1, 2, 3, 10, 11, 12].indexOf(
                  MONTH_VALUE[item.month as keyof typeof MONTH_VALUE],
                ) !== -1
                  ? MONTH_VALUE[item.month as keyof typeof MONTH_VALUE]
                  : '-unknown'
              }.png`,
            )
          "
          alt=""
          class="map-card"
        />
        <div class="user-info">
          <div class="avatar">
            <img :src="item.topUser?.imgUrl || doubt" alt="" />
          </div>
          <div class="name">
            <p>{{ omitValue(item.topUser?.nickname || '虚位以待', 5) }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="reward-zone">
      <div class="reward-show">
        <p>
          本月活动期间收到每月指定礼物，可以点亮月度礼物图鉴。<br />集齐12张图鉴可获得<span>神秘大奖</span>。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ActUserInfoDTO } from '@/interface/public'
import { MONTH_VALUE } from '@/views/data'
import { getImageFile, omitValue } from '@/util'
import doubt from '@/assets/icon/doubt-icon.png'
import { mapData } from '@/views/mock'

// type
interface IMap {
  /** 月份 */
  month: string
  /**
   * 1
   * 点亮
   * 0
   * 暗淡
   * -1
   * 未开始
   */
  lightState: number
  /** 对应图片 */
  imgUrl: string
  /** 送礼第一的用户 */
  topUser: ActUserInfoDTO | null
  /**
   * 月份对应的名称
   * 天贵
   * 天寿
   */
  name: string
}

/**
 * 图鉴信息
 */
const mapInfo = ref<IMap[]>([])

const getMapInfo = () => {
  setTimeout(() => {
    mapInfo.value = mapData
  }, 50)
}
getMapInfo()
</script>

<style scoped lang="less">
.TwelveMap {
  position: relative;
  .flex-column;
  position: relative;
  .flex-column;
  .map-list {
    width: 3.36rem;
    .flex-start;
    flex-wrap: wrap;
    .map-item {
      position: relative;
      margin-bottom: 0.08rem;
      .handbook-decor;
      .map-card {
        width: 1.12rem;
        height: 1.55rem;
      }
      .user-info {
        .ab-X;
        transform: translateX(0.05rem);
        bottom: 0.22rem;
        width: fit-content;
        .avatar {
          .ab2-Y;
          left: -0.05rem;
          &::before {
            content: '';
            .ab2-center;
            .rect(0.17rem);
            .bg-normal('@/assets/bg/small-avatar.png');
          }
          > img {
            background-color: #271251;
            .round(0.15rem);
          }
        }
        .name {
          .flex-center;
          box-sizing: border-box;
          min-width: 0.7rem;
          padding: 0 0.09rem 0 0.12rem;
          height: 0.13rem;
          .linear-bg(#7f3127, 0% 70%);
          > p {
            font-size: 0.07rem;
            font-family: Source Han Serif CN;
            font-weight: bold;
            font-style: italic;
            color: #ffffff;
          }
        }
      }
    }
  }
  .reward-zone {
    margin: 0.1rem 0 0.4rem;
    position: relative;
    .reward-show {
      .flex-center;
      width: 3.13rem;
      border: 0.01rem solid rgba(255, 255, 255, 0.5);
      background: rgba(54, 19, 127, 0.75);
      mask-image: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, #fff 15% 85%, rgba(0, 0, 0, 0) 100%);
      mask-size: 100%;
      > p {
        width: 2.7rem;
        margin: 0.15rem 0;
        font-size: 0.1rem;
        font-family: Source Han Serif CN;
        font-weight: 400;
        font-style: italic;
        color: #ffffff;
        > span {
          color: #fff4ad;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
