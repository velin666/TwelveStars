<template>
  <CommonFrame class="Reward" title="gift-title">
    <div class="reward-item" v-for="(item, idx) in resReward" :key="idx + 'reward'">
      <div class="reward-tips">
        <p>
          第
          {{ item.from === item.to ? item.to : item.from + '-' + item.to }}
          名奖励
        </p>
      </div>
      <div class="gift-list">
        <div class="gift-item" v-for="(val, index) in item.detailInfos" :key="index + 'gift'">
          <div class="gift-frame">
            <img :src="val.rewardImg" alt="" />
          </div>
          <p class="name">
            {{ val.rewardName }}
          </p>
          <p class="price">x{{ val.rewardNum + val.unit }}</p>
        </div>
      </div>
    </div>
  </CommonFrame>
</template>

<script setup lang="ts">
import { baseKey } from '@/views/data'
import CommonFrame from '@/views/components/CommonFrame.vue'
import { rewardsAll } from '@/views/mock'

const { rankIndex } = defineProps<{ rankIndex: number }>()

const { resReward } = usePublicRequest()
const { tabIndex } = inject(baseKey)!

resReward.value = tabIndex.value === 1 ? rewardsAll[rankIndex] : rewardsAll[4 + rankIndex]
</script>

<style scoped lang="less">
.Reward {
  position: relative;
  .flex-column;
  margin: 0.3rem 0 0.8rem;
  .reward-item {
    .flex-column;
    .reward-tips {
      margin: 0.25rem 0 0.16rem;
      width: 2.22rem;
      height: 0.27rem;
      .flex-center;
      .bg-normal('@/assets/bg/reward-title.png');
      > p {
        font-size: 0.09rem;
        font-family: Source Han Serif CN;
        font-weight: 600;
        font-style: italic;
        color: #ffffff;
      }
    }
    .gift-list {
      width: 3.3rem;
      .flex-center;
      .gift-list-style;
      flex-wrap: wrap;
    }
  }
}
</style>
