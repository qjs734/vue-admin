//因为js中没有自己的this所以api需要自己引入，不能使用挂载到实例的this
import * as API from "@/api";
import { template } from "@babel/core";
import { Message } from "element-ui";

export default {
    namespaced: true,
    state: {
        category: { category1Id: "", category2Id: "", category3Id: "" },
        category1List: [],
        category2List: [],
        category3List: []
    },
    actions: {
        //获得一级列表的数据
        async getCategory1List({ commit }) {
            const result = await API.attrs.getCategorys1();
            if (result.code === 200) {
                commit("GET_CATEGORY1_LIST", result.data);
            } else {
                Message.error(result.message);
            }
        },
        // 获得二级列表的数据
        async getCategory2List({ commit }, category1Id) {
            // this.category2List = [];
            // this.category3List = [];
            // this.category.category2Id = "";
            // this.category.category3Id = "";

            const result = await API.attrs.getCategorys2(category1Id);
            if (result.code === 200) {
                commit("GET_CATEGORY2_LIST_SUCCESS", {
                    category1Id,
                    category2List: result.data
                });
            } else {
                commit("GET_CATEGORY2_LIST_ERROR", category1Id);
                Message.error(result.message);
            }
        },
        // 获得三级列表的数据
        async getCategory3List({ commit }, category2Id) {
            // this.category2List = [];
            // this.category3List = [];
            // this.category.category2Id = "";
            // this.category.category3Id = "";

            const result = await API.attrs.getCategorys3(category2Id);
            if (result.code === 200) {
                commit("GET_CATEGORY3_LIST_SUCCESS", {
                    category2Id,
                    category3List: result.data
                });
            } else {
                commit("GET_CATEGORY3_LIST_ERROR", category2Id);
                Message.error(result.message);
            }
        }
        //三级分类不发请求
    },
    mutations: {
        GET_CATEGORY1_LIST(state, category1List) {
            //获取一级列表，此时还没有一级分类 这是一上来就调用
            state.category1List = category1List;
        },
        //获取二级列表，此时选择一级分类，所以给一级分类Id，更新二级分类数据，等请求三级时再给二级Id
        GET_CATEGORY2_LIST_SUCCESS(state, { category1Id, category2List }) {
            state.category2List = category2List;
            state.category3List = [];
            state.category.category1Id = category1Id;
            state.category.category2Id = "";
            state.category.category3Id = "";
        },
        //一级分类发请求失败了，Id还是Id,但是2 3级列表应该清空
        GET_CATEGORY2_LIST_ERROR(state, category1Id) {
            state.category2List = [];
            state.category3List = [];
            state.category.category1Id = category1Id;
            state.category.category2Id = "";
            state.category.category3Id = "";
        },
        //获取三级列表，此时选择二级分类，所以给二级分类Id，更新二级分类数据，等请求三级时再给二级Id
        GET_CATEGORY3_LIST_SUCCESS(state, { category2Id, category3List }) {
            state.category3List = category3List;
            state.category.category2Id = category2Id;
            state.category.category3Id = "";
        },
        //二级分类发请求失败了，Id还是Id,但是3级列表应该清空
        GET_CATEGORY3_LIST_ERROR(state, category2Id) {
            state.category3List = [];
            state.category.category2Id = category2Id;
            state.category.category3Id = "";
        },
        //因为别的地方定义了3Id发送请求的事件，所以这里直接定义3Id
        SET_CATEGORY3_ID(state, category3Id) {
            state.category.category3Id = category3Id;
        },
        RESET_CATEGORY_ID(state) {
            state.category.category3Id = "";
            state.category.category2Id = "";
            state.category.category1Id = "";
        }
    },
    getters: {}
};