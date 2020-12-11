<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>

    <el-table :data="tableData" border style="width: 100%; margin: 20px 0">
      <el-table-column prop="id" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="name" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <!-- scope代替所有数据  scope.row代表当前这一行的所有数据 -->
          <img :src="scope.row.logo" alt="logo" class="trademark-img" />
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
      class="trademark-pagination"
      layout="prev, pager,next, jumper,sizes,total"
      :total="50"
    >
    </el-pagination
    >00000000000000000000000000000000
  </div>
</template>

<script>
export default {
  name: "TrademarkList",
  data() {
    return {
      tableData: [
        {
          id: 1,
          name: "phone",
          logo:
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1607695399952&di=0cc71676efdcaadbb9073ceabc174c99&imgtype=0&src=http%3A%2F%2Fnews.hnr.cn%2Fjctj%2F201610%2FW020161003422179350181.jpg",
        },
      ],
    };
  },
};
</script>

<style lang="sass" scoped>
.trademark-img
  width: 150px

.trademark-pagination
  text-align: center

>>>.el-pagination__sizes
  margin-left: 250px

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

