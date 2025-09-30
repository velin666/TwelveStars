<template>
  <div class="Transfer">
    <!-- 礼物展示 -->
    <GiftShow />
    <!-- 演变区 -->
    <Lottery />
    <!-- 每日任务区 -->
    <Mission />
  </div>
</template>

<script setup lang="ts">
import GiftShow from './GiftShow/index.vue'
import Lottery from './Lottery/index.vue'
import Mission from './Mission/index.vue'
</script>

<style scoped lang="less">
.Transfer {
  position: relative;
  .flex-column;
}
</style>
