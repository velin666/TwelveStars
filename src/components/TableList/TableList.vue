<template>
  <div class="Table" ref="tableRef">
    <slot name="header"></slot>
    <div v-if="showTopic" :class="showTopic">
      <div
        class="topic-item"
        v-for="(item, index) in topicInfo"
        :key="'topic' + index"
      >
        <slot name="topicList" :item="item" :index="index"></slot>
      </div>
    </div>
    <div class="table-list" v-infinite-scroll="infiniteScroll ? loading : null">
      <div
        class="table-item"
        v-for="(item, index) in listData.slice(showTopic && page === 1 ? 3 : 0)"
        :key="index + 'table-item'"
      >
        <slot name="tableList" :item="item" :index="index"></slot>
      </div>
    </div>
    <slot name="footer"></slot>
  </div>
  <!-- 用户信息 -->
  <Teleport :to="userPortal || '#app'">
    <transition name="bottom-show">
      <div class="user-fixed" v-show="userShow && userVisible">
        <slot name="user"></slot>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts" generic="T extends Record<string, any> | string">
import type { Ref } from 'vue'

interface IProps<T> {
  /** 列表信息 */
  listData: T[]
  /** 显示前三布局方式 line: 线性排版 tri: 正三角排版 空str代表不展示 */
  showTopic?: 'topic-line' | 'topic-tri' | ''
  /** 当前页码 */
  page?: number
  /** 总页码 */
  totalPage?: number
  /** 底部加载更多 */
  infiniteScroll?: boolean
  /** 前往列表顶部 */
  scrollToTop?: boolean
  /** 是否展示用户信息 */
  userVisible?: boolean
  /** 用户信息传送门 */
  userPortal?: string
}

const {
  listData = [],
  showTopic = '',
  page = 1,
  totalPage = 1,
  infiniteScroll = false,
  scrollToTop = false,
  userVisible = false,
  userPortal,
} = defineProps<IProps<T>>()
const emit = defineEmits(['update:page', 'reloadList'])

/** 底部信息显示 */
const userShow = ref(false)
/** 列表 dom */
const tableRef = ref<HTMLDivElement>()
/** 前三信息 */
// eslint-disable-next-line no-undef
const topicInfo = ref([{}, {}, {}]) as Ref<Partial<T>[]>

/** 前三信息赋值 */
if (showTopic) {
  watch(
    () => listData,
    newVal => {
      if (page === 1) {
        for (let i = 0; i < 3; i++) {
          if (newVal[i]) {
            topicInfo.value[i] = newVal[i]
          }
        }
      }
    }
  )
}

// 监听页脚变化
watch(
  () => page,
  () => scrollToTop && tableRef.value?.scrollIntoView?.()
)

onMounted(() => {
  userShow.value = true
})
onBeforeUnmount(() => {
  userShow.value = false
})

const loading = () => {
  if (page <= totalPage) {
    emit('update:page', page + 1)
    emit('reloadList')
    console.log('infiniteScroll')
  }
}
</script>

<style scoped lang="less">
.Table {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  .topic-line {
    display: flex;
    justify-content: center;
    .topic-item {
      &:nth-child(1) {
        order: 2;
      }
      &:nth-child(2) {
        order: 1;
      }
      &:nth-child(3) {
        order: 3;
      }
    }
  }
  .topic-tri {
    .flex-center;
    flex-wrap: wrap;
    .topic-item {
      &:nth-child(1) {
        width: 100%;
      }
      &:nth-child(2),
      &:nth-child(3) {
        width: 50%;
      }
    }
  }
  .table-list {
    width: 100%;
    .flex-column;
  }
}

.user-fixed {
  position: fixed;
  right: 0;
  margin: auto;
  left: 0;
  bottom: -0.01rem;
  z-index: 10;
}
</style>
