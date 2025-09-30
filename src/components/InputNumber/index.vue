<template>
  <div class="inputNum-container">
    <div
      class="btn reduce-btn"
      :class="{ deactive: modelValue <= 1 }"
      @click.stop="clickChangeCount('reduce')"
    >
      <slot name="reduce"></slot>
    </div>
    <slot name="mid" />
    <input
      type="tel"
      class="input-num"
      oninput="value=value.replace(/\D+/g,'')"
      :value="modelValue"
      @blur="iosDeal"
      @input="inputValueFun"
      @focus="emit('isBlur', false)"
      placeholder="请输入数量"
    />
    <div
      class="btn add-btn"
      :class="{ deactive: modelValue >= maxNumber }"
      @click.stop="clickChangeCount('add')"
    >
      <slot name="add"></slot>
    </div>
    <div
      class="all"
      v-if="showAll"
      @click="emit('update:modelValue', Number(maxNumber))"
    >
      <slot name="all"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
const {
  modelValue,
  showAll,
  maxNumber = 99999,
  minNumber = 1,
  stepNum,
} = defineProps<{
  modelValue: number
  showAll?: boolean
  maxNumber?: number
  minNumber?: number
  stepNum?: number
}>()
const emit = defineEmits(['update:modelValue', 'isBlur'])

// 输入框手动输入变化
const inputValueFun = ($event: any) => {
  if (Number($event.target.value) > maxNumber) $event.target.value = maxNumber
  emit('update:modelValue', Number($event.target.value))
}

// 点击按钮加减
const clickChangeCount = (type: 'reduce' | 'add') => {
  // 最大值
  const max = maxNumber
  // 单次加减数量
  const step = stepNum || 1
  //
  let currentValue = modelValue

  if (type === 'add') {
    currentValue += step
    if (currentValue >= max) {
      currentValue = max
    }
  } else {
    currentValue -= step
    if (currentValue <= minNumber) {
      currentValue = step
    }
  }
  emit('update:modelValue', Number(currentValue))
}

// ios弹窗按键错位
const iosDeal = () => {
  emit('isBlur', true)
  if (Number(modelValue) < minNumber)
    emit('update:modelValue', Number(minNumber))
  setTimeout(() => {
    const scrollHeight =
      document.documentElement.scrollTop || document.body.scrollTop || 0
    window.scrollTo(0, Math.max(scrollHeight - 1, 0))
  }, 100)
}
</script>

<style lang="less" scoped>
button {
  outline: none;
  border: none;
}

.inputNum-container {
  position: relative;
  .flex-center;
  .input-num {
    font-size: 0.12rem;
    font-weight: 400;
    color: #fff;
    text-align: center;
  }
  .reduce-btn,
  .add-btn,
  .all {
    position: relative;
    // transition: filter 0.3s;
    transition: opacity 0.3s;
    &.deactive {
      // filter: brightness(0.5);
      opacity: 0.5;
    }
  }
}
</style>
