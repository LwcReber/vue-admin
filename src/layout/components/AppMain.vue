<template>
  <section class="app-main">
    <transition
      name="fade-transform"
      mode="out-in"
    >
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews () {
      return this.$store.state.tagsView.cachedViews
    },
    key () {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
$navTagHeight: ($navbarHeight + $tagviewHeight);
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - #{$navTagHeight});
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 10px;
  padding-left: 15px;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - #{$navTagHeight});
  }

  .fixed-header+.app-main {
    padding-top: $navTagHeight  + 16px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
// .el-popup-parent--hidden {
//   .fixed-header {
//     padding-right: 15px;
//   }
// }
</style>
