<template>
  <div>
    <el-button @click="add" type="primary" icon="el-icon-plus">添加</el-button>

    <el-table
      :data="trademarkList"
      border
      style="width: 100%; margin: 20px 0"
      v-loading="loading"
    >
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <!-- <template v-scope="scope"> -->
          <!-- scope代替所有数据  scope.row代表当前这一行的所有数据 -->
          <img :src="scope.row.logoUrl" alt="logo" class="trademark-img" />
          <!-- {{ scope }} -->
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="warning" icon="el-icon-edit" @click="update(row)"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete" @click="del(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="getPageList(page, limit)"
      @current-change="getPageList(page, limit)"
      class="trademark-pagination"
      layout="prev, pager,next, jumper,sizes,total"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      :current-page.sync="page"
      :total="total"
    >
    </el-pagination>

    <el-dialog
      :title="`${trademarkForm.id ? '修改' : '添加'}品牌`"
      :visible.sync="visible"
      width="50%"
    >
      <el-form
        :model="trademarkForm"
        ref="trademarkForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="trademarkForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <!--
            前提允许跨域
              action="http://182.92.128.115/admin/product/fileUpload"
              目标服务器地址: 代理配置中 (vue.config.js)

            不允许跨域，就使用proxy
              action="/dev-api/admin/product/fileUpload"
              /dev-api -> request.js 代理
             在main.js中定义 Vue.prototype.$BASE_API = process.env.VUE_APP_BASE_API
           -->
          <el-upload
            class="avatar-uploader"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkForm.logoUrl"
              :src="trademarkForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span></span>只能上传jpg/png文件，且不超过50kb
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('trademarkForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
//分别引入这样汇总的
// import { trademark } from "@/api";
//因为在main里引入了API as API 在Vue的原型上属性与方法都有个$符号 所以可以不用引入直接用

export default {
  name: "TrademarkList",
  data() {
    return {
      trademarkList: [],
      total: 0, //总数
      page: 1, //页码
      limit: 3, //每页条数
      visible: false, //对话框显示与隐藏
      trademarkForm: {
        //表单数据
        tmName: "",
        logoUrl: "",
      },
      rules: {
        tmName: [
          {
            // required: true,
            // message: "请输入品牌名称",
            validator: this.validator,
            trigger: "blur",
          },
        ],
        logoUrl: [
          {
            required: true,
            message: "请上传品牌LOGO",
          },
        ],
      },
      loading: false, //加载功能
    };
  },
  methods: {
    //点击删除按钮
    del(row) {
      console.log(row);
      this.$confirm(`确定删除 ${row.tmName} 吗?`, "提示", {
        type: "warning",
      })
        .then(async () => {
          // 点击确定的回调
          // 发删除品牌的请求
          const result = await this.$API.trademark.deleteTrademark(row.id);
          // 如果成功了, 提示成功, 重新获取列表(哪一页?)
          this.$message({
            type: "success",
            message: "删除成功!",
          });

          // 哪一页?  显示上一页(当前页的列表数据只剩下1个)  否则显示当前页
          // 如果当前是第1页且只剩下1条数据 ==> 请求第1页数据(当前页)
          this.getPageList(
            this.trademarkList.length === 1 && this.page > 1
              ? this.page - 1
              : this.page,
            this.limit
          );
        })
        .catch((error) => {
          // 点击取消的回调
          if (error === "cancel") {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          }
        });
    },
    //自定义校验规则
    validator(rule, value, callback) {
      //callback必须调用  rule校验表单字段 value校验的表单值 callback决定成功失败
      if (!value) {
        callback(new Error("请输入品牌名称"));
        return;
      } else if (value.length < 2 || value.length > 10) {
        callback(new Error("请输入2-10位的名字"));
      }
      callback();
    },
    //点击添加按钮
    add() {
      this.visible = true;
      //清空 从修改到添加要清空修改的数据
      this.trademarkForm = {
        tmName: "",
        logoUrl: "",
      };

      //清空表单校验结果
      this.$refs.trademarkForm && this.$refs.trademarkForm.clearValidate();
    },
    // 更新修改的方法
    update(row) {
      //显示对话框
      this.visible = true;
      // console.log(row);
      //row代表当前行的数据{}间接等于trademarklist,这样修改trademarkform就会修改trademarklist，所以...解构就变成基本类型就不会地址值改变了
      // this.trademarkForm = { ...row };
      this.trademarkForm = JSON.parse(JSON.stringify(row));
      //清空表单校验结果
      this.$refs.trademarkForm && this.$refs.trademarkForm.clearValidate();
    },
    //提交表单的方法
    submitForm(form) {
      this.$refs[form].validate(async (valid) => {
        //校验通过
        if (valid) {
          const { trademarkForm } = this;
          const isUpdate = !!trademarkForm.id;
          //如果是修改
          if (isUpdate) {
            const tm = this.trademarkList.find(
              (tm) => tm.id === trademarkForm.id
            );
            if (
              tm.tmName === trademarkForm.tmName &&
              tm.logoUrl === trademarkForm.logoUrl
            ) {
              this.$message.warning("不能提交相同的数据");
              return;
            }
          }
          // console.log(this.trademarkForm);
          //发送请求
          let result;
          if (isUpdate) {
            result = await this.$API.trademark.updateTrademark(
              //更新数据
              this.trademarkForm
            );
          } else {
            result = await this.$API.trademark.addTrademark(this.trademarkForm); //添加数据
          }

          if (result.code === 200) {
            this.$message.success(`${isUpdate ? "修改" : "添加"}品牌数据成功`);
            this.visible = false; //隐藏对话框
            this.getPageList(this.page, this.limit); //请求加载新数据
          } else {
            this.$message.error(result.message);
          }
        }
      });
    },
    // 上传图片成功
    handleAvatarSuccess(res) {
      this.trademarkForm.logoUrl = res.data;
    },
    //上传图片之前的回调,用于验证图片格式及大小是否符合规则
    beforeAvatarUpload(file) {
      console.log(file);
      const imgTypes = ["image/jpeg", "image/png", "image/jpg"];
      //检测文件类型
      const isValidType = imgTypes.indexOf(file.type) > -1;
      //检查文件大小
      const isLt = file.size / 1024 < 50;

      if (!isValidType) {
        this.$message.error("上传品牌LOGO只能是 JPG 格式或 PNG 格式!");
      }
      if (!isLt) {
        this.$message.error("上传头像图片大小不能超过 50kb!");
      }
      //返回值为true代表可以上传，否则不可以上传
      return isValidType && isLt;
    },
    //改变页面显示多少
    // handleSizeChange(limit) {
    //   console.log("limit", limit);
    //   this.getPageList(this.page, limit);
    // },
    // //页码改变
    // handleCurrentChange(page) {
    //   console.log("page", page);
    //   this.getPageList(page, this.limit);
    // },
    //请求分页列表
    async getPageList(page, limit) {
      this.loading = true;
      const result = await this.$API.trademark.getPageList(page, limit);
      if (result.code === 200) {
        this.$message.success("获取品牌分页列表成功");
        this.limit = result.data.size; // 代表每页显示的条数
        this.page = result.data.current; // 代表当前页码
        this.trademarkList = result.data.records;
        this.total = result.data.total; // 总数
      } else {
        this.$message.error("获取品牌分页列表失败");
      }
      this.loading = false;
    },
  },
  mounted() {
    //默认是1和3
    this.getPageList(this.page, this.limit);
  },
};
</script>

<style lang="sass" scoped>
.trademark-img
  width: 150px

.trademark-pagination
  text-align: center

>>>.el-pagination__sizes
  margin-left: 200px

>>>.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden
  &:hover
    border-color: #409EFF

>>>.avatar-uploader-icon
  font-size: 28px
  color: #8c939d
  width: 178px
  height: 178px
  line-height: 178px
  text-align: center

>>>.avatar
  width: 178px
  height: 178px
  display: block
</style>

