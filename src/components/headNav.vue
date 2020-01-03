<template>
  <div class="header">
    <div class="but close" @click="close">
      <i class="el-icon-close"></i>
    </div>
    <div class="but max" @click="max">
      <i class="el-icon-full-screen"></i>
    </div>
    <div class="but min" @click="min">
      <i class="el-icon-minus"></i>
    </div>
    <div class="title">
        markdown编辑器
    </div>
   
  </div>
</template>

<script>
export default {
  name: "",
  data() {},
  methods: {
    close() {
      this.$api.close();
    },
    max() {
      this.$api.max();
    },
    min() {
      this.$api.min();
    }
  }
};
</script>
<style lang="scss" scoped>
.header {
  width: 100%;
  padding: 10px;
  -webkit-app-region: drag;
  -webkit-user-select: none;
  background: none;
  position: relative;
  .title{
    text-align: center;
  }
  .but {
    color: #fff;
    background: red;
    width: 20px;
    height: 20px;
    border-radius: 20px;
    position: relative;
    text-align: center;
    opacity: 0.6;
    cursor: pointer;
    display: inline-block;
    margin-right: 10px;
    -webkit-app-region: no-drag;
    position: absolute;
    i {
      font-size: 12px;
      opacity: 0;
      transition: all 0.2s;
    }
  }
  .but:hover {
    opacity: 1;
    i{
      opacity: 1;
    }
  }
  .close{
    left: 10px;
    background: #fe4f4d;
  }
  .max {
    background: #edb925;
    left: 40px;
  }
  .min{
    left: 70px;
    background: #46c02f;
  }
}
</style>