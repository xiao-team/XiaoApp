<template>
  <div class="stock-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="股票" name="stock">
        <StockPane />
      </el-tab-pane>
      <el-tab-pane label="基金" name="fund">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, reactive, toRefs, onMounted } from 'vue'
  import StockPane from './components/StockPane.vue'
  interface DataType {
    line: string
    loading: boolean
    activeName: string
    searchList: any[]
  }
  const data = reactive<DataType>({
    line: '1',
    loading: false,
    activeName: 'stock',
    searchList: [],
  })
  export default defineComponent({
    name: 'Stock',
    components: {StockPane},
    setup() {
      onMounted(() => {
      })
      return {
        ...toRefs(data),
      }
    }
  })
</script>

<style lang="scss" scoped>
  .stock-container {
    padding-left: 50px;
    padding-right: 16px;
  }
</style>
