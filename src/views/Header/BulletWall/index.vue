<template>
  <div class="BulletWall">
    <div
      class="bullet-content"
      :class="[{ stop: stopId === item.id || stopPlay }, 'color' + item.color]"
      v-for="(item, index) in bulletInfo"
      :key="item.id"
      @click="bulletOption(item.id)"
      @blur="bulletOption('')"
      :tabIndex="1"
      @animationend="bulletInfo.splice(index, 1)"
      :style="{ top: item.position + 'rem' }"
    >
      <div class="bullet-avatar" @click.stop="toClientRoom(item.roomId)">
        <img :src="item.roomImg" alt="" />
      </div>
      <p class="bullet-text">{{ item.barrage }}</p>
    </div>
  </div>
</template>

<!-- 弹幕墙 -->
<script setup lang="ts">
import { useBullet, type IBulletItem } from '@/stores/bullet'

// type
interface IBulletInfo extends IBulletItem {
  id: string
  position: number
  color: number
}

/**
 * 初始化
 */
const { stopPlay } = defineProps<{ stopPlay: boolean }>()
const { showToast, request } = useTools()
const { toClientRoom } = useWebridge()
const { setBullet, selfBulletItem } = toRefs(useBullet())

/**  */
const bulletInfo = ref<IBulletInfo[]>([])
/** 总弹幕信息列表 */
const bulletItem = ref<IBulletItem[]>([])
/** 弹幕停留定时器 */
const stopTimer = ref(0)
/** 弹幕播放下标 */
const bulletIndex = ref(-1)
const stopId = ref('')
/** 弹幕播放定时器 */
const bulletTimer = ref(0)
/** 获取演变信息 */
const getBulletInfo = () => {
  request<IBulletItem[]>('/twelveStar/barrageList').then(res => {
    const { errCode, errMsg, data } = res
    if (!errCode) {
      bulletItem.value = data
      bulletIndex.value = 0
      bulletCycle()
    } else {
      showToast(errMsg)
    }
  })
}
getBulletInfo()
/**
 * @description: 弹幕播放间隔控制
 * @return {*}
 */
const bulletCycle = () => {
  if (!bulletItem.value.length || bulletIndex.value === -1 || stopPlay) return

  bulletTimer.value = setTimeout(() => {
    if (bulletInfo.value.length > 7) {
      // 超过一定弹幕数时，不再插入新的弹幕播放列表
      bulletCycle()
    } else if (bulletItem.value.length > bulletIndex.value) {
      bulletInfo.value.push({
        id: new Date().getTime() + 'id',
        color: Math.ceil(Math.random() * 5),
        position: Math.random() * 2,
        ...bulletItem.value[bulletIndex.value],
      })
      bulletIndex.value++
      bulletCycle()
    } else {
      bulletTimer.value = setTimeout(() => {
        bulletIndex.value = -1
        getBulletInfo()
      }, 5000)
    }
  }, 2000)
}
/** 暂停弹幕 */
const bulletOption = (id?: string): void => {
  clearTimeout(stopTimer.value)
  if (id) {
    stopId.value = id
    stopTimer.value = window.setTimeout(() => {
      stopId.value = ''
    }, 3000)
  } else {
    stopId.value = ''
  }
}

watch(
  () => selfBulletItem.value,
  val => {
    if (val.roomId) {
      bulletItem.value.splice(bulletIndex.value, 0, {
        ...val,
      })
      setBullet.value({ ...val, roomId: 0 })
    }
  }
)

watch(
  () => stopPlay,
  val => {
    if (val) {
      clearTimeout(stopTimer.value)
      clearTimeout(bulletTimer.value)
    } else {
      bulletCycle()
    }
  }
)

onBeforeUnmount(() => {
  clearTimeout(stopTimer.value)
  clearTimeout(bulletTimer.value)
})
</script>

<style scoped lang="less">
.BulletWall {
  position: absolute;
  width: 100vw;
  top: 0;
  left: 0;
  z-index: 5;
  pointer-events: none;
  .bullet-content {
    width: 1.34rem;
    height: 0.28rem;
    position: absolute;
    right: 0;
    animation: bullet-move 12s linear 1 both;
    pointer-events: initial;
    height: 0.28rem;
    user-select: none;
    @keyframes bullet-move {
      0% {
        transform: translateX(115%);
      }
      90% {
        opacity: 1;
      }

      100% {
        opacity: 0;
        transform: translateX(-115vw);
      }
    }
    &.stop {
      animation-play-state: paused;
    }
    .flex-center;
    &::before {
      content: '';
      min-width: 1.34rem;
      height: 0.26rem;
      border: solid #fff0d4;
      border-width: 0.01rem 0;
      .ab2-center;
      mask-image: linear-gradient(
        90deg,
        rgb(255, 255, 255) 35% 65%,
        rgba(0, 0, 0, 0) 100%
      );
      mask-size: 100%;
    }
    .bullet-avatar {
      .ab2-Y(3);
      left: -0.24rem;
      .round(0.34rem);
      &::before {
        content: '';
        .rect(0.39rem);
        .ab2-center;
        .bg-normal('@/assets/bg/bullet-avatar.png');
      }
      > img {
        .round(0.34rem);
      }
    }
    > p {
      position: relative;
      z-index: 2;
      font-size: 0.09rem;
      font-family: Source Han Serif CN;
      font-weight: 800;
      font-style: italic;
      color: #ffffff;
    }
    @color1: #7772eb, #ffe748, #ffe4c8, #7772eb, #6661de;
    @color2: #2058bf, #bf5c0b, #b62346, #4b0c93, #15144c;
    each(range(5), {
      &.color@{value}::before {
        background: linear-gradient(270deg, extract(@color1, @value) 0%, extract(@color2, @value) 100%);
      }
    });
  }
}
</style>
