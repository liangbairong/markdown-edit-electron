<template>
  <el-scrollbar ref="myScrollbar" :style="`height:${mainH}px`">
    <div class="content-main">
      <el-form class="demo-form-inline" ref="searchForm" :model="formData">
        <el-form-item
          label="项目本地文件夹路径"
          prop="docPath"
          :rules="[{
                    trigger: 'blur',
                    required: true,
                    message: '不能为空'
                  }]"
        >
          <el-input v-model="formData.docPath" :disabled="true" placeholder="请输入本地文件夹路径">
            <el-button slot="append" class="select-fold" type="primary" @click="selectFolder">选择文件夹</el-button>
            <el-button slot="append" type="primary" @click="onQuery">搜索</el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <h2 class="title">书籍列表</h2>
      <el-row :gutter="12">
        <el-col :span="4">
          <el-card shadow="hover">
            <div @click="showPop" class="box box-add" style="text-align:center;">
              <el-button type="primary" class="back" icon="el-icon-plus" circle></el-button>
            </div>
          </el-card>
        </el-col>
        <draggable v-model="booksList" @end="end">
          <el-col :span="4" v-for="item in booksList" :key="item.value">
            <el-tooltip class="item" effect="dark" :content="item.label" placement="top">
              <el-card shadow="hover">
                <div
                  class="box"
                  @click="onGoEdit(item.value,item.label)"
                  v-contextmenu:contextmenu
                  @contextmenu.prevent="rightClick(item)"
                >
                  <h3>{{item.label}}</h3>
                  <p>{{item.href}}</p>
                </div>
              </el-card>
            </el-tooltip>
          </el-col>
        </draggable>
      </el-row>
      <v-contextmenu ref="contextmenu">
        <v-contextmenu-item :disabled="true">
          <i class="el-icon-edit"></i> 修改
        </v-contextmenu-item>
        <v-contextmenu-item @click="deleteBook">
          <i class="el-icon-delete"></i> 删除
        </v-contextmenu-item>
      </v-contextmenu>
      <el-dialog title="新增书本" :visible.sync="dialogFormVisible">
        <el-form label-width="120px" ref="dataForm" :model="formData">
          <el-form-item
            label="书本名称"
            prop="bookName"
            :rules="[{
                    trigger: 'blur',
                    required: true,
                    message: '不能为空'
                  }]"
          >
            <el-input v-model="formData.bookName" placeholder="如：移动应用开发平台">
              <el-select
                style="width:100px"
                v-model="formData.lang"
                slot="append"
                placeholder="请选择语言版本"
                @change="langChange"
              >
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="(item,index) in  langList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item
            label="文件夹名称"
            prop="bookCode"
            :rules="[
                    {trigger: 'blur', required: true, validator: validateBookCode},
                  ]"
          >
            <el-input v-model="formData.bookCode" placeholder="如：ydyykfpt"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closePop()">取 消</el-button>
          <el-button type="primary" @click="onAddBook">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- <el-button @click="max()">最大化</el-button> -->
  </el-scrollbar>
</template>

<script>
import draggable from "vuedraggable";
const langList = [
  {
    label: "简体版",
    value: "zh-hans"
  },
  {
    label: "繁体版",
    value: "zh-tw"
  },
  {
    label: "English",
    value: "en-us"
  }
];
export default {
  data: function() {
    return {
      booksList: [],
      langList,
      formData: {
        docPath: "D:/test_code/md_test",
        aubBookPath: "",
        bookName: "",
        lang: langList[0].value,
        langLabel: langList[0].label,
        bookCode: "",
        bookListDom: ""
      },
      action: {
        bookCode: ""
      },
      dialogFormVisible: false,
      formLabelWidth: "120px",
      mainH: 800
    };
  },
  mounted() {
    this.init();
    // window.addEventListener("resize", () => {
    //   console.log("A");
    //   this.mainH = document.documentElement.clientHeight - 40;
    // });
    console.log(this.$refs.myScrollbar);
    this.mainH = document.documentElement.clientHeight - 40;
  },
  components: {
    draggable
  },
  watch: {
    "formData.bookName": {
      handler(val) {
        this.formData.bookCode = this.$pinyin.getFullChars(val).toLowerCase();
      },
      deep: true,
      immediate: false
    }
  },
  methods: {
    // 选择文件夹
    selectFolder() {
      this.$api.get_folder().then(res => {
        console.log(res);
        if (res.code === 200) {
          if (!res.data.canceled) {
            // strurl = strurl .
            this.formData.docPath = res.data.filePaths[0].replace(/\\/g, "/");
          }
        }
      });
    },
    init() {
      this.formData.bookListDom = "";
      this.formData.docPath =
        this.$myLocalStorage.get("docPath") || "D:/test_code/md_test";
      if (this.formData.docPath) {
        this.onQuery();
      }
    },
    onQuery() {
      this.$refs["searchForm"].validate(valid => {
        if (valid) {
          this.$myLocalStorage.set("docPath", this.formData.docPath);
          this.$api
            .get_books({
              docPath: this.formData.docPath
            })
            .then(res => {
              console.log(res);
              if (res.code === 200) {
                this.booksList = res.data;
                this.formData.aubBookPath = this.booksList[0].value;
              }
            });
        }
      });
    },
    onGoEdit(value, label) {
      this.$router.push(`/edit?aubBookPath=${value}&bookLaebl=${label}`);
    },
    showPop() {
      this.dialogFormVisible = true;
    },
    closePop() {
      this.dialogFormVisible = false;
    },
    langChange() {
      console.log(this.formData.lang);
      this.formData.langLabel = this.langList.filter(item => {
        return item.value == this.formData.lang;
      })[0].label;

      console.log(this.formData.langLabel);
    },
    finishingList() {
      this.formData.bookListDom = "<ul>";
      this.booksList.forEach(item => {
        this.formData.bookListDom += `<li><a href="${item.href}">${item.label}</a></li>`;
      });
      this.formData.bookListDom += "/<ul>";
    },

    validateBookCode(rule, value, callback) {
      if (!value) {
        callback("不能为空");
      } else {
        this.booksList.forEach(item => {
          if (item.href == this.formData.bookCode + "-" + this.formData.lang) {
            callback("文件夹名称已重复");
          }
        });
        callback();
      }
    },
    // 新增书籍
    onAddBook() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.booksList.push({
            href: this.formData.bookCode + "-" + this.formData.lang,
            label: this.formData.bookName + "-" + this.formData.langLabel,
            value:
              this.formData.docPath +
              "/" +
              this.formData.bookCode +
              "-" +
              this.formData.lang
          });
          this.finishingList();

          this.$api
            .add_books({
              bookName: this.formData.bookName + "-" + this.formData.langLabel,
              bookCode: this.formData.bookCode + "-" + this.formData.lang,
              docPath: this.formData.docPath,
              bookListDom: this.formData.bookListDom
            })
            .then(res => {
              if (res.code === 200) {
                this.closePop();
              }
            });
        }
      });
    },
    // 拖拽排序
    end(event) {
      var list = JSON.parse(JSON.stringify(this.booksList));
      var list2 = JSON.parse(JSON.stringify(this.booksList));
      list[event.oldIndex] = list2[event.oldIndex];
      list[event.newIndex] = list2[event.newIndex];
      this.booksList = list;
      this.finishingList();
      this.$api
        .update_books_rank({
          docPath: this.formData.docPath,
          bookListDom: this.formData.bookListDom
        })
        .then(res => {
          if (res.code === 200) {
          }
        });
    },
    rightClick(op) {
      console.log(op);
      this.action.bookCode = op.href;
      this.action.label = op.label;
      this.action.label = op.label;
    },
    deleteBook() {
      this.$confirm(`是否确认删除 ${this.action.label} ?`, "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let index = 0;
          this.booksList.forEach((item, i) => {
            if (item.href === this.action.bookCode) {
              index = i;
            }
          });
          this.booksList.splice(index, 1);
          this.finishingList();
          this.$api
            .del_books({
              docPath: this.formData.docPath,
              bookListDom: this.formData.bookListDom,
              bookCode: this.action.bookCode
            })
            .then(res => {
              if (res.code === 200) {
                // this.init();
              }
            });
        })
        .catch(() => {});
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
.select-fold {
  background: orangered !important;
  color: #fff !important;
  border-radius: 0 !important;
  margin-right: 0px !important;
  span {
    color: #fff !important;
  }
}

.el-scrollbar__wrap {
  overflow-x: hidden;
  overflow-y: auto;
}
</style>