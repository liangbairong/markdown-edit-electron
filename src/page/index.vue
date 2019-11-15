<template>
  <div class="content">
    <el-form class="demo-form-inline">
      <el-form-item label="项目本地文件夹路径">
        <el-input v-model="formData.docPath" placeholder="请输入本地文件夹路径">
          <el-button slot="append" type="primary" @click="onQuery">确定</el-button>
        </el-input>
      </el-form-item>
    </el-form>
    <h2 class="title">书籍列表</h2>
    <el-row :gutter="12">
      <el-col :span="4">
        <el-card shadow="hover">
          <div @click="addBook" class="box" style="text-align:center;">
            <el-button type="primary" class="back" icon="el-icon-plus" circle></el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4" v-for="item in booksList" :key="item.value">
        <el-card shadow="hover">
          <div class="box" @click="onGoEdit(item.value,item.label)">{{item.label}}</div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="新增书本" :visible.sync="dialogFormVisible">
      <el-form label-width="120px">
        <el-form-item label="书本名称">
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
        <el-form-item label="文件夹名称">
          <el-input v-model="formData.bookCode" placeholder="如：ydyykfpt"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onAddBook">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

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
        bookCode: ""
      },
      dialogFormVisible: false,
      formLabelWidth: "120px"
    };
  },
  created() {
    this.init();
  },
  watch: {
    "formData.bookName": {
      handler(val) {
        this.formData.bookCode=this.$pinyin.getFullChars(val).toLowerCase()
      },
      deep: true,
      immediate: false
    }
  },
  methods: {
    init() {
      this.formData.docPath =
        this.$myLocalStorage.get("docPath") || "D:/test_code/md_test";
      if (this.formData.docPath) {
        this.onQuery();
      }
    },
    onQuery() {
      this.$myLocalStorage.set("docPath", this.formData.docPath);
      this.$api
        .get_books({
          docPath: this.formData.docPath
        })
        .then(res => {
          this.booksList = res.data;
          this.formData.aubBookPath = this.booksList[0].value;
        });
    },
    onGoEdit(value, label) {
      this.$router.push(`/edit?aubBookPath=${value}&bookLaebl=${label}`);
    },
    addBook() {
      this.dialogFormVisible = true;
    },
    langChange() {
      console.log(this.formData.lang);
      this.formData.langLabel = this.langList.filter(item => {
        return item.value == this.formData.lang;
      })[0].label;

      console.log(this.formData.langLabel);
    },
    onAddBook() {
      this.$api
        .add_books({
          bookName: this.formData.bookName + "-" + this.formData.langLabel,
          bookCode: this.formData.bookCode + "-" + this.formData.lang,
          docPath: this.formData.docPath
        })
        .then(res => {});
    }
  }
};
</script>

<style scoped>
.content {
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
  height: 60px;
  line-height: 60px;
}
</style>