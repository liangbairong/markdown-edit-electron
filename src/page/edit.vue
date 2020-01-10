<template>
  <el-container>
    <el-header height="50px" class="edit_header">
      <!-- <el-button
        type="primary"
        size="small"
        class="back"
        @click="back"
        icon="el-icon-arrow-left"
        circle
      ></el-button>-->
      {{formData.bookLaebl}}
      <span v-if="action.fileLabel">- {{action.fileLabel}}</span>
      <i class="el-icon-s-opportunity edie-i" v-if="action.oldValue != formData.value"></i>
    </el-header>
    <el-row>
      <el-col :span="4">
        <el-scrollbar :style="`height:${mainH}px`" ref="myScrollbar">
          <div class="silde_box">
            <h3>
              目录
              <i class="el-icon-circle-plus" @click="oneShowAddMd"></i>
            </h3>
            <el-tree
              :data="fileList"
              node-key="aubPath"
              default-expand-all
              @node-click="dirClick"
              @node-contextmenu="rightClick"
              @node-drop="dropSucc"
              draggable
              :expand-on-click-node="false"
            ></el-tree>
          </div>
        </el-scrollbar>
      </el-col>
      <el-col :span="20">
        <el-scrollbar ref="myScrollbar" :style="`height:${mainH}px`" v-if="action.filePath">
          <mavon-editor
            class="md-edit"
            ref="md"
            v-model="formData.value"
            @save="onSave"
            @imgAdd="imgAdd"
          />
        </el-scrollbar>
      </el-col>
    </el-row>

    <div id="perTreeMenu" v-if="tmDisplay" class="tree_menu" :style="{...rightMenu}">
      <ul>
        <li @click="showAddMd">
          <i class="el-icon-tickets"></i> 新增
        </li>
        <li @click="del">
          <i class="el-icon-edit"></i> 删除
        </li>
      </ul>
    </div>

    <el-dialog title="新增章节" :visible.sync="dialogFormVisible">
      <el-form label-width="120px" ref="dataForm" :model="formData">
        <el-form-item
          label="章节名称"
          prop="fileLabel"
          :rules="[{
                    trigger: 'blur',
                    required: true,
                    message: '不能为空'
                  }]"
        >
          <el-input v-model="formData.fileLabel" placeholder="如：移动应用开发平台"></el-input>
        </el-form-item>
        <el-form-item
          label="md文件名称"
          prop="filePath"
          :rules="[
                    {trigger: 'blur', required: true, validator: validateFilePath},
                  ]"
        >
          <el-input v-model="formData.filePath" style="width:80%" placeholder="如：sjs 或 doc/sjs"></el-input>
          <el-input value=".md" :disabled="true" style="width:20%"></el-input>
        </el-form-item>
        <el-form-item label="父级路径">
          <el-input v-model="formData.parentPath" :disabled="true" placeholder="如：/"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onAddFile">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import gitMix from "@/mixins/git";
export default {
  data: function() {
    return {
      fileList: [],
      fileListDom: "",
      formData: {
        aubBookPath: "",
        bookLaebl: "",
        value: "",
        fileLabel: "",
        filePath: "",
        parentPath: "", //父级路径
        parenData: {}, //父级对象
        node: {}
      },
      mainH: 700,
      tmDisplay: false,
      rightMenu: {},
      dialogFormVisible: false,
      // 正在编辑的章节对象
      action: {
        fileLabel: "",
        filePath: "",
        oldValue: ""
      },
      imageIndex: 1
    };
  },
  mixins: [gitMix],
  created() {
    this.init();
    this.mainH = document.documentElement.clientHeight - 50 - 40;
  },
  mounted() {
    //  window.addEventListener('resize',()=>{
    //    this.mainH = document.documentElement.clientHeight-50;
    // })
  },
  watch: {
    "formData.fileLabel": {
      handler(val) {
        this.formData.filePath = this.$pinyin.getFullChars(val).toLowerCase();
      },
      deep: true,
      immediate: false
    }
  },
  methods: {
    init() {
      this.formData.aubBookPath = this.$route.query.aubBookPath;
      this.formData.bookLaebl = this.$route.query.bookLaebl;
      this.getDirectory();
      console.log(this.$route.query.aubBookPath);
      // this.getGitChangeList({ projectPath: this.projectPath});
    },
    getDirectory() {
      this.$api
        .get_directory({
          bookPath: this.formData.aubBookPath
        })
        .then(res => {
          this.fileList = res.data;
          this.getGitChangeList({ projectPath: this.projectPath });
        });
    },
    oneShowAddMd() {
      this.formData.parentPath = "";
      this.formData.parenData = {};
      this.formData.value = "";
      this.action.oldValue = "";
      this.showAddMd();
    },
    showAddMd() {
      this.formData.fileLabel = "";
      this.formData.filePath = "";
      this.dialogFormVisible = true;
    },
    // 拖拽修改顺序
    dropSucc() {
      console.log("拖拽");
      this.fileListDom = "";
      this.tranHtml(this.fileList);
      this.$api
        .update_rank({
          docPath: this.formData.aubBookPath,
          fileListDom: this.fileListDom
        })
        .then(res => {
          this.getDirectory();
        });
    },
    isFilePathCf(list) {
      for (var i = 0, len = list.length; i < len; i++) {
        if (list[i].filePath == this.formData.filePath + ".md") {
          return true;
          break;
        } else {
          if (list[i].children.length > 0) {
            this.isFilePathCf(list[i].children);
          }
        }
      }
      return false;
    },
    isFilePathREADME(list) {
      for (var i = 0, len = list.length; i < len; i++) {
        if (list[i].filePath == "README.md") {
          return true;
          break;
        } else {
          if (list[i].children.length > 0) {
            this.isFilePathCf(list[i].children);
          }
        }
      }
      return false;
    },
    validateFilePath(rule, value, callback) {
      if (!value) {
        callback("不能为空");
      } else {
        if (this.isFilePathCf(this.fileList)) {
          callback("文件夹名称已重复");
        } else {
          callback();
        }
      }
    },
    // 新增文件
    onAddFile() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.appendSilde(this.formData.parenData);
          this.fileListDom = "";
          this.tranHtml(this.fileList);
          this.$api
            .add_file({
              fileLabel: this.formData.fileLabel,
              filePath: this.formData.filePath + ".md",
              parentPath: this.formData.parentPath,
              docPath: this.formData.aubBookPath,
              fileListDom: this.fileListDom
            })
            .then(res => {
              this.dialogFormVisible = false;
              this.getDirectory();
              this.getGitChangeList({ projectPath: this.projectPath });
            });
        }
      });
    },
    // tree插入新章节
    appendSilde(data) {
      // TODO:README bug
      // if (this.fileList.length === 0) {
      //   this.formData.filePath = "README";
      // }
      if (!this.isFilePathREADME(this.fileList)) {
        this.formData.filePath = "README";
      }

      const newChild = {
        filePath: this.formData.filePath + ".md",
        label: this.formData.fileLabel,
        children: []
      };
      if (!data.label) {
        this.fileList.push(newChild);
      } else {
        if (!data.children) {
          this.$set(data, "children", []);
        }
        data.children.push(newChild);
      }
    },
    // 获取内容
    dirClick(param) {
      // 没有修改内容，可以切换
      if (this.action.oldValue === this.formData.value) {
        this.action.filePath = param.filePath;
        this.action.fileLabel = param.label;

        console.log(param);
        this.$api.get_book_content({ contentPath: param.aubPath }).then(res => {
          console.log(res);
          this.formData.value = res.data;
          // this.imageIndex = 1;
          if (this.formData.value.indexOf("../../../assets/image") != -1) {
            // 包含
            this.imageIndex = 4;
            this.formData.value = res.data.replace(
              RegExp("../../../assets/image", "g"),
              this.formData.aubBookPath + "/assets/image"
            );
          } else if (this.formData.value.indexOf("../../assets/image") != -1) {
            this.imageIndex = 3;
            this.formData.value = res.data.replace(
              RegExp("../../assets/image", "g"),
              this.formData.aubBookPath + "/assets/image"
            );
          } else if (this.formData.value.indexOf("../assets/image") != -1) {
            this.imageIndex = 2;
            this.formData.value = res.data.replace(
              RegExp("../assets/image", "g"),
              this.formData.aubBookPath + "/assets/image"
            );
          } else {
            this.imageIndex = 1;
            this.formData.value = res.data.replace(
              RegExp("./assets/image", "g"),
              this.formData.aubBookPath + "/assets/image"
            );
          }
          console.log(this.imageIndex);

          this.action.oldValue = this.formData.value;

          this.getGitChangeList({ projectPath: this.projectPath });
        });
      } else {
        this.$confirm("文件有修改，还没保存，是否进行保存？", "提示", {
          confirmButtonText: "保存",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.onSave();
          })
          .catch(() => {});
      }
    },
    rightClick(e, data, node, comp) {
      this.formData.parentPath = data.filePath;
      this.formData.parenData = data;
      this.formData.node = node;
      console.log("e:", e, "data", data);
      this.rightMenu = { top: e.pageY + "px", left: e.pageX + "px" };
      this.tmDisplay = true;
      const self = this;
      document.onclick = function(ev) {
        console.log(ev.target + "1111111111111111111");

        if (ev.target !== document.getElementById("perTreeMenu")) {
          self.tmDisplay = false;
        }
      };
    },
    del() {
      this.$confirm(`是否确认删除 ${this.formData.parenData.label} ?`, "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          console.log("dd");
          // this.onSave();
          this.delSilde(this.formData.node, this.formData.parenData);
          this.delFile();
        })
        .catch(() => {});
    },
    // 删除dom节点菜单
    delSilde(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
    delFile() {
      this.fileListDom = "";
      this.tranHtml(this.fileList);
      this.$api
        .del_file({
          filePath: this.formData.parenData.filePath,
          docPath: this.formData.aubBookPath,
          fileListDom: this.fileListDom
        })
        .then(res => {
          if (res.code === 200) {
            this.$message({
              message: "删除成功",
              type: "success",
              duration: 500
            });
            this.getGitChangeList({ projectPath: this.projectPath });
          }
        });
    },
    // back() {
    //   this.$router.go(-1);
    // },

    imgAdd(pos, $file) {
      this.$api
        .upload_image({
          docPath: this.formData.aubBookPath,
          image: $file.miniurl,
          imageType: $file.name.split(".")[1],
          filePath: this.action.filePath
        })
        .then(res => {
          if (res.code === 200) {
            console.log(res.data);
            // this.imageIndex=res.data.level
            this.$refs.md.$img2Url(
              pos,
              this.formData.aubBookPath + res.data.data
            );
            this.getGitChangeList({ projectPath: this.projectPath });
          }
        });
    },
    tranHtml(list) {
      this.fileListDom += `<ul>`;
      list.forEach(item => {
        this.fileListDom += `<li><a href="${item.filePath}">${item.label}</a>`;
        if (item.children.length > 0) {
          this.tranHtml(item.children);
        }
        this.fileListDom += `</li>`;
      });
      this.fileListDom += `</ul>`;
    },
    // 修改
    onSave() {
      console.log("保存");
      if (!this.action.fileLabel && !this.action.filePath) {
        return;
      }

      let content = this.formData.value;

      const level = this.action.filePath.split("/");
      console.log(level);
      switch (level.length) {
        case 1:
          content = this.formData.value.replace(
            RegExp(this.formData.aubBookPath + "/assets/image", "g"),
            "./assets/image"
          );
          break;
        case 2:
          content = this.formData.value.replace(
            RegExp(this.formData.aubBookPath + "/assets/image", "g"),
            "../assets/image"
          );
          break;
        case 3:
          content = this.formData.value.replace(
            RegExp(this.formData.aubBookPath + "/assets/image", "g"),
            "../../assets/image"
          );
          break;
        case 4:
          content = this.formData.value.replace(
            RegExp(this.formData.aubBookPath + "/assets/image", "g"),
            "../../../assets/image"
          );
          break;
      }

      console.log(this.formData.aubBookPath);
      this.$api
        .update_file({
          fileLabel: this.action.fileLabel,
          filePath: this.action.filePath,
          content,
          docPath: this.formData.aubBookPath
        })
        .then(res => {
          if (res.code == 200) {
            this.$message({
              message: "保存成功",
              type: "success",
              duration: 500
            });
            this.action.oldValue = this.formData.value;

            console.log(this.action.oldValue);
            console.log(this.formData.value);
            this.getGitChangeList({ projectPath: this.projectPath });
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.back {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
}
.edit_header {
  text-align: center;
  line-height: 50px;
  position: relative;
}
.silde_box {
  padding: 20px;
  user-select: none;
  h3 {
    margin-bottom: 20px;
    position: relative;
    i {
      cursor: pointer;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}

.tree_menu {
  position: fixed;
  display: block;
  z-index: 20000;
  background-color: #fff;
  padding: 5px 0;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  ul {
    margin: 0;
    padding: 0;
  }
  ul li {
    list-style: none;
    margin: 0;
    padding: 0 15px;
    font-size: 14px;
    line-height: 30px;
    cursor: pointer;
  }
  ul li:hover {
    background-color: #ebeef5;
  }
}
.edie-i {
  margin-left: 10px;
  color: red;
}
</style>
<style >
.v-note-op {
  position: sticky;
  top: 0;
}
.el-scrollbar__wrap {
  overflow-x: hidden;
}
.dropdown-images {
  display: none;
}
</style>