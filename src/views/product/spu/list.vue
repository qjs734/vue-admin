<template>
  <div>
    <SKuList v-if="isShowSkulist" :spuItem="spuItem"></SKuList>
    <div v-else>
      <Category :disabled="!isShowList" />
      <SpuShowList
        @showSpuList="showSpuList"
        v-if="isShowList"
        @showUpdateList="showUpdateList"
      />
      <SpuUpdateList v-else :item="item" @showList="showList" />
    </div>
  </div>
</template>

<script>
import Category from "@/components/Category";
import SpuShowList from "./spuShowList";
import SpuUpdateList from "./spuUpdateList";
import SKuList from "./skuList";

export default {
  name: "SpuList",
  data() {
    return {
      isShowList: true,
      item: {},
      isShowSkulist: false,
      spuItem: {},
    };
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
    SKuList,
  },
  methods: {
    //这是添加时候更新界面
    showSpuList(row) {
      this.isShowSkulist = true;
      this.spuItem = { ...row };
    },
    //这是修改时候更换界面的
    showUpdateList(row = {}) {
      this.isShowList = false;
      //避免地址引用，使用浅克隆
      this.item = { ...row };
    },
    //这是保存时更新界面的
    showList(category3Id) {
      this.isShowList = true;
      // 等ShowList组件加载完成，在触发事件,更新界面
      this.$nextTick(() => {
        this.$bus.$emit("change", { category3Id });
      });
    },
  },
};
</script>
