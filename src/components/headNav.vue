<template>
  <div>
    <div class="header">
      <div class="back" @click="back" v-if="isShowBack">
        <i class="el-icon-back"></i>
      </div>
      <div class="back synchronization" @click="synchronization" v-if="isShowBack">
        <i :class="`${syncLoading?'el-icon-loading':'el-icon-download'}`"></i>
        同步
      </div>
      <div
        class="back upload"
        @click="showUpload"
        v-if="isShowBack && gitChangeList && gitChangeList.length>0"
      >
        <i :class="`${uploadLoading?'el-icon-loading':'el-icon-upload2'}`"></i>
        上传
        <span v-if="gitChangeList.length>0">({{gitChangeList.length}})</span>

        <el-scrollbar class="upload-list">
          <li v-for="(item,index) in gitChangeList" :key="index" :title="item.value">
            <i class="el-icon-error" v-if="item.type=='del'"></i>
            <i class="el-icon-circle-plus" v-if="item.type=='new'"></i>
            <i class="el-icon-info" v-if="item.type=='update'"></i>
            {{item.value}}
          </li>
        </el-scrollbar>
      </div>

      <div class="but close" @click="close">
        <i class="el-icon-close"></i>
      </div>
      <div class="but max" @click="max">
        <i class="el-icon-rank"></i>
      </div>
      <div class="but min" @click="min">
        <i class="el-icon-minus"></i>
      </div>
      <div class="title">markdown编辑器</div>
    </div>
    <el-dialog
      title="提交"
      :visible.sync="dialogGitVisible"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-form label-width="120px" ref="gitForm" :model="gitData">
        <el-form-item
          label="提交说明"
          prop="content"
          :rules="[{
                    trigger: 'blur',
                    required: true,
                    message: '不能为空'
                  }]"
        >
          <el-input
            type="textarea"
            :disabled="uploadLoading"
            :rows="3"
            placeholder="请输入内容"
            v-model="gitData.content"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeUpload" :disabled="uploadLoading">取 消</el-button>
        <el-button type="primary" :loading="uploadLoading" @click="upload">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import gitMix from "@/mixins/git";
export default {
  name: "headNav",
  data() {
    return {
      isShowBack: false,
      syncLoading: false,
      uploadLoading: false,
      gitData: {
        content: ""
      },
      dialogGitVisible: false
    };
  },
  mixins: [gitMix],
  watch: {
    $route: {
      handler(to) {
        if (to.name == "index") {
          this.isShowBack = false;
        } else {
          this.isShowBack = true;
        }
        if (to.name == "directory" && this.gitChangeList.length === 0) {
          this.synchronization();
        }
      },
      deep: true,
      immediate: false
    }
  },
  methods: {
    close() {
      this.$api.close();
    },
    max() {
      this.$api.max();
    },
    min() {
      this.$api.min();
    },
    back() {
      this.$router.go(-1);
    },
    synchronization() {
      if (this.gitLoading) return;
      this.syncLoading = true;
      this.setGitLoading(true);
      this.$api.git_pull({ projectPath: this.projectPath }).then(res => {
        console.log(res);
        this.syncLoading = false;
        this.setGitLoading(false);
      });
    },
    showUpload() {
      this.dialogGitVisible = true;
      this.gitData.content=''
    },
    closeUpload() {
      this.dialogGitVisible = false;
    },
    upload() {
      if (this.gitLoading) return;
      this.$refs["gitForm"].validate(valid => {
        if (valid) {
          // this.$api.git_diff({ projectPath: this.projectPath,}).then(res=>{
          //   console.log(res)
          // })

          this.uploadLoading = true;
          this.setGitLoading(true);
          this.$api
            .git_push({
              projectPath: this.projectPath,
              content: this.gitData.content
            })
            .then(res => {
              console.log(res);
              if (res.code == 200) {
                this.closeUpload();
                this.getGitChangeList({ projectPath: this.projectPath });
              }
              this.uploadLoading = false;
              this.setGitLoading(false);
            });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.header {
  width: 100%;
  -webkit-app-region: drag;
  -webkit-user-select: none;
  position: relative;
  background: #fff;
  height: 40px;
  line-height: 40px;
  .back {
    top: 0;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    left: 0;
    position: absolute;
    cursor: pointer;
    background: #409eff;
    -webkit-app-region: no-drag;
    color: #fff;
    font-size: 12px;
    i {
      font-size: 12px;
      transition: all 0.2s;
      color: #fff;
      opacity: 0.6;
    }
    &:hover i {
      opacity: 1;
    }
  }
  .synchronization {
    left: 40px;
    background: #edb925;
    width: 100px;
  }
  .upload {
    left: 140px;
    background: #46c02f;
    width: 100px;
    z-index: 2000;
    .upload-list {
      position: absolute;
      left: 100px;
      width: 200px;
      top: 0;
      background: #ececec;
      text-align: left;
      display: none;
      height: 200px;
      // overflow: auto;
      -webkit-app-region: no-drag;
      li {
        border-bottom: 1px solid #ccc;
        list-style: none;
        padding: 0 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        background: #fe4f4d;
      }
      li:last-child {
        border-bottom: none;
      }
    }
  }
  .upload:hover .upload-list {
    display: block;
  }
  .title {
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
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-app-region: no-drag;
    position: absolute;
    top: 10px;
    i {
      font-size: 12px;
      opacity: 0;
      transition: all 0.2s;
    }
  }
  .but:hover {
    opacity: 1;
    i {
      opacity: 1;
    }
  }
  .close {
    right: 10px;
    background: #fe4f4d;
  }
  .max {
    background: #edb925;
    right: 40px;
  }
  .min {
    right: 70px;
    background: #46c02f;
  }
}
</style>