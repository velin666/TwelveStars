<template>
  <div class="main-router" key="router">
    <router-view v-slot="{ Component }">
      <transition name="router-show" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { useDialog } from '@/stores/dialog'

const { setPosition } = useDialog()
onMounted(() => {
  document.documentElement?.addEventListener('click', setPosition, true)
})
onUnmounted(() => {
  document.documentElement?.removeEventListener('click', setPosition, true)
})
</script>

<style lang="less">
.main-router {
  position: relative;
  z-index: 1;
}

.router-show-enter-active,
.router-show-leave-active {
  transition: all 0.2s ease;
}

.router-show-enter-from,
.router-show-leave-to {
  opacity: 0;
}
</style>
