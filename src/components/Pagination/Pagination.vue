<template>
  <div class="Pagination">
    <div class="btn pre" :class="{ active: canPrevious }" @click="goPrevious()">
      <slot name="prev"></slot>
    </div>
    <p class="page">{{ page }}/{{ totalPage }}</p>
    <div class="btn next" :class="{ active: canNext }" @click="goNext()">
      <slot name="next"></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  page: {
    type: Number,
    required: true,
  },
  totalPage: {
    type: Number,
    required: true,
  },
})
const emit = defineEmits(['update:page', 'reloadList'])

// 上一页
const goPrevious = () => {
  if (props.page === 1) {
    return false
  }
  emit('update:page', props.page - 1)
  emit('reloadList')
}
// 下一页
const goNext = () => {
  if (props.page === props.totalPage) {
    return false
  }
  emit('update:page', props.page + 1)
  emit('reloadList')
}
// 计算属性
const canNext = computed(() => {
  return props.page < props.totalPage
})
const canPrevious = computed(() => {
  return props.page > 1
})
</script>
<style lang="less">
.Pagination {
  .flex-center;
}

.page {
  margin: 0 0.2rem;
}
</style>
