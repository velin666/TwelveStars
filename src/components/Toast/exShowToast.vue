<template>
  <transition name="toast-fadeIn">
    <div class="showToast-container" v-show="show">
      <p>{{ toastText }}</p>
    </div>
  </transition>
</template>

<script lang="ts">
export default {
  name: 'showToast',
  props: ['toastText'],
  data() {
    return {
      show: false,
    }
  },
}
</script>

<style lang="less" scoped>
.toast-fadeIn-enter-active,
.toast-fadeIn-leave-active {
  transition: all 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);
}
.toast-fadeIn-enter-from,
.toast-fadeIn-leave-to {
  opacity: 0;
}

.showToast-container {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 9999;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 0.1rem;
  border-radius: 0.06rem;
  white-space: nowrap;
  p {
    color: #fff;
    font-size: 0.14rem;
  }
}
</style>
