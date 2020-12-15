<template>
  <el-card style="margin-top: 20px">
    <el-button type="primary" icon="el-icon-plus">添加SPU</el-button>

    <el-table
      v-loading="loading"
      :data="spuList"
      border
      style="width: 100%; margin: 20px 0"
    >
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="spuName" label="SPU名称"> </el-table-column>

      <el-table-column prop="description" label="SPU描述"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button type="primary" icon="el-icon-plus" size="mini"></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="$emit('showUpdateList', row)"
          ></el-button>
          <el-button type="info" icon="el-icon-info" size="mini"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="getPageList(page, limit)"
      @current-change="getPageList(page, limit)"
      class="pagination"
      layout="prev, pager,next, jumper,sizes,total"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      :current-page.sync="page"
      :total="total"
    >
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  name: "SpuShowList",
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      spuList: [],
      loading: false,
    };
  },
  methods: {
    // 一开始获取SPU分页列表
    async getPageList(page, limit) {
      this.loading = true;
      const { category3Id } = this.category;
      const result = await this.$API.spu.getSpuList({
        page,
        limit,
        category3Id,
      });
      if (result.code === 200) {
        this.$message.success("获取SPU分页成功");
        this.spuList = result.data.records;
        this.total = result.data.total;
        // console.log(result.data);
      } else {
        this.$message.error(result.message);
      }
      this.loading = false;
    },
    //触发事件  将分类id传过来 处理category的change（选中三级分类时候触发）
    handleCategoryChange(category) {
      this.category = category;
      this.getPageList(this.page, this.limit);
    },
    //点击1级 2级分类时清空数据
    clearList() {
      this.spuList = [];
      this.page = 1;
      this.limit = 3;
      this.total = 0;
      this.category.category3Id = "";
    },
  },
  mounted() {
    //触发事件  将分类id传过来
    this.$bus.$on("change", this.handleCategoryChange);
    this.$bus.$on("clearList", this.clearList);
  },
  beforeDestroy() {
    //通常情况下 清楚绑定的全局事件
    this.$bus.$off("change", this.handleCategoryChange);
    this.$bus.$off("change", this.clearList);
  },
};
</script>

<style>
</style>
