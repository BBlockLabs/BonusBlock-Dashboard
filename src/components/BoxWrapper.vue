<template>
  <div
    class="br-base p-3"
    :class="{
      'bg-fill-lighter': type === 'lighter',
      'bg-fill-darker': type === 'darker',
    }"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "lighter",
    },
  },
};
</script>
