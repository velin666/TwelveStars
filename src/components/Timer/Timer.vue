<template>
  <div class="Timer">
    <slot :countDown="data.countDown">
      <div class="countDown">
        活动倒计时:
        <div class="c-wrapper">
          <p>{{ data.countDown.days }}</p>
        </div>
        天:
        <div class="c-wrapper">
          <p>{{ data.countDown.hours }}</p>
        </div>
        :
        <div class="c-wrapper">
          <p>{{ data.countDown.minutes }}</p>
        </div>
        :
        <div class="c-wrapper">
          <p>{{ data.countDown.seconds }}</p>
        </div>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { reqActDate } from '@/interface/request'

// 活动名称
const { activityName = '' } = defineProps<{
  activityName?: string
}>()

interface ITimer {
  countDown: {
    days: string
    hours: string
    minutes: string
    seconds: string
  }
  time: number
  setInterTime: number
}
/** 初始化 */
const { showToast } = useTools()

/** 倒计时相关 */
// 倒计时信息
const data = reactive<ITimer>({
  countDown: {
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  },
  time: 0,
  setInterTime: 0,
})

/**
 * @description: 移动端熄屏动作处理
 */
const checkViChange = (): void => {
  if (!document.hidden) {
    clearTimeout(data.setInterTime)
    setTimer()
  }
}
/**
 * @description: 接口请求
 */
// 倒计时
const setTimer = (): void => {
  reqActDate(activityName).then(res => {
    if (!res.errCode) {
      data.time = res.data.countdown / 1000
      clearTimeout(data.setInterTime)
      switch (res.data.state) {
        case 0:
          showToast('活动未开始')
          break
        case 2:
          showToast('活动已结束')
          break
        default:
          break
      }
      if (data.time >= 1) {
        // 初始化
        timerOption()
        // 开始倒计时
        const startCount = () => {
          data.setInterTime = setTimeout(() => {
            if (data.time >= 1) {
              timerOption()
              startCount()
            } else {
              clearTimeout(data.setInterTime)
            }
          }, 1000)
        }
        startCount()
      }
    } else {
      showToast(res.errMsg)
    }
  })
}
// 倒计时操作
const timerOption = (): void => {
  data.time = data.time - 1
  const leftTime = data.time
  const days = checkTime(Math.floor(leftTime / 60 / 60 / 24)) // 计算剩余的天数
  const hours = checkTime(Math.floor((leftTime / 60 / 60) % 24)) // 计算剩余的小时
  const minutes = checkTime(Math.floor((leftTime / 60) % 60)) // 计算剩余的分钟
  const seconds = checkTime(Math.floor(leftTime % 60)) // 计算剩余的秒数
  data.countDown = {
    days,
    hours,
    minutes,
    seconds,
  }
}
// 将0-9的数字前面加上0，例1变为01
const checkTime = (i: number): string => {
  let num = i + ''
  if (i < 10) {
    num = '0' + i
  }
  return num
}

setTimer()

// 适用于安卓切换后台和息屏， 适用于苹果切换后台
document.addEventListener('visibilitychange', checkViChange)
// 每隔五分钟刷新一次倒计时
const timerLoop = setInterval(() => {
  setTimer()
}, 300000)
onUnmounted(() => {
  clearTimeout(timerLoop)
})
</script>

<style scoped lang="less">
.Timer {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  width: fit-content;
  .countDown {
    .flex-center;
    letter-spacing: 0.01rem;
    font-size: 0.12rem;
    margin: 0.06rem 0.2rem;
    color: #ffffff;
    .c-wrapper {
      margin: 0 0.02rem;
      .flex-center;
      width: 0.2rem;
      height: 0.19rem;
      background: #ffffff;
      border-radius: 0.04rem;
      font-size: 0.14rem;
      font-weight: bold;
      color: #000;
    }
  }
}
</style>
