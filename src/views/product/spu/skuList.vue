<template>
  <el-card>
    <el-form label-width="100px" :model="sku" :rules="rules" ref="spuForm">
      <el-form-item label="SPU名称" prop="spuName">
        <span>{{ spu.spuName }}</span>
      </el-form-item>
      <el-form-item label="SKU名称" prop="skuName">
        <el-input placeholder="请输入SKU名称" v-model="sku.skuName"> </el-input>
      </el-form-item>
      <el-form-item label="价格(元)" prop="price">
        <el-input-number
          style="width: 300px"
          placeholder="请输入价格"
          :min="0"
          controls-position="right"
          v-model="sku.price"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="重量(千克)" prop="weight">
        <el-input-number
          style="width: 300px"
          placeholder="请输入重量"
          :min="0"
          controls-position="right"
          v-model="sku.weight"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="规格描述" prop="description">
        <el-input
          type="text"
          placeholder="请输入规格描述"
          v-model="sku.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <div
          class="skulist-select-container"
          v-for="(attr, index) in attrList"
          :key="attr.id"
        >
          <span>{{ attr.attrName }}</span>
          <el-form-item style="display: inline-block" prop="skuAttrValueList"
            ><el-select
              placeholder="请选择"
              v-model="sku.skuAttrValueList[index]"
            >
              <el-option
                v-for="value in attr.attrValueList"
                :key="value.id"
                :label="value.valueName"
                :value="`${attr.id}-${value.id}`"
              ></el-option> </el-select
          ></el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="销售属性" prop="">
        <div
          class="skulist-select-container"
          v-for="(sale, index) in spuSaleAttrList"
          :key="sale.id"
        >
          <span>{{ sale.saleAttrName }}</span>
          <el-form-item
            style="display: inline-block"
            prop="skuSaleAttrValueList"
          >
            <el-select
              placeholder="请选择"
              v-model="sku.skuSaleAttrValueList[index]"
            >
              <el-option
                v-for="value in sale.spuSaleAttrValueList"
                :key="value.id"
                :label="value.saleAttrValueName"
                :value="value.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="图片列表" prop="">
        <el-table
          border
          ref="multipleTable"
          :data="imgList"
          tooltip-effect="dark"
          style="width: 100%; margin: 20px 0"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" prop="isCheck">
          </el-table-column>
          <el-table-column label="图片">
            <template slot-scope="scope"
              ><img :src="scope.row.imgUrl" alt="scope.row.imgName"
            /></template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称"> </el-table-column>
          <el-table-column label="操作">
            <template>
              <el-button type="primary" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { category } from "@/api";
import { mapState } from "vuex";

export default {
  name: "SKuList",
  data() {
    return {
      spu: this.spuItem, //传过来的spu数据
      rules: {}, //校验规则
      imgList: [], //图片列表
      spuSaleAttrList: [], //销 售属性数据
      attrList: [], //平台属性数据
      sku: {
        skuAttrValueList: [],
        skuSaleAttrValueList: [],
      }, // sku数据
    };
  },
  props: {
    spuItem: Object,
  },
  methods: {
    handleSelectionChange() {},
    // 获取SPU销售属性列表
    async getSpuSaleAttrList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuSaleAttrList(id);
      if (result.code === 200) {
        this.$message.success("获取SPU销售属性列表成功~");
        // 处理数据
        this.spuSaleAttrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    //获取所有图片列表数据
    async getSpuImageList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuImageList(id);
      if (result.code === 200) {
        this.$message.success("获取所有图片成功");
        //处理数据成为element组件需要的格式
        //这里不处理 给computer处理图片
        this.imgList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    //获取所有平台属性列表数据
    async getAttrList() {
      const result = await this.$API.attrs.getAttrList(this.category);
      if (result.code === 200) {
        this.$message.success("获取所有平台属性成功");
        //处理数据成为element组件需要的格式
        //这里不处理 给computer处理图片
        this.attrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
  },
  computed: {
    ...mapState({
      category: (state) => {
        //返回值应该是state的category文件里的category数据
        return state.category.category;
      },
    }),
  },
  mounted() {
    // 获取SPU销售属性列表
    this.getSpuSaleAttrList(),
      //获取所有图片列表数据
      this.getSpuImageList();
    //获取所有平台属性列表数据
    this.getAttrList();
  },
};
</script>

<style lang="sass" scoped>
>>>.el-input-number .el-input__inner
  text-align: left
.skulist-select-container
  display: inline-block; margin-right: 20px
</style>
