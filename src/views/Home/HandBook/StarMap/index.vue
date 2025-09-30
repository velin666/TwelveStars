<template>
  <div class="StarMap">
    <div class="map-list">
      <div
        class="map-item"
        :class="{ 'not-get': !item.lightState }"
        v-for="(item, index) in mapInfo.mapList"
        :key="index"
      >
        <div class="map-card">
          <div class="pic">
            <img :src="item.imgUrl" alt="" />
          </div>
          <p class="name">{{ item.name }}</p>
        </div>
      </div>
    </div>
    <div class="reward-zone">
      <div class="reward-show">
        <p>
          获得奖励:<span>{{
            mapInfo.rewardList
              .map((val) => `${val.rewardName}*${val.multipleCount + val.unit}`)
              .join('、')
          }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ActivityCommonReward } from '@/interface/public'
import { starEvolutionMap } from '@/views/mock'

// type
interface IMap {
  /** 演变图鉴列表 */
  mapList: StarEvolutionMap[]
  /** 集齐后可获得奖励 */
  rewardList: ActivityCommonReward[]
}
interface StarEvolutionMap {
  /**
   * 1
   * 点亮
   * 0
   * 暗淡
   *
   */
  lightState: number
  /** 奖励图片 */
  imgUrl: string
  /** 奖励名 */
  name: string
}

/**
 * 初始化
 */

/**
 * 图鉴信息
 */
const mapInfo = ref<IMap>({
  mapList: [],
  rewardList: [],
})

const getMapInfo = () => {
  setTimeout(() => {
    mapInfo.value = starEvolutionMap
  }, 50)
}
getMapInfo()
</script>

<style scoped lang="less">
.StarMap {
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
        height: 1.53rem;
        .bg-normal('@/assets/bg/star-map-bg.png');
        .flex-column;
        .pic {
          margin-top: 0.23rem;
          width: 0.88rem;
          height: 0.8rem;
          > img {
            width: 0.88rem;
            height: 0.8rem;
            object-fit: contain;
          }
        }
        .name {
          margin-top: 0.15rem;
          box-sizing: border-box;
          padding: 0 0.15rem;
          width: 0.89rem;
          height: 0.13rem;
          background: #7f3127;
          border: 0.01rem solid #ffffff;
          font-size: 0.08rem;
          font-family: Source Han Serif CN;
          font-weight: bold;
          font-style: italic;
          color: #ffffff;
          mask-image: linear-gradient(
            90deg,
            rgba(0, 0, 0, 0) 0%,
            #fff 15% 85%,
            rgba(0, 0, 0, 0) 100%
          );
          mask-size: 100%;
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
