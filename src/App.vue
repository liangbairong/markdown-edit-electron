<template>
  <div id="app">
    <head-nav></head-nav>
    <router-view></router-view>
  </div>
</template>
<script>
import headNav from "@/components/headNav";
export default {
  name: "app",
  components: {
    headNav
  }
};
</script>
<style>
@import "./assets/css/main.css";
@import "./assets/css/color-dark.css"; /*深色主题*/
/*@import "./assets/css/theme-green/color-green.css";   浅绿色主题*/
</style>