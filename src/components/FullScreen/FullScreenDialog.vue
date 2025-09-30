<template>
  <Model v-model="localVisible">
    <div class="fullscreen-dialog" @click="close">
      <img :src="imageSrc" alt="" />
    </div>
  </Model>
</template>

<script lang="ts">
/**
 * @name FullScreenDialog
 * @description 全屏图片
 */
export default defineComponent({
  name: 'FullScreenDialog',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    imageSrc: {
      type: String,
      required: true,
    },
  },
  emits: ['update:visible'],
  setup(props, { emit }) {
    const localVisible = ref(props.visible)
    watch(
      () => props.visible,
      newVal => {
        localVisible.value = newVal
      }
    )
    const close = () => {
      localVisible.value = false
      emit('update:visible', false)
    }
    return { localVisible, close }
  },
})
</script>

<style scoped>
.fullscreen-dialog {
  position: relative;
  z-index: 2;
  width: 100vw;
  height: 100vh;
  background: #000;
  .pic-gauss {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 100vw;
    height: 100vh;
    filter: blur(0.03rem) brightness(0.5);
  }
  img {
    /* .ab-center; */
    z-index: 1;
    width: 100vw;
    height: 100vh;
    object-fit: contain;
  }
}
</style>
