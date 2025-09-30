<template>
  <header>
    <div class="act-time">
      活动时间:
      {{
        `${MONTH_VALUE[month]}月1日-${MONTH_VALUE[month]}月${new Date(
          new Date().getFullYear(),
          MONTH_VALUE[month],
          0,
        ).getDate()}日`
      }}
    </div>
    <img src="@/assets/btn/rule-btn.png" alt="" class="rule-btn" @click="visible = true" />
    <!-- 弹幕墙 -->
    <BulletWall :stop-play="stopPlay" />
    <!-- 转盘 -->
    <Turnplate :stop-play="stopPlay" />

    <!-- 规则弹框 -->
    <Model v-model="visible">
      <div class="rule-dialog">
        <img src="@/assets/text/rule-title.png" alt="" class="title" />
        <div class="rule-list">
          <div class="rule-text">
            <p class="text">
              活动时间：<span>
                {{
                  `${MONTH_VALUE[month]}月1日-${MONTH_VALUE[month]}月${new Date(
                    new Date().getFullYear(),
                    MONTH_VALUE[month],
                    0,
                  ).getDate()}日`
                }}</span
              >
            </p>
          </div>
          <div class="rule-text">
            <p class="index">1</p>
            <p class="text">
              通过赠送活动礼物<span>{{ resBaseGift.map((v) => v.vgName).join('、') }}</span
              >获得星际值；通过收到活动礼物<span>{{
                resBaseGift.map((v) => v.vgName).join('、')
              }}</span
              >获得星辰值<span>1爱豆=1星辰值=1星际值</span>
            </p>
          </div>
          <div class="rule-text">
            <p class="index">2</p>
            <p class="text">完成每日任务可获得星辰演变次数，通过演变获得星辰奖励；</p>
          </div>
          <div class="rule-text">
            <p class="index">3</p>
            <p class="text"><span>达到100000</span>星辰值或星际值，可升级高级演变；</p>
          </div>
          <div class="rule-text">
            <p class="index">4</p>
            <p class="text">根据星辰值与星际值的数量进行收送礼榜单排序，每月发放一次榜单奖励；</p>
          </div>
          <div class="rule-text">
            <p class="index">5</p>
            <p class="text">通过集齐礼物图鉴，获得图鉴奖励；</p>
          </div>
          <div class="rule-text">
            <p class="index">6</p>
            <p class="text">本活动最终解释权归平台所有；</p>
          </div>
        </div>
        <img
          src="@/assets/icon/close-icon.png"
          alt=""
          class="close-icon"
          @click="visible = false"
        />
      </div>
    </Model>
  </header>
</template>

<script setup lang="ts">
import Turnplate from './Turnplate/index.vue'
import BulletWall from './BulletWall/index.vue'
import { baseKey, MONTH_VALUE } from '@/views/data'
import { GetQueryString } from '@/util'

const stopPlay = ref(false)
const { resBaseGift } = inject(baseKey)!
const month = GetQueryString('month') as unknown as keyof typeof MONTH_VALUE
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

/**
 * 弹框
 */
const visible = ref(false)
</script>

<style scoped lang="less">
header {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  .act-time {
    width: 2.71rem;
    height: 0.27rem;
    .ab-X;
    top: 1.3rem;
    .decor {
      content: '';
      .ab-X;
      .linear-bg(#ffffff);
      width: fit-content;
      .flex-center;
      width: 2.71rem;
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
    .linear-bg(rgb(14, 14, 91), 30% 70%);
    font-size: 0.15rem;
    font-family: Source Han Serif CN;
    font-weight: 400;
    font-style: italic;
    color: #ffffff;
    .flex-center;
  }
  .rule-btn {
    position: fixed;
    z-index: 10;
    right: 0;
    top: 2rem;
    width: 0.34rem;
    height: 1rem;
    .flex-center;
  }
}

.rule-dialog {
  .base-dialog;
  .title {
    width: 1.41rem;
    height: 0.45rem;
  }
  .rule-list {
    width: 2.53rem;
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(17, 8, 55, 0.5) 40% 60%,
      rgba(0, 0, 0, 0) 100%
    );
    padding: 0.15rem 0 0.56rem;
    .flex-column;
    .rule-text {
      position: relative;
      margin-bottom: 0.05rem;
      .index {
        .round(0.11rem);
        border: 0.01rem solid #fdefc2;
        background: linear-gradient(0deg, #3b0fa8 0%, #564ddc 100%);
        .flex-center;
        font-size: 0.09rem;
        font-family: Source Han Serif CN;
        font-weight: 800;
        font-style: italic;
        color: #ffffff;
        position: absolute;
        z-index: 1;
        left: 0.08rem;
        top: 0.04rem;
        box-sizing: border-box;
        padding-right: 0.01rem;
      }
      .text {
        text-align: left;
        margin-left: 0.25rem;
        width: 2.21rem;
        font-size: 0.1rem;
        font-family: Source Han Serif CN;
        font-weight: 500;
        font-style: italic;
        color: #ffffff;
        line-height: 0.18rem;
        > span {
          font-weight: 800;
          color: #ffd800;
        }
      }
    }
  }
}
</style>
