<template>
  <el-scrollbar ref="myScrollbar" :style="`height:${mainH}px`">
    <div class="content-main">
      <h2 class="title">选择项目</h2>
      <el-row :gutter="12">
        <el-col :span="6">
          <el-card shadow="hover">
            <div @click="showPop" class="box box-add" style="text-align:center;">
              <el-button type="primary" class="back" icon="el-icon-plus" circle></el-button>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6" v-for="item in projectList" :key="item.gitName">
          <el-tooltip class="item" effect="dark" :content="item.gitName" placement="top">
            <el-card shadow="hover">
              <div
                class="box"
                @click="onGoDirectory(item.path,item.gitName)"
                v-contextmenu:contextmenu
                @contextmenu.prevent="rightClick(item)"
              >
                <h3>{{item.gitName}}</h3>
                <p>当前分支：{{item.branchAction}}</p>
              </div>
            </el-card>
          </el-tooltip>
        </el-col>
      </el-row>
      <div>
        此版本需要安装git，请先确认是否已安装git，<a @click="goDow" href="javascript:void(0)">去下载</a><br>
      </div>
    </div>
    <v-contextmenu ref="contextmenu">
      <v-contextmenu-item :disabled="true">
        <i class="el-icon-edit"></i> 修改
      </v-contextmenu-item>
      <v-contextmenu-item @click="showBranch">
        <i class="el-icon-refresh"></i> 切换分支
      </v-contextmenu-item>
      <v-contextmenu-item @click="deleteProject">
        <i class="el-icon-delete"></i> 删除
      </v-contextmenu-item>
    </v-contextmenu>
    <el-dialog
      title="新增项目"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-form label-width="120px" ref="dataForm" :model="formData">
        <el-form-item
          label="git地址"
          prop="gitUrl"
          :rules="[{
                    trigger: 'blur',
                    required: true,
                    message: '不能为空'
                  }]"
        >
          <el-input
            v-model="formData.gitUrl"
            placeholder="如：http://gitlab.crc.com.cn/crcsoft-crcloud"
            :disabled="loading"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="git名称"
          prop="gitName"
          :rules="[{
                    trigger: 'blur',
                    required: true,
                    message: '不能为空'
                  }]"
        >
          <el-input v-model="formData.gitName" :disabled="loading" placeholder="如：crcsoft-crcloud"></el-input>
        </el-form-item>
        <el-form-item
          label="git账号"
          prop="user"
          :rules="[{
                    trigger: 'blur',
                    required: true,
                    message: '不能为空'
                  }]"
        >
          <el-input v-model="formData.user" :disabled="loading" placeholder="请输入git账号"></el-input>
        </el-form-item>
        <el-form-item
          label="git密码"
          prop="pass"
          :rules="[{
                    trigger: 'blur',
                    required: true,
                    message: '不能为空'
                  }]"
        >
          <el-input
            v-model="formData.pass"
            show-password
            :disabled="loading"
            placeholder="请输入git密码"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="clone到本地"
          prop="path"
          :rules="[{
                    trigger: 'blur',
                    required: true,
                    message: '不能为空'
                  }]"
        >
          <el-input v-model="formData.path" placeholder="如：ydyykfpt" :disabled="loading">
            <el-button slot="append" :disabled="loading" type="primary" @click="selectFolder">选择文件夹</el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closePop()" :disabled="loading">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="onAddProject">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="切换分支"
      :visible.sync="dialogBranchVisible"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-form label-width="120px" ref="branchForm" :model="branchData">
        <el-form-item
          label="git分支"
          prop="branch"
          :rules="[{
                    trigger: 'blur',
                    required: true,
                    message: '不能为空'
                  }]"
        >
          <el-select v-model="branchData.branch" :disabled="loading" placeholder="请选择分支版本">
            <el-option
              :label="item.name"
              :value="item.name"
              v-for="(item,index) in  actionItem.branchList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeBranch" :disabled="loading">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="cutBranch">切 换</el-button>
      </div>
    </el-dialog>
  </el-scrollbar>
</template>

<script>
import draggable from "vuedraggable";
export default {
  name: "",
  data() {
    return {
      projectList: JSON.parse(window.localStorage.getItem("projectList")) || [],
      dialogFormVisible: false,
      formData: {
        // gitUrl:
        //   "http://gitlab.crc.com.cn/crcsoft-crcloud-portal/crcloud-doc-web.git",
        // gitName: "crcloud-doc-web",
        // path: "D:/test_code/ssss/aaa",
        // user: "symbio-38",
        // pass: "Liang1q2w3e4r2"
        gitUrl: "",
        gitName: "",
        path: "",
        user: "",
        pass: ""
      },
      mainH: 800,
      loading: false,
      actionItem: {}, //右键选中的item
      branchData: {
        branch: ""
      },
      dialogBranchVisible: false
    };
  },
  components: {
    draggable
  },
  created() {
    this.mainH = document.documentElement.clientHeight - 40;
    this.init();
  },
  methods: {
    init() {
      this.projectList =
        JSON.parse(window.localStorage.getItem("projectList")) || [];
    },
    showPop() {
      this.dialogFormVisible = true;
    },
    closePop() {
      this.dialogFormVisible = false;
    },
    // 选择文件夹
    selectFolder() {
      this.$api.get_folder().then(res => {
        if (res.code === 200) {
          if (!res.data.canceled) {
            this.formData.path = res.data.filePaths[0].replace(/\\/g, "/");
          }
        }
      });
    },
    // 添加项目
    onAddProject() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          this.$api
            .git_clone(this.formData)
            .then(res => {
              console.log("sss");
              this.loading = false;
              if (res.code == 200) {
                this.closePop();
                const temp = { ...this.formData, ...res.data };
                this.projectList.push(temp);
                window.localStorage.setItem(
                  "projectList",
                  JSON.stringify(this.projectList)
                );
              }
            })
            .catch(err => {
              this.loading = false;
            });
        }
      });
    },
    rightClick(param) {
      this.actionItem = param;
      this.branchData.branch = param.branchAction;
    },
    showBranch() {
      this.dialogBranchVisible = true;
      // this.$api.get_git_branch(this.formData).then(res => {
      //   console.log(res);
      // });
    },
    closeBranch() {
      this.dialogBranchVisible = false;
    },
    // 切换分支
    cutBranch() {
      this.$refs["branchForm"].validate(valid => {
        if (valid) {
          const branchType = this.actionItem.branchList.filter(item => {
            console.log(item);
            return item.name == this.branchData.branch;
          })[0].type;
          this.loading = true;
          this.$api
            .switch_git_branch({
              gitName: this.actionItem.gitName,
              path: this.actionItem.path,
              branch: this.branchData.branch,
              branchType
            })
            .then(res => {
              console.log(res);
              if (res.code == 200) {
                this.closeBranch();
                this.updateList(res.data.branchAction, res.data.branchList);
              }
              this.loading = false;
            });
        }
      });
    },
    // 更新数组
    updateList(branchAction, branchList) {
      let tempList = JSON.parse(JSON.stringify(this.projectList));
      tempList = tempList.map(item => {
        if (item.gitName == this.actionItem.gitName) {
          item.branchAction = branchAction;
          item.branchList = branchList;
        }
        return item;
      });
      this.projectList = tempList;
      window.localStorage.setItem(
        "projectList",
        JSON.stringify(this.projectList)
      );
    },
    deleteProject() {
      this.$confirm(`是否确认删除 ${this.actionItem.gitName} ?`, "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const delLoading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          this.$api
            .del_project({
              projectPath: `${this.actionItem.path}/${this.actionItem.gitName}`
            })
            .then(res => {
              if (res.code === 200) {
                let index = 0;
                this.projectList.forEach((item, i) => {
                  if (item.gitName === this.actionItem.gitName) {
                    index = i;
                  }
                });
                this.projectList.splice(index, 1);
                window.localStorage.setItem(
                  "projectList",
                  JSON.stringify(this.projectList)
                );
              }
              delLoading.close();
            });
        })
        .catch(() => {});
    },
    onGoDirectory(path, gitName) {
      this.$router.push(`/directory?projectPath=${path}/${gitName}`);
    },
    // 去下载
    goDow(){
      window.electron.shell.openExternal('https://git-scm.com/');
    }
  }
};
</script>

<style lang='scss' scoped>
.content-main {
  padding: 20px;
}
.title {
  margin-bottom: 20px;
}
.el-col {
  margin-bottom: 20px;
  cursor: pointer;
}
.box {
  padding: 20px;
  height: 60px;
  font-size: 14px;
  h3 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  p {
    margin-top: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.box-add {
  line-height: 60px;
}
</style>
<style lang="scss">
.el-card__body {
  padding: 0;
}

.el-scrollbar__wrap {
  overflow-x: hidden;
  overflow-y: auto;
}
</style>