<template>
  <div class="Lottery dash" :class="'level' + (advancedLottery + 1)">
    <div class="upper-zone">
      <div class="level-down-btn btn" @click="levelChange(0)"></div>
      <div class="guild left-dir">
        <p v-for="item in 8" :key="'arr' + item"></p>
      </div>
      <img src="@/assets/other/turn-round.png" alt="" class="turn-round" />
      <template v-if="selfInfo.enableAdvanceDraw">
        <div class="guild right-dir">
          <p v-for="item in 8" :key="'arr' + item"></p>
        </div>
        <div class="level-up-btn btn" @click="levelChange(1)"></div>
      </template>
    </div>
    <div
      class="main-lottery"
      :class="[{ 'change-set': advancedLottery !== ballIndex }, 'lag-level' + (ballIndex + 1)]"
    >
      <!-- 三维球展示区 -->
      <div class="ball-zone" @mousedown.prevent="touchAction" @touchstart.prevent="touchAction">
        <div
          class="navgation-ball"
          :class="{ lighten: dialog.transformActive }"
          @animationend="dialog.rewardDialog = true"
        >
          <div class="tab-block">
            <div class="wave-zone">
              <div
                class="wave-wrapper"
                :style="{
                  transform: `translateY(${((90 - angle) / 180) * 1.1 + 0.4}rem)`,
                }"
              >
                <div class="w-wave"></div>
                <div class="w-wave"></div>
                <div class="w-wave"></div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="ball"
          :class="{ active: activeIdx === idx, cloak: dialog.transformActive }"
          v-for="(item, idx) in position"
          :key="idx"
          @click="activeIdx = idx"
          @touchstart="activeIdx = idx"
          @animationend="activeIdx = -1"
          :style="{ transform: item }"
        >
          <img :src="ballInfo[ballIndex][idx].rewardImg" alt="" />
        </div>
      </div>
      <div class="turnplate">
        <img src="@/assets/other/turnplate.png" alt="" />
        <p></p>
      </div>
      <div class="btn-zone">
        <div
          class="btn-wrapper"
          v-for="item in 2"
          :key="item + 'btn'"
          @click="getRewardInfo(10 ** (item - 1))"
        >
          <p>演变{{ 10 ** (item - 1) }}次</p>
        </div>
      </div>
      <div class="my-info">
        <img :src="resUserInfo.imgUrl" alt="" class="avatar" />
        <div class="detail">
          <p class="count">
            我的演变次数:<span>{{ selfInfo.lotteryNum }}次</span>
          </p>
          <p class="small-tips">完成每日任务可获得演变次数</p>
        </div>
        <div class="infos">
          <img src="@/assets/btn/record-btn.png" alt="" class="btn" @click="openRecordDialog" />
          <!-- <p class="small-tips">*本月活动结束将会重置~</p> -->
        </div>
      </div>
    </div>

    <!-- 演变结果弹框 -->
    <Model v-model="dialog.rewardDialog">
      <div class="reward-dialog">
        <img src="@/assets/text/reward-title.png" alt="" class="title" />
        <div class="base-tips">恭喜获得以下奖励</div>
        <!-- <div class="gift-list">
          <div class="gift-item" v-for="(val, index) in dialog.rewardInfo" :key="index + 'gift'">
            <div class="gift-frame">
              <img :src="val.rewardImg" alt="" />
            </div>
            <p class="name">{{ val.rewardName }}*{{ val.multipleCount + val.unit }}</p>
            <p class="price">x{{ val.count || 1 }}</p>
          </div>
        </div> -->
        <img src="@/assets/other/show-reward-frame.png" alt="" class="gift-frame" />
        <img
          src="@/assets/icon/close-icon.png"
          alt=""
          class="close-icon"
          @click="closeRewardDialog"
        />
      </div>
    </Model>

    <!-- 演变记录弹框 -->
    <Model v-model="dialog.recordDialog" model="follow">
      <div class="record-dialog">
        <img src="@/assets/text/reward-record.png" alt="" class="title" />
        <div class="record-list">
          <TableList
            :list-data="dialog.recordInfo || []"
            :infinite-scroll="dialog.pageNum <= dialog.totalPage"
            v-model:page="dialog.pageNum"
            :total-page="dialog.totalPage"
            @reload-list="getRecordInfo"
          >
            <template #tableList="{ item }">
              <div class="record-item" :class="item.type ? 'advance' : 'normal'">
                <div class="upper-info">
                  <p class="count">{{ item.type ? '高级' : '初级' }}演变 x{{ item.count }}次</p>
                  <p class="time">{{ item.createTime }}</p>
                </div>
                <div class="gift-list">
                  <div
                    class="gift-item"
                    v-for="(val, idx) in item.lotteryResultList"
                    :key="idx + 'gift'"
                  >
                    <div class="count">x{{ val.count }}</div>
                    <img :src="val.rewardImg" alt="" />
                    <div class="name">{{ val.rewardName + val.unit }}</div>
                  </div>
                </div>
              </div>
            </template>
            <template #footer>
              <p v-if="!dialog.recordInfo.length" class="empty">暂无记录~</p>
            </template>
          </TableList>
        </div>
        <img
          src="@/assets/icon/close-icon.png"
          alt=""
          class="close-icon"
          @click="dialog.recordDialog = false"
        />
      </div>
    </Model>
  </div>
</template>

<script setup lang="ts">
import type { ActivityCommonReward } from '@/interface/public'
import { selfInfoData, starEvolutionRecord } from '@/views/mock'
import { dialogRewardInfo } from '@/stores/dialog'

// type
interface ISelfInfo {
  /** 剩余演变次数 */
  lotteryNum: number
  /** 初级演变的奖励列表 */
  rewardList: Array<ActivityCommonReward>
  /** 进行高级演变所需的星辰值或星际值 */
  advancedScore: number
  /** 高级演变的奖励列表 */
  advancedRewardList: Array<ActivityCommonReward>
  /**
   * 能否进行
   * 高级演变
   * 1->是
   * 0->否
   */
  enableAdvanceDraw: number
}

interface IRecordInfo {
  /**
   * 0->初级演变
   * 1->高级演变
   */
  type: number
  /** 演变次数 */
  count: number
  /** 时间 */
  createTime: string
  /** 结果 */
  lotteryResultList: Array<ActLotteryResultDTO>
}

interface ActLotteryResultDTO {
  /** 奖励类型 */
  rewardType: number
  /**
   * 挂饰-xx
   * *3天
   */
  rewardName: string
  /** 奖励图 */
  rewardImg: string
  /** 所得份数 */
  count: number
  unit: string
}

/**
 * 初始化
 */
const { resUserInfo } = usePublicRequest()
/** 球体初始化 */
const ballInfo = ref<Array<ActivityCommonReward & { x: number; y: number }>[]>([[], []])
/** 是否为高级演变 1->是 0->否 */
const advancedLottery = ref(0)
/** 执行演变等级更换动画中 */
const keepChanging = ref(false)
/** 定时器 */
const timeout = ref(0)
/**
 * 演变信息
 */
const selfInfo = ref<ISelfInfo>({
  lotteryNum: 0,
  rewardList: [],
  advancedScore: 0,
  advancedRewardList: [],
  enableAdvanceDraw: 0,
})
/** 获取演变信息 */
const getSelfInfo = () => {
  clearTimeout(timeout.value)
  setTimeout(() => {
    selfInfo.value = selfInfoData
    ballInfo.value = [
      (selfInfo.value.rewardList || []).map((item, i) => ({
        ...item,
        x: (Math.PI / 5) * i,
        y: ((Math.PI * 40) / 180) * ((i % 4) - 1.5),
      })),
      (selfInfo.value.advancedRewardList || []).map((item, i) => ({
        ...item,
        x: (Math.PI / 5) * i,
        y: ((Math.PI * 40) / 180) * ((i % 4) - 1.5),
      })),
    ]
  }, 50)
}
getSelfInfo()
/** 演变等级变更 */
const levelChange = (idx: number) => {
  if (keepChanging.value || advancedLottery.value === idx) return
  advancedLottery.value = idx
  keepChanging.value = true
  cancelAnimationFrame(raf.value)
  changeFrame()
  timeout.value = setTimeout(() => {
    transformSpeed.value = 20
    cancelAnimationFrame(raf.value)
    ballIndex.value = idx
    changeFrame()
  }, 600)
}
/** 等级变更动画 */
const changeFrame = () => {
  if (advancedLottery.value !== ballIndex.value) {
    vector.value += 20
    raf.value = requestAnimationFrame(changeFrame)
  } else if (advancedLottery.value === ballIndex.value && transformSpeed.value > 0.2) {
    vector.value += transformSpeed.value
    transformSpeed.value -= 0.5
    raf.value = requestAnimationFrame(changeFrame)
  } else if (advancedLottery.value === ballIndex.value && transformSpeed.value <= 0.2) {
    cancelAnimationFrame(raf.value)
    timeout.value = setTimeout(() => {
      keepChanging.value = false
      selfRotate()
    }, 50)
  }
}

/**
 * 弹框
 */
/** 弹框信息 */
const dialog = reactive({
  /** 演变 */
  rewardDialog: false,
  /** 记录 */
  recordDialog: false,
  /** 弹幕信息 */
  rewardInfo: [] as ActivityCommonReward[],
  /** 记录信息 */
  recordInfo: [] as IRecordInfo[],
  totalPage: 1,
  pageNum: 1,
  /** 执行演变动画 */
  transformActive: false,
})

/** 打开奖励弹框 */
const getRewardInfo = (count: number) => {
  console.log(`演变次数 -`, count)
  if (keepChanging.value || dialog.transformActive) return

  setTimeout(() => {
    dialog.rewardInfo = dialogRewardInfo
    // dialog.rewardDialog = true
    dialog.transformActive = true
    keepChanging.value = true
    cancelAnimationFrame(raf.value)
    raf.value = requestAnimationFrame(() => resultTransform(0))
    getSelfInfo()
  }, 50)
}
const closeRewardDialog = () => {
  dialog.rewardDialog = false
  dialog.transformActive = false
  cancelAnimationFrame(raf.value)
  raf.value = requestAnimationFrame(() => resultTransform(1))
}
/** 打开奖励时，动画变化 */
const resultTransform = (type: number) => {
  if (rad.value > 0.1 && type === 0) {
    rad.value -= 0.05
    raf.value = requestAnimationFrame(() => resultTransform(0))
  } else if (rad.value < radRange[0] && type === 1) {
    rad.value += 0.02
    raf.value = requestAnimationFrame(() => resultTransform(1))
  } else if (type === 1) {
    keepChanging.value = false
    selfRotate()
  }
}
/** 打开记录弹框 */
const openRecordDialog = () => {
  dialog.pageNum = 1
  dialog.recordInfo = []
  getRecordInfo().then(() => (dialog.recordDialog = true))
}

/** 获取奖励记录 */
const getRecordInfo = () =>
  new Promise((res) => {
    res(
      setTimeout(() => {
        dialog.recordInfo = [...dialog.recordInfo, ...starEvolutionRecord]
        dialog.totalPage = 1
      }, 50),
    )
  })

/**
 * 3d 球轨道交互计算区
 */
/** 动画横向变化速度 */
const transformSpeed = ref(1)
/** 球体转换成相关演变等级下标 */
const ballIndex = ref(0)
/** 增量 */
const vector = ref(0)
/** 动画执行中 */
const moveActive = ref(false)
/** 动画帧 */
const raf = ref(0)
/** 当前点击礼物下标 */
const activeIdx = ref(-1)
/** 轨道半径变化范围 */
const radRange = readonly([0.85, 0.95])
/** 轨道半径 */
const rad = ref(radRange[0])
/** 自适应分辨倍率 */
const ratio = document.body.clientWidth / 375

/** 旋转轴倾斜角度 */
const angle = ref(0)
/** 位移计算 */
const position = computed(() =>
  ballInfo.value[ballIndex.value].map((item) => {
    /** 球坐标分布 */
    const axis = {
      x: Math.sin(item.x + (vector.value * Math.PI) / 180) * Math.cos(item.y) * rad.value,
      y: Math.sin(item.y) * rad.value,
      z: Math.cos(item.x + (vector.value * Math.PI) / 180) * Math.cos(item.y) * rad.value,
    }

    /** 欧拉角关于y轴的计算 */
    return `translate3d(${axis.x}rem, ${
      axis.y * Math.cos((angle.value * Math.PI) / 180) -
      axis.z * Math.sin((angle.value * Math.PI) / 180)
    }rem, ${
      axis.y * Math.sin((angle.value * Math.PI) / 180) +
      axis.z * Math.cos((angle.value * Math.PI) / 180)
    }rem)`
  }),
)

/** 交互操作 */
const touchAction = (e: MouseEvent | TouchEvent) => {
  /** 获取事件x y 坐标 */
  const targetAxis = (e: MouseEvent | TouchEvent) => ({
    x: (e as MouseEvent).pageX || (e as TouchEvent).touches?.[0].pageX || 0,
    y: (e as MouseEvent).pageY || (e as TouchEvent).touches?.[0].pageY || 0,
  })

  /** 起始坐标 */
  const startAxis = targetAxis(e)
  /** 上个弧度数据 */
  /** 旋转方向 1 正 -1 反 */
  let direction = 1
  /** 每帧旋转速度 | 位移间距 */
  let speed = 0
  /** 记录每次移动的时间戳 */
  let moveTime = 0
  /** 移动位置记录 */
  let lastMoveAxis = startAxis
  const oldValue = vector.value

  /** 交互移动函数 */
  const moveEvent = (ev: MouseEvent | TouchEvent) => {
    // 无论是否转换成功，都重置转换状态
    keepChanging.value = false
    if (moveActive.value) {
      moveTime = new Date().getTime()
      const moveAxis = targetAxis(ev)
      /** 位移间距 */
      speed = moveAxis.x - lastMoveAxis.x
      /** 旋转轴倾斜角度计算 */
      const angleMove = angle.value + (lastMoveAxis.y - moveAxis.y) / 2 / ratio
      angle.value = angleMove >= 90 ? 90 : angleMove <= -90 ? -90 : angleMove
      /** 横向旋转 */
      vector.value = (lastMoveAxis.x - startAxis.x) / 1 / ratio + oldValue
      lastMoveAxis = moveAxis
    } else {
      cancelAnimationFrame(raf.value)
      clearTimeout(timeout.value)
      moveActive.value = true
      radChange()
    }
  }

  window.onmousemove = window.ontouchmove = moveEvent

  window.onmouseup = window.ontouchend = () => {
    window.onmousemove = window.ontouchmove = null
    if (moveTime > 30) {
      /** 衰减后的剩余旋转速度 */
      let acc = Math.abs(speed) - (new Date().getTime() - moveTime) / 5
      /** 限制最大速度 */
      if (acc >= 240) acc = 240
      direction = speed >= 0 ? 1 : -1
      speed = acc / 10
      const moveFrame = () => {
        if (speed >= 0) {
          vector.value += direction * speed
          speed -= 0.5
          raf.value = requestAnimationFrame(moveFrame)
        } else {
          moveActive.value = false
          radChange()
          clearTimeout(timeout.value)
          timeout.value = setTimeout(() => {
            selfRotate()
          }, 2000)
        }
      }
      moveFrame()
    } else {
      moveActive.value = false
      radChange()
      clearTimeout(timeout.value)
      timeout.value = setTimeout(() => {
        selfRotate()
      }, 2000)
    }
  }
}

/** 半径变化 */
const radChange = () => {
  const speedRate = 0.02
  if (moveActive.value && rad.value < radRange[1]) {
    rad.value += speedRate
    requestAnimationFrame(radChange)
  } else if (!moveActive.value && rad.value > radRange[0]) {
    rad.value -= speedRate
    requestAnimationFrame(radChange)
  }
}

/** 自旋转 */
const selfRotate = () => {
  cancelAnimationFrame(raf.value)
  vector.value += 0.1
  raf.value = requestAnimationFrame(selfRotate)
}
selfRotate()

onBeforeUnmount(() => {
  cancelAnimationFrame(raf.value)
  clearTimeout(timeout.value)
})
</script>

<style scoped lang="less">
// 横向序列帧雪碧图动画
// 使用说明：
//  - @url: 横向拼接的雪碧图路径（40帧）
//  - @frames: 帧数（默认40）
//  - @duration: 动画时长（默认1s）
.sprite-animate(@url, @frames: 40, @duration: 2s) {
  background-image: url(@url);
  background-repeat: no-repeat;
  // 横向 @frames 张拼接，宽度按帧数等比放大
  background-size: (@frames * 100%) 100%;
  background-position: 0 0;
  animation: sprite-run-40 @duration steps((@frames - 1)) infinite;
}

@keyframes sprite-run-40 {
  100% {
    background-position: 100% 0;
  }
}

.Lottery {
  margin-top: 0.25rem;
  width: 3.75rem;
  height: 5.52rem;
  position: relative;
  box-sizing: border-box;
  padding-top: 0.2rem;
  &::before {
    content: '';
    .bg-normal('@/assets/bg/lottery-frame.png');
    width: 3.75rem;
    height: 5.52rem;
    .ab-center(3);
    pointer-events: none;
  }
  .upper-zone {
    .ab-X;
    width: 3.62rem;
    top: -0.6rem;
    .flex-center;
    &::before {
      content: '';
      .bg-normal('@/assets/animate/normal-character/normal-character1.png');
      width: 1.15rem;
      height: 0.8rem;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
      transform: scaleX(-1);
      animation:
        normal-char-in 0.5s 1 both,
        normal-char-show 2s steps(1) infinite;
      @keyframes normal-char-in {
        0% {
          transform: translateX(-0.3rem) scaleX(-1);
          opacity: 0;
        }
      }
      .normal-char-animate;
    }
    &::after {
      content: '';
      .bg-normal('@/assets/other/gold-character.png');
      width: 1rem;
      height: 1.3rem;
      position: absolute;
      right: 0.1rem;
      top: -0.15rem;
      z-index: 1;
      animation: gold-char-out 0.5s 1 both;
      @keyframes gold-char-out {
        100% {
          transform: translateX(0.3rem);
          opacity: 0;
        }
      }
    }
    .btn {
      width: 0.75rem;
      height: 1rem;
      position: absolute;
      top: 0.05rem;
      z-index: 2;
      // transition: transform 0.5s cubic-bezier(0.17, 0.67, 0.56, 1.27);
    }
    .turn-round {
      .rect(1.81rem);
      transform: rotate(0.5turn);
      transition: transform 0.5s;
    }
    .level-down-btn {
      left: 0.2rem;
      .bg-normal('@/assets/btn/flip-btn2.png');
      transform-origin: 150% bottom;
      // transform: rotate(-90deg);
      animation: down-ro-out 0.5s 1 both cubic-bezier(0.17, 0.67, 0.56, 1.27);
      @keyframes down-ro-out {
        100% {
          transform: rotate(-90deg);
        }
      }
    }
    .level-up-btn {
      right: 0.2rem;
      .bg-normal('@/assets/btn/flip-btn1.png');
      transform-origin: -50% bottom;
      transform: rotate(0deg);
      animation:
        up-ro-in 0.5s 1 both cubic-bezier(0.17, 0.67, 0.56, 1.27),
        up-tips 2.5s ease-out 1s infinite;
      @keyframes up-ro-in {
        0% {
          transform: rotate(90deg);
        }
      }
      @keyframes up-tips {
        0%,
        10%,
        20% {
          transform: rotate(0deg);
        }
        5%,
        15% {
          transform: rotate(-5deg);
        }
      }
    }
    .guild {
      .flex-column;
      position: absolute;
      z-index: 1;
      top: 0.05rem;
      > p {
        position: absolute;
        z-index: 1;
        left: 0;
        top: 0;
        width: 0.2rem;
        height: 0.17rem;
        .bg-normal('@/assets/icon/guild-icon.png');
        each(range(8), {
          &:nth-child(@{value}) {
            transform:
              translate(
                sin((@value * pi() / 16 / 2 + pi() / 32)) * 0.6rem,
                (1 - cos((@value * pi() / 16 / 4 * 3 + pi() / 16 / 4 * 3))) * .65rem
              )
              rotate((0 - (8 - @value) / 7) * 20deg);
            animation: guild-light 1s linear (8 - @value) * .1s infinite
          }
        });
        @keyframes guild-light {
          0%,
          60% {
            opacity: 1;
          }
          30% {
            opacity: 0.2;
          }
        }
      }
      @axisX: 1.5rem;
      &.left-dir {
        transform: scaleX(-1);
        left: @axisX;
        display: none;
      }
      &.right-dir {
        right: @axisX;
      }
    }
  }
  .main-lottery {
    .flex-column;
    padding-top: 0.2rem;
    position: relative;
    z-index: 2;
    pointer-events: none;
    width: 3.75rem;
    height: 100%;
    background-blend-mode: screen;
    background-size:
      3.75rem 4.36rem,
      3.2rem 1.2rem;
    background-position:
      center 0.1rem,
      center 2.6rem;
    background-repeat: no-repeat;
    > div {
      pointer-events: auto;
    }
    // mask-image: url('@/assets/bg/dash-mask.png');
    // mask-size: 3.62rem 100%;
    // mask-repeat: no-repeat;
    // mask-position: center;

    .ball-zone {
      padding-top: 0.6rem;
      margin-bottom: 0.6rem;
      position: relative;
      z-index: 2;
      perspective-origin: center;
      perspective: 1.5rem;
      width: 2.5rem;
      height: 2.4rem;
      transform-style: preserve-3d;
      transition: opacity 0.4s;
      .navgation-ball {
        transform-style: preserve-3d;
        .ab-center;
        .round(1.15rem);
        .flex-center;
        transform: translate3d(0, 0, 0);
        @transY: -0.4rem;
        // opacity: 0.8;
        // animation: lighten 4s infinite;
        // @keyframes lighten {
        //   0%,
        //   50%,
        //   100% {
        //     filter: drop-shadow(0 0 0.08rem #f7f4f9);
        //   }
        //   25% {
        //     filter: drop-shadow(0 0 0 #f7f4f9);
        //   }
        // }
        &.lighten {
          animation: lighten 1s 0.5s 1;
          @keyframes lighten {
            0%,
            100% {
              filter: brightness(1);
            }
            50% {
              opacity: 1;
              filter: brightness(3);
            }
          }
        }
        .tab-block {
          // .sprite-animate('@/assets/animate/bubble-purple-animate.png');
          transform: translate3d(0, 0, 0);
          transform-style: preserve-3d;
          width: 1.96rem;
          height: 1.89rem;
          position: absolute;
          z-index: 1;
          left: -0.24rem;
          top: -0.18rem;
          &::before {
            transform-style: preserve-3d;
            content: '';
            width: 1.96rem;
            height: 1.89rem;
            .ab-center(2);
            .bg-normal('@/assets/bg/bubble-purple-ball.png');
          }
          .wave-zone {
            transform-style: preserve-3d;
            .round(1.15rem);
            transform: translate3d(0, 0, 0);
            overflow: hidden;
            margin-left: 0.24rem;
            margin-top: 0.18rem;
            .wave-wrapper {
              position: relative;
              transform: translate3d(0, 0, 0);
              .w-wave {
                position: absolute;
                .rect(2rem);
                background: rgba(96, 48, 201, 0.6);
                bottom: 0;
                left: 50%;
                transform: translate3d(-50%, @transY, 0);
                z-index: 1;
                animation: wave 10s linear infinite;
                @rad:
                  45% 47% 44% 42%,
                  38% 46% 43% 47%,
                  42% 46% 37% 40%;
                @angle:
                  0deg,
                  -360deg,
                  720deg;
                each(range(3), {
                  &:nth-child(@{value}) {
                    border-radius: 38% 46% 43% 47%;
                    transform: translate3d(-50%, @transY, 0) rotate(extract(@angle, @value));
                  }
                });
              }
              @keyframes wave {
                100% {
                  transform: translate3d(-50%, @transY, 0) rotate(720deg);
                }
              }
            }
          }
        }
      }
      .ball {
        .ab-center;
        // perspective: 2rem;
        backface-visibility: hidden;
        .rect(0.4rem);
        .flex-center;
        transform-style: preserve-3d;
        &::before {
          content: '';
          .ab-center;
          .sprite-animate('@/assets/animate/bubble-purple-animate.png');
          .rect(0.4rem);
        }
        &.active {
          animation: brightness 1s 1;
          @keyframes brightness {
            0%,
            50%,
            100% {
              filter: brightness(1);
            }
            25%,
            75% {
              filter: brightness(2);
            }
          }
        }
        &.cloak {
          animation: cloak-ball 0.3s 1;
          opacity: 0;
          @keyframes cloak-ball {
            0% {
              opacity: 1;
            }
            100% {
              opacity: 0;
            }
          }
        }
        > img {
          filter: drop-shadow(0 0 0.02rem rgb(95, 44, 9));
          .rect(0.2rem);
          object-fit: contain;
          position: relative;
          z-index: 2;
        }
      }
    }
    .turnplate {
      .ab-X;
      width: fit-content;
      top: 2.5rem;
      > img {
        position: relative;
        z-index: 2;
        width: 3.44rem;
        height: 1.26rem;
        animation:
          float 1.5s linear infinite alternate,
          shine 2s infinite;
        @keyframes float {
          100% {
            transform: translate3d(0, -0.1rem, 0);
          }
        }
        @keyframes shine {
          0%,
          50% {
            filter: brightness(1);
          }
          25% {
            filter: brightness(1.5);
          }
        }
      }
      > p {
        width: 3.44rem;
        height: 1.14rem;
        .ab2-X;
        bottom: -0.1rem;
        .bg-normal('@/assets/other/turnplate-shadow.png');
        animation: shadow-move 1.5s linear infinite alternate;
        opacity: 0.9;
        @keyframes shadow-move {
          100% {
            opacity: 0.8;
            filter: blur(0.02rem);
          }
        }
      }
    }
    .btn-zone {
      .ab-X;
      bottom: 1.5rem;
      .flex-center;
      .btn-wrapper {
        width: 1.1rem;
        height: 0.42rem;
        .bg-normal('@/assets/btn/change-btn.png');
        .flex-center;
        margin: 0 0.17rem;
        transition:
          background 0.5s,
          width 0.5s,
          height 0.5s;
        &:active {
          transform: translateY(0.03rem);
          filter: brightness(0.8);
        }
        > p {
          transition: color 0.5s;
          margin-top: 0.04rem;
          font-size: 0.12rem;
          font-family: Source Han Serif CN;
          font-weight: 800;
          font-style: italic;
          color: #ffffff;
        }
      }
    }
    .my-info {
      width: 3.75rem;
      height: 1.48rem;
      .bg-normal('@/assets/bg/transform-bg.png');
      .flex-center;
      box-sizing: border-box;
      .avatar {
        margin-left: 0.5rem;
        .round(0.5rem);
        border: 0.01rem solid #ffffff;
      }
      > div {
        .small-tips {
          margin-top: 0.02rem;
          font-size: 0.09rem;
          font-family: Source Han Serif CN;
          font-weight: 200;
          font-style: italic;
          color: #ffffff;
        }
      }
      .detail {
        flex-grow: 1;
        text-align: left;
        margin-left: 0.06rem;
        .count {
          font-size: 0.1rem;
          font-family: Source Han Serif CN;
          font-weight: 400;
          font-style: italic;
          color: #ffffff;
          > span {
            font-size: 0.1rem;
            font-weight: 600;
          }
        }
      }
      .infos {
        .flex-column;
        margin-right: 0.4rem;
        .btn {
          width: 0.8rem;
          height: 0.26rem;
        }
      }
    }
    &.change-set {
      .ball-zone {
        opacity: 0;
      }
    }
    &.lag-level1 {
      .wave-animate(dash);
      background-image:
        url('@/assets/bg/common-bg-dash.png'), url('@/assets/animate/wave/wave1.jpg');
    }
    &.lag-level2 {
      .wave-animate(advance);
      background-image:
        url('@/assets/bg/common-bg-advance.png'), url('@/assets/animate/wave/wave1.jpg');
      .ball-zone {
        .navgation-ball {
          // background: linear-gradient(0deg, #e58a1f, #edd14f, #fbf7d0);
          .tab-block {
            // .sprite-animate('@/assets/animate/bubble-gold-animate.png');
            &::before {
              content: '';
              width: 1.96rem;
              height: 1.89rem;
              .ab-center(2);
              .bg-normal('@/assets/bg/bubble-gold-ball.png');
            }
            .wave-zone {
              .wave-wrapper {
                .w-wave {
                  // background: rgba(92, 64, 227, 0.8);
                  background: linear-gradient(180deg, #e58a1f 30%, #edd14f, #fbf7d0);
                  opacity: 0.8;
                }
              }
            }
          }
        }
        .ball {
          &::before {
            .sprite-animate('@/assets/animate/bubble-gold-animate.png');
          }
        }
      }
      .btn-zone {
        .btn-wrapper {
          background-image: url('@/assets/btn/blank-gold-btn.png');
          width: 1.23rem;
          height: 0.44rem;
          > p {
            color: #993f1f;
            margin-bottom: 0.02rem;
          }
        }
      }
    }
  }
  &.level2 {
    .upper-zone {
      &::before {
        animation: normal-char-out 0.5s 1 both;
        @keyframes normal-char-out {
          100% {
            transform: translateX(-0.3rem) scaleX(-1);
            opacity: 0;
          }
        }
      }
      &::after {
        content: '';
        .bg-normal('@/assets/other/gold-character.png');
        width: 1rem;
        height: 1.3rem;
        position: absolute;
        right: 0.1rem;
        top: -0.15rem;
        z-index: 1;
        animation: gold-char-in 0.5s 1 both;
        @keyframes gold-char-in {
          0% {
            transform: translateX(0.3rem);
            opacity: 0;
          }
        }
      }
      .turn-round {
        transform: rotate(0);
      }
      .level-down-btn {
        transform: rotate(0deg);
        animation:
          down-ro-in 0.5s 1 both cubic-bezier(0.17, 0.67, 0.56, 1.27),
          down-tips 2.5s ease-out 1s infinite;
        @keyframes down-ro-in {
          0% {
            transform: rotate(-90deg);
          }
        }
        @keyframes down-tips {
          0%,
          10%,
          20% {
            transform: rotate(0deg);
          }
          5%,
          15% {
            transform: rotate(5deg);
          }
        }
      }
      .level-up-btn {
        animation: up-ro-out 0.5s 1 both cubic-bezier(0.17, 0.67, 0.56, 1.27);
        @keyframes up-ro-out {
          100% {
            transform: rotate(90deg);
          }
        }
      }
      .guild {
        &.left-dir {
          display: initial;
        }
        &.right-dir {
          display: none;
        }
      }
    }
  }
}

.reward-dialog {
  // .common-dialog;
  .flex-column;
  width: 3.75rem;
  height: 5.35rem;
  .bg-normal('@/assets/bg/reward-dialog-bg.png');
  position: relative;
  .title {
    width: 3.75rem;
    height: 1.54rem;
    .ab-X;
    top: -0.3rem;
  }
  .base-tips {
    margin-top: 1.3rem;
    .flex-center;
    width: 2.17rem;
    height: 0.22rem;
    .linear-bg(#FFFEAA, 20% 80%);
    font-family: Source Han Serif CN;
    font-weight: 400;
    font-size: 0.1rem;
    color: #973f30;
    position: relative;
  }
  .gift-list {
    margin: 0.15rem 0 1rem;
    width: 3.3rem;
    max-height: 2rem;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    .flex-center;
    .gift-list-style;
    flex-wrap: wrap;
  }
  .gift-frame {
    margin-top: 0.15rem;
    width: 1.29rem;
    height: 2.02rem;
  }
  .close-icon {
    .rect(0.44rem);
    .ab-X;
    bottom: -0.5rem;
    animation: close-show 0.5s 1 0.3s both;
    @keyframes close-show {
      0% {
        transform: rotate(0) scale(0);
      }
      100% {
        transform: rotate(1turn) scale(1);
      }
    }
  }
}

.record-dialog {
  .common-dialog;
  .title {
    width: 1.35rem;
    height: 0.47rem;
    margin-top: 0.35rem;
  }
  .record-list {
    margin: 0.4rem 0 1.09rem;
    :deep(.Table) {
      position: relative;
      overflow: hidden;
      .table-list {
        max-height: 2.7rem;
        mask-image: linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, #fff 5% 95%, rgba(0, 0, 0, 0) 100%);
        mask-size: 100%;
        .record-item {
          @width: 3.71rem;
          min-height: 2rem;
          width: @width;
          background-size:
            @width 0.61rem,
            @width calc(100% - 1.38rem),
            @width 0.79rem;
          background-position:
            top center,
            center 0.6rem,
            bottom center;
          background-repeat: no-repeat;
          .upper-info {
            display: flex;
            align-items: flex-end;
            padding-top: 0.1rem;
            .count {
              margin-left: 0.17rem;
              font-size: 0.12rem;
              font-family: Source Han Serif CN;
              font-weight: 800;
              font-style: italic;
              width: 1.05rem;
              text-align: left;
            }
            .time {
              font-size: 0.09rem;
              font-family: Source Han Serif CN;
              font-weight: 400;
              font-style: italic;
              color: #ffffff;
            }
          }
          .gift-list {
            padding: 0.15rem 0 0.3rem;
            .flex-center;
            flex-wrap: wrap;
            .gift-item {
              margin: 0 0.02rem 0.2rem;
              position: relative;
              width: 0.82rem;
              height: 0.72rem;
              .flex-center;
              .bg-normal('@/assets/bg/gift-ball-bg.png');
              > img {
                .rect(0.65rem);
                object-fit: contain;
              }
              .count {
                position: absolute;
                z-index: 1;
                right: 0;
                top: 0;
                height: 0.13rem;
                padding: 0 0.06rem;
                font-size: 0.08rem;
                font-family: Source Han Serif CN;
                font-weight: 800;
                font-style: italic;
                box-sizing: border-box;
                color: #ac501e;
                .bg-normal('@/assets/bg/gift-count-bg.png', 100% 100%);
              }
              .name {
                .ab2-X;
                bottom: 0;
                box-sizing: border-box;
                width: 1.08rem;
                padding: 0.05rem 0.23rem;
                font-size: 0.08rem;
                font-family: Source Han Serif CN;
                font-weight: 800;
                font-style: italic;
                color: #ac501e;
                .bg-normal('@/assets/bg/gift-name-bg.png', 100%);
              }
            }
          }
          .bg-pic(@name) {
            background-image:
              url('@/assets/bg/record-@{name}-bg.png'), url('@/assets/bg/record-mid-bg.png'),
              url('@/assets/bg/record-under-bg.png');
          }
          &.normal {
            .bg-pic(normal);
            .upper-info {
              .count {
                color: #ffffff;
                .word-stroke(#453afc);
              }
              .time {
                .word-stroke(#453afc);
              }
            }
          }
          &.advance {
            .bg-pic(advance);
            .upper-info {
              .count {
                color: #9f502c;
              }
            }
          }
        }
      }
    }
    .empty {
      font-size: 0.16rem;
      font-weight: 600;
      color: #fff;
    }
  }
}
</style>
