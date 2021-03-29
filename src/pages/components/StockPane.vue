<template>
  <div>
    <div class="flex">
      <el-card class="box-card" size="mini">
        <template #header>
          <div class="clearfix flex space-between y-center">
            <el-select
              v-model="value"
              filterable
              remote
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              :loading="loading"
              @change="selectStock"
              size="mini"
            >
              <el-option
                v-for="item in options"
                :key="item.Code"
                :label="item.Name + `(${item.Code})`"
                :value="JSON.stringify(item)"
              >
              </el-option>
            </el-select>
            <i
              class="el-icon-refresh refresh-icon"
              @click="getStocksDetail(true)"
            ></i>
          </div>
        </template>
        <div
          v-for="(o, i) in myStock"
          :key="o.code"
          class="stock-item mb-8 flex space-between y-center pointer"
          :class="{ 'active-item': i === activeIndex }"
          @click="getStockDetail(o, i)"
        >
          <div>
            {{ o.name }}
            <span class="small-text">({{ o.code }})</span>
          </div>
          <div :class="o.rate > 0 ? 'red-text' : 'green-text'">
            {{ o.price }}
            <span class="small-text">({{ o.changePrice }})</span>
          </div>
          <span
            class="small-text"
            :class="o.rate > 0 ? 'red-text' : 'green-text'"
            >{{ o.rate }}%</span
          >
          <i class="el-icon-close pointer" @click="deleteStock(o.id)"></i>
        </div>
      </el-card>
      <div class="right-container">
        <el-radio-group v-model="kType" class="mb-16" size="mini">
          <el-radio-button label="time">实时</el-radio-button>
          <el-radio-button label="day">日K</el-radio-button>
          <el-radio-button label="week">周K</el-radio-button>
          <el-radio-button label="month">月K</el-radio-button>
        </el-radio-group>

        <div id="day"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, reactive, toRefs, onMounted } from 'vue'
  // @ts-ignore
  import { Chart } from '@antv/g2'
  import DataSet from '@antv/data-set';
  import stockApi from '../../apis/stock'
  import stockDB from '../../data/stock'
  const createView = new DataSet().createView()
  let chart: Chart
  interface DataType {
    line: string
    loading: boolean
    activeName: string
    options: any[]
    stockName: string
    value: string
    myStock: any[]
    activeIndex: number
    kType: string
  }
  const data = reactive<DataType>({
    line: '1',
    loading: false,
    activeName: 'stock',
    options: [],
    stockName: '',
    value: '',
    myStock: [],
    activeIndex: -1,
    kType: 'time'
  })
  const api = 'https://searchapi.eastmoney.com/api/Info/Search'
  export default defineComponent({
    name: 'StockPane',
    setup() {
      const getStocksDetail = () => {
        stockApi
          .getDetails(data.myStock)
          .then(res => {
            data.myStock = data.myStock.map(item => {
              const result = res.find((e: any) => e.f12 === item.code)
              if (result) {
                item.price = result.f2
                item.rate = result.f3
                item.changePrice = result.f4
              }
              return item
            })
          })
          .finally(() => {})
      }
      const updateMyStockFromDB = async () => {
        const stockList = await stockDB.all()
        data.myStock = stockList
        await getStocksDetail()
      }
      onMounted(async () => {
        updateMyStockFromDB()
        setInterval(() => {
          getStocksDetail()
        }, 20000)
        chart = new Chart({
          container: 'day',
          autoFit: true,
          height: 500
        })
      })
      const remoteMethod = (query: string) => {
        if (query !== '') {
          data.loading = true
          stockApi
            .search(query)
            .then(res => {
              if (res?.Data?.length) {
                data.options = res.Data
              } else {
                data.options = []
              }
            })
            .catch(err => {
              data.options = []
            })
            .finally(() => {
              data.loading = false
            })
        }
      }
      const selectStock = async (item: string) => {
        const detail = JSON.parse(item)
        await stockDB.add({
          name: detail.Name,
          code: detail.Code,
          marketNumber: detail.MktNum
        })
        updateMyStockFromDB()
      }
      const deleteStock = async (id: string) => {
        await stockDB.remove(id)
        updateMyStockFromDB()
      }
      // 获取单个股票详情
      const getStockDetail = async (item: any, i: number) => {
        if (data.activeIndex === i) return
        data.activeIndex = i
        const info = await stockApi.getDetail(
          `${item.marketNumber}.${item.code}`
        )
        const priceRange = [+info.prePrice * 0.9, +info.prePrice * 1.1]
        // console.log(info)
        const trends = info.trends
          .map((o: string, i: number) => {
            const time = o.split(',')[0]
            const array = o.split(/\s+/)[1].split(',')
            const lastPrice = i === 0 ? +(info.prePrice) : +(info.trends[i-1].split(',')[1])
            const nowPrice = +array[1]
            return {
              time: time,
              value: nowPrice,
              sale: +array[2],
              trendUp: nowPrice > lastPrice ? true : false,
              change: ((nowPrice - info.prePrice) * 100 / info.prePrice).toFixed(2)
            }
          })

        chart.clear()
        const kView = chart.createView({
          region: {
            start: { x: 0, y: 0 },
            end: { x: 1, y: 0.7 },
          }
        });
        kView.data(trends);
        kView.scale({
          time: {
            nice: true,
            tickInterval: 120,
            formatter(val) {
              return val.split(/\s+/)[1]
            },
            min: 0,
            max: 241
          },
          value: {
            values: priceRange,
            alias: '价格',
            tickCount: 10
            // range: [0, 1]
          },
          sale: {
            alias: '成交量'
          },
          change: {
            alias: '涨幅',
            formatter: (val) => {
              const color = val > 0 ? '#f04864' : '#2fc25b'
              return `<span style="color: ${color}">${val}%</span>`
            }
          }
        })
        kView.tooltip({
          showCrosshairs: true, // 展示 Tooltip 辅助线
          shared: true
        })

        kView
          .line()
          .position('time*value').tooltip('value*sale*change')
          
        chart.render()
      }
      return {
        ...toRefs(data),
        remoteMethod,
        selectStock,
        getStocksDetail,
        deleteStock,
        getStockDetail
      }
    }
  })
</script>

<style scoped>
  .box-card {
    width: 340px;
    font-size: 14px;
    flex-shrink: 0;
    margin-right: 16px;
  }
  .small-text {
    font-size: 12px;
  }
  .red-text {
    color: #f56c6c;
  }
  .green-text {
    color: #4eb61b;
  }
  .refresh-icon {
    font-size: 20px;
    cursor: pointer;
  }
  .active-item::before {
    display: block;
    position: absolute;
    left: 10px;
    content: ' ';
    width: 6px;
    height: 6px;
    background-color: #f56c6c;
    border-radius: 50%;
  }
  .right-container {
    flex: 1;
  }
</style>
