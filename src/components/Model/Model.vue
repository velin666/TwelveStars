<template>
  <Teleports :to="to" class="dialog-container">
    <transition name="mask-fade">
      <div class="Mask" v-if="dialogVisible" @click="MaskCloseFn"></div>
    </transition>
    <transition v-if="model === 'follow'" :name="`dialog-follow`">
      <div class="Dialog" :class="[model]" v-if="dialogVisible" ref="dialogRef">
        <div
          class="dialog-content"
          :style="{
            transform: `translate(${dialogAxis.x},${dialogAxis.y}) scale(${dialogAxis.scale})`,
            opacity: dialogAxis.opacity,
          }"
        >
          <slot />
        </div>
      </div>
    </transition>
    <transition v-else :name="`dialog-${model}`">
      <div class="Dialog" :class="[model]" v-if="dialogVisible" ref="dialogRef">
        <slot />
      </div>
    </transition>
  </Teleports>
</template>

<script setup lang="ts">
import { useDialog } from '@/stores/dialog'
/**
 * @description: 弹框组件
 * @param {*} to 传送门落地点
 * @param {center / top / bottom / follow} model 弹框出现位置
 * @param {*} show 弹框显示开关
 * @param {*} confirmMaskClose 是否可点击遮罩关闭
 * @param {*} follow 是否跟随对应点击打开位置
 */
const {
  to = '#app',
  model = 'center',
  modelValue,
  confirmMaskClose = false,
} = defineProps<{
  to?: string
  model?: string
  modelValue: boolean
  confirmMaskClose?: boolean
}>()

const emit = defineEmits(['update:modelValue'])
const { mask, setMaskNumber, position } = $(useDialog())
const dialogAxis = ref({
  x: '0',
  y: '0',
  scale: 0,
  opacity: 1,
})
const dialogRef = ref<HTMLDivElement>()
const dialogVisible = ref(false)
let axis = {
  x: '0',
  y: '0',
  scale: 1,
  opacity: 1,
}
watch(
  () => modelValue,
  newVal => {
    setMaskNumber(
      newVal
        ? mask.maskNumber + 1
        : mask.maskNumber > 0
          ? mask.maskNumber - 1
          : 0
    )
    if (model === 'follow') {
      if (newVal) {
        axis = position
          ? {
              x: position.x,
              y: position.y,
              scale: 0,
              opacity: 0,
            }
          : {
              x: '0',
              y: '0',
              scale: 0,
              opacity: 0,
            }
        dialogAxis.value = axis
        setTimeout(
          () =>
            (dialogAxis.value = {
              x: '0',
              y: '0',
              scale: 1,
              opacity: 1,
            }),
          20
        )
      } else {
        dialogAxis.value = axis
      }
    }
    nextTick(() => (dialogVisible.value = newVal))
  },
  {
    flush: 'post',
  }
)
// watch(dialogRef, () => {})

/**
 * @description: 点击遮罩关闭弹框方法
 * @return {*}
 */
const MaskCloseFn = (): void => {
  if (confirmMaskClose) {
    emit('update:modelValue', false)
  }
}
</script>

<style scoped lang="less">
@fix-index: 3000;

.Dialog {
  position: fixed;
  z-index: 3000;
  width: fit-content;
  height: fit-content;
  &.center,
  &.follow {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    .flex-center;
  }
  &.bottom {
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    .set-flexColumn(flex-end);
  }
  &.top {
    left: 0;
    right: 0;
    top: 0;
    margin: auto;
    .set-flexColumn(flex-start);
  }
  .dialog-content {
    transition:
      transform 0.45s,
      opacity 0.45s;
  }
}

.Mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3000;
  background-color: rgba(0, 0, 0, 0.7);
}

.mask-fade-enter-active,
.mask-fade-leave-active {
  transition: background-color 0.6s;
}

.mask-fade-enter-from,
.mask-fade-leave-to {
  background-color: rgba(0, 0, 0, 0);
}

.dialog-center-enter-from,
.dialog-center-leave-to {
  transform: scale(0);
  opacity: 0;
}
.dialog-bottom-enter-from,
.dialog-bottom-leave-to {
  transform: translateY(100.5%);
  opacity: 0;
}
.dialog-top-enter-from,
.dialog-top-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.dialog-top-enter-active,
.dialog-top-leave-active,
.dialog-bottom-enter-active,
.dialog-bottom-leave-active,
.dialog-center-enter-active,
.dialog-center-leave-active {
  transition: all 0.45s;
}

.dialog-follow-enter-active,
.dialog-follow-leave-active {
  animation: dialog-follow 0.45s 1 both;
  @keyframes dialog-follow {
    0%,
    100% {
      opacity: 1;
    }
  }
}
</style>
