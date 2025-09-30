<script lang="ts">
// 传送门

export default defineComponent({
  name: 'Teleport',
  props: {
    to: {
      type: String,
      required: false,
      default: '#app',
    },
    className: {
      type: String,
      reqired: false,
    },
  },
  mounted(): void {
    document.querySelector(this.to)?.appendChild(this.$el)
  },
  unmounted(): void {
    document.querySelector(this.to)?.removeChild(this.$el)
  },
  render() {
    return h(
      'div',
      {
        class: this.className,
      },
      this.$slots.default?.()
    )
  },
})
</script>
