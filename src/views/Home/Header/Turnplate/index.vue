<template>
  <div class="Turnplate">
    <img src="@/assets/bg/rainbow-light.png" alt="" class="light" />
    <!-- 三维球展示区 -->
    <div class="ball-zone">
      <!--
        @mousedown.passive="touchAction"
        @touchstart.passive="touchAction"
     -->
      <div class="avatar-zone">
        <div
          v-for="item in 4"
          :key="item + 'ring'"
          :class="[`ring ring${item}`, { stop: stopPlay }]"
        >
          <p></p>
        </div>
        <div class="ring ring5">
          <p :style="{ transform: `rotate(${vector}deg)` }"></p>
        </div>
        <div class="ring ring-shadow">
          <p></p>
        </div>
        <!-- <div class="ring"></div> -->
        <div class="avatar">
          <transition name="avatar-trans">
            <img
              :src="
                topInfo.firstInfoMap[MONTH_VALUE[activeIndex + 1]]?.topUser?.imgUrl.replace(
                  /\?imageView.+/,
                  '',
                ) || unknown
              "
              alt=""
              :key="
                topInfo.firstInfoMap[MONTH_VALUE[activeIndex + 1]]?.topUser?.imgUrl.replace(
                  /\?imageView.+/,
                  '',
                )
              "
            />
          </transition>
        </div>
      </div>
    </div>
    <div class="pointer-icon">
      <img src="@/assets/icon/pointer-icon.png" alt="" />
    </div>
    <div
      class="touch-zone"
      @mousedown.prevent="touchAction"
      @touchstart.prevent="touchAction"
    ></div>
    <!-- 三维圆盘展示 -->
    <div class="dice">
      <div class="dice-wrap">
        <div class="dice-item">
          <img
            src="@/assets/bg/turnplate.png"
            :style="{ transform: `rotate(${-vector}deg)` }"
            alt=""
          />
        </div>
        <div class="dice-item" v-for="(_, idx) in 4" :key="idx">
          <img
            src="@/assets/bg/thickness.png"
            alt=""
            :style="{ transform: `rotate(${-vector}deg)` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ActUserInfoDTO } from '@/interface/public'
import unknown from '@/assets/icon/doubt-ball.png'
import { MONTH_VALUE } from '@/views/data'
import { GetQueryString } from '@/util'
import { topInfoData } from '@/views/mock'

// type
interface ITopInfo {
  /** 今天日期 */
  curDate: string
  /**
   * 榜一用户信息
   * <month,用户信息>
   */
  firstInfoMap: Record<string, ActTwelveTopInfo>
}

interface ActTwelveTopInfo {
  /** 榜一 */
  topUser: ActUserInfoDTO | null
  /** 代表礼物的图链 */
  giftImgUrl: string
  /** 0：未开始；1：进行中；2：活动结束 */
  state: number
}
/**
 * 初始化
 */
const { stopPlay } = defineProps<{ stopPlay: boolean }>()
const emit = defineEmits<{
  updateIndex: [value: number]
}>()

/** 点亮下标 */
const month = (GetQueryString('month') as unknown as keyof typeof MONTH_VALUE) || 'Sept'
// const { month } = useRoute().query as { month: keyof typeof MONTH_VALUE }
const activeIndex = ref((MONTH_VALUE[month] || 1) - 1)
watch(activeIndex, (val) => emit('updateIndex', val), {
  immediate: true,
})

/**
 * 演变信息
 */
const topInfo = ref<ITopInfo>({
  curDate: '',
  firstInfoMap: {},
})
/** 获取演变信息 */
const getTopInfo = () => {
  // 模拟请求
  setTimeout(() => {
    topInfo.value = topInfoData
    // activeIndex.value = Number(data.curDate.split('-')[1]) - 1
    vector.value = -activeIndex.value * 30
  }, 50)
}
getTopInfo()
/**
 * 交互计算区
 */
/** 增量 */
const vector = ref(0)
/** 动画帧 */
const raf = ref(0)
/** 点击动画执行中 */
const clickAction = ref(false)
/** 触屏滑动中 */
const moveActive = ref(false)
/** 自适应分辨倍率 */
const ratio = document.body.clientWidth / 375
/** 触屏交互判定延时 */
const lagTimeout = ref(0)

/** 当前命中下标 */
const currentPosition = () => {
  activeIndex.value =
    (12 -
      (vector.value >= 0
        ? Math.floor((vector.value % 360) / 30) % 12
        : 12 - (Math.abs(Math.floor((vector.value % 360) / 30)) || 12))) %
    12
}

/** 交互操作 */
const touchAction = (e: MouseEvent | TouchEvent) => {
  if (clickAction.value) return
  cancelAnimationFrame(raf.value)
  /** 起始坐标 */
  const startAxisX = (e as MouseEvent).pageX || (e as TouchEvent).touches[0].pageX
  /** 上个弧度数据 */
  const oldValue = vector.value
  /** 旋转方向 1 正 -1 反 */
  let direction = 1
  /** 每帧旋转速度 | 位移间距 */
  let speed = 0
  /** 记录每次移动的时间戳 */
  let moveTime = 0
  /** 移动位置记录 */
  let lastMoveAxis = 0
  // lagTimeout.value = setTimeout(() => {
  //   moveActive.value = true
  // }, 100)

  /** 交互移动函数 */
  const moveEvent = (e: MouseEvent | TouchEvent) => {
    if (moveActive.value) {
      moveTime = new Date().getTime()
      /** 位移间距 */
      speed =
        (((e as MouseEvent).pageX || (e as TouchEvent).touches?.[0]?.pageX) - lastMoveAxis) / ratio
      lastMoveAxis = (e as MouseEvent).pageX || (e as TouchEvent).touches?.[0]?.pageX
      vector.value = (lastMoveAxis - startAxisX) / 1 / ratio + oldValue
    } else {
      moveActive.value = true
    }
  }

  window.onmousemove = window.ontouchmove = moveEvent

  window.onmouseup = window.ontouchend = () => {
    window.onmousemove = window.ontouchmove = null
    clearTimeout(lagTimeout.value)
    moveActive.value = false
    if (moveTime) {
      /** 衰减后的剩余旋转速度 */
      let acc = Math.abs(speed) - (new Date().getTime() - moveTime) / 2
      /** 限制最大速度 */
      if (acc >= 240) acc = 240
      direction = speed >= 0 ? 1 : -1
      speed = acc / 10
      const moveFrame = () => {
        if (speed >= 0) {
          vector.value += direction * speed
          speed -= 0.5
          raf.value = requestAnimationFrame(moveFrame)
        } else if (vector.value % 30 && Math.abs(vector.value % 30) >= 1) {
          vector.value += direction
          raf.value = requestAnimationFrame(moveFrame)
        } else if (vector.value % 30 && Math.abs(vector.value % 30) < 1) {
          vector.value = Math.floor(vector.value - (vector.value % 30))
          raf.value = requestAnimationFrame(moveFrame)
        } else {
          currentPosition()
          moveActive.value = false
        }
      }
      moveFrame()
    }
  }
}
onBeforeUnmount(() => cancelAnimationFrame(raf.value))
</script>

<style scoped lang="less">
.avatar-trans-leave-from,
.avatar-trans-leave-to {
  .ab-center;
}
.avatar-trans-enter-active,
.avatar-trans-leave-active {
  transition:
    opacity 0.5s,
    transform 0.5s;
}

.avatar-trans-enter-from,
.avatar-trans-leave-to {
  transform: scale(0.8);
  opacity: 0;
}

.Turnplate {
  position: relative;
  .flex-column;
  width: 3.75rem;
  margin-top: 1.8rem;
  .light {
    width: 1.84rem;
    height: 2.94rem;
    position: absolute;
    z-index: 3;
    pointer-events: none;
    right: 0rem;
    bottom: 0.5rem;
  }
  .ball-zone {
    position: relative;
    z-index: 4;
    transform: translateX(0.3rem);
    height: 4.3rem;
    width: 3.75rem;
    perspective-origin: center;
    perspective: 4rem;
    position: relative;
    z-index: 2;
    transform-style: preserve-3d;

    .avatar-zone {
      pointer-events: none;
      .ab-X;
      .rect(3.5rem);
      top: -0.22rem;
      .flex-center;
      transform: translate3d(-0.3rem, 0, -0.4rem);
      transform-style: preserve-3d;
      .ring {
        transform-style: preserve-3d;
        backface-visibility: hidden;
        .ab-center(2);

        .rect(1.35rem);
        .bg-normal('@/assets/bg/top-user-ring4.png');

        &.stop {
          > p {
            animation-play-state: paused;
          }
        }
      }

      @size: 3.3, 3.2, 2.07, 1.78, 2.97;
      @x: 3.5, 1.5, 1.5, 1.5, 0.7;
      @y: -1, 1.2, 0.5, 0.5, 0.16;
      @z: 0, 0, 1, 1, 0;
      @angle: 69, 67, 30, 30, 54;
      @r5Top: 0.65rem;
      @r5Left: -0.1rem;

      each(@size, {
        .ring@{index} {
          .rect(unit(@value, rem));
          transform: rotate3d(extract(@x, @index),
            extract(@y, @index),
            extract(@z, @index),
            unit(extract(@angle, @index), deg)) if((@index =2), translate3d(.3rem, -.4rem, 0)) if((@index =5), translate3d(@r5Left,  @r5Top, 0)) if(not(@index =2) and not(@index =5), translateZ(0));

          > p {
            .rect(unit(@value, rem));
            .bg-normal('@/assets/bg/top-user-ring@{index}.png');
            animation: if(not (@index =4) and not(@index =5), ring-rotate 8s linear infinite if(@index =5, reverse), none);

            @keyframes ring-rotate {
              100% {
                transform: rotate(1turn);
              }
            }
          }
        }
      });

      .ring-shadow {
        backface-visibility: hidden;
        .rect(unit(extract(@size, 5), rem));
        transform: rotate3d(
            extract(@x, 5),
            extract(@y, 5),
            extract(@z, 5),
            unit(extract(@angle, 5), deg)
          )
          translate3d(@r5Left, @r5Top, 0);

        > p {
          .rect(unit(extract(@size, 5), rem));
          .bg-normal('@/assets/bg/top-user-ring-shadow.png');
        }
      }

      &::before {
        backface-visibility: hidden;
        content: '';
        .ab-center(2);
        .rect(2rem);
        transform-style: preserve-3d;
      }

      &::after {
        backface-visibility: hidden;
        content: '';
        .bg-normal('@/assets/bg/top-user-bottom.png');
        width: 2.27rem;
        height: 0.77rem;
        transform: scale(0.9);
        .ab-X;
        bottom: 0.7rem;
      }

      .avatar {
        position: relative;
        z-index: 2;
        width: 1.37rem;
        height: 1.49rem;
        .flex-center;
        &::before {
          content: '';
          width: 1.37rem;
          height: 1.49rem;
          .ab-X(2);
          top: 0.04rem;
          .bg-normal('@/assets/bg/header-ball.png');
        }
        > img {
          background: #202eb8;
          .round(1.25rem);
        }
      }
    }
  }
  .pointer-icon {
    position: absolute;
    left: 1.52rem;
    bottom: 0.6rem;
    z-index: 2;
    animation: pointer-move 0.8s linear infinite alternate;
    @keyframes pointer-move {
      100% {
        transform: translateY(-0.05rem);
      }
    }
    > img {
      width: 0.27rem;
      height: 0.67rem;
    }
  }
  .touch-zone {
    width: 3.75rem;
    height: 1.4rem;
    .ab-X(2);
    opacity: 0;
    bottom: 0rem;
  }
  .dice {
    pointer-events: none;
    backface-visibility: hidden;
    position: absolute;
    z-index: 1;
    left: 1.62rem;
    top: -0.05rem;

    .size() {
      .rect(5.5rem);
    }

    .size;
    transform: rotate3d(0.65, 0.1, 0, 55deg) translate(-50%, 0);
    transform-style: preserve-3d;

    &::before {
      .ab2-center;
      .size;
      content: '';
      .bg-normal('@/assets/bg/turnplate-shadow.png');
    }

    .dice-wrap {
      transform-style: preserve-3d;
      position: relative;
      .size;
      .dice-item {
        .ab-center;
        .size;
        &::before {
          .ab2-center;
          .size;
          .bg-normal('@/assets/bg/turnplate-shadow.png');
        }
        .loop(@i: 1) when (@i <=5) {
          &:nth-child(@{i}) {
            &::before {
              content: if(not(@i = 1), '');
            }
            transform: translateZ(@i * -0.03rem) if((@i = 1), rotate(274deg));
          }

          .loop(@i + 1);
        }

        .loop;
        > img {
          transform-style: preserve-3d;
          .size;
        }
      }
    }
  }
}
</style>
