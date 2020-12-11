<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>

    <el-table :data="trademarkList" border style="width: 100%; margin: 20px 0">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <!-- scope代替所有数据  scope.row代表当前这一行的所有数据 -->
          <img :src="scope.row.logoUrl" alt="logo" class="trademark-img" />
          <!-- {{ scope }} -->
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="warning" icon="el-icon-edit">修改</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
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
      total: 0,
      page: 1,
      limit: 3,
    };
  },
  methods: {
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

