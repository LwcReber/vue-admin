<template>
  <div class="main">
    <h1>欢迎进入{{ title }}</h1>
  </div>
</template>

<script>
import defaultSettings from '@/settings'

export default {
  data () {
    return {
      title: defaultSettings.title
    }
  }
}
</script>

<style lang="scss" scoped>
  .main {
    position: absolute;
    top: 84px;
    left: 0;
    right: 0;
    bottom: 0;
    // min-height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px
  }
</style>
