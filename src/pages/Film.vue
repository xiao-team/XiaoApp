<template>
  <div class="film-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="搜索" name="search">
        <div>
          <el-select
            v-model="line"
            placeholder="请选择线路"
            style="width: 140px; margin-right: 10px"
            size="small"
            clearable
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input
            v-model="videoname"
            placeholder="请输入搜索内容"
            style="width: 200px"
            size="small"
            @keyup.enter="search"
          ></el-input>
          <el-button
            style="margin-left: 10px"
            @click="search"
            size="small"
            :loading="loading"
            >搜索</el-button
          >
        </div>
        <el-table
          :data="searchList"
          :height="'calc(100vh - 128px)'"
          style="width: 100%"
          v-loading="loading"
          empty-text="暂无数据哦！试试搜索吧"
        >
          <el-table-column
            type="index"
            :label="'共' + searchList.length + '条'"
            width="80"
          >
          </el-table-column>
          <el-table-column prop="title" label="片名" width="180">
          </el-table-column>
          <el-table-column prop="sort" label="类型" width="180">
          </el-table-column>
          <el-table-column prop="time" label="更新时间" width="180">
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template #default="scope">
              <i
                class="table-icon el-icon-more"
                circle
                @click="handleClick(scope.row, 'more')"
              ></i>
              <!-- <i
                class="table-icon el-icon-star-off"
                :class="{ 'el-icon-star-on like': !scope.row.like }"
                circle
                @click="handleClick(scope.row, 'star')"
              ></i> -->
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="详情" name="detail">
        <el-card class="box-card">
          <template #header>
            <div class="clearfix" v-if="detail.list.length">
              <span>{{ detail.name }}, 共{{ detail.list.length }}条</span>
            </div>
            <div v-else>暂无数据</div>
          </template>
          <div v-if="detail.list.length > 100">
            <el-select
              v-model="page"
              placeholder="请选择线路"
              style="width: 140px; margin-bottom: 16px"
              size="small"
              clearable
            >
              <el-option
                v-for="item in pageSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div>
            <span
              v-for="item in detailList"
              :key="item.url"
              class="detail-item"
              @click="playVideo(item)"
              >{{ item.name }}</span
            >
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, reactive, toRefs } from 'vue'
  import axios from 'axios'
  import { ElMessage } from 'element-plus'
  import qs from 'qs'
  import Bus from '../eventBus'
  import { useStore } from 'vuex'
  const api = 'http://www.88ksk.cn/cgi/qingfeng'
  interface VideoItem {
    sort: string
    time: string
    title: string
    url: string
  }
  interface DataType {
    options: any[]
    line: string
    loading: boolean
    videoname: string
    activeName: string
    searchList: VideoItem[]
    detail: {
      name: string
      list: any[]
    }
    page: number
  }
  const data = reactive<DataType>({
    options: [
      {
        label: '盖伦',
        value: '1'
      },
      {
        label: '提莫',
        value: '2'
      },
      {
        label: '赵信',
        value: '6'
      },
      {
        label: '亚索',
        value: '12'
      },
      {
        label: '永恩',
        value: '14'
      },
      {
        label: '李青',
        value: '15'
      }
    ],
    line: '1',
    loading: false,
    videoname: '火影忍者',
    activeName: 'search',
    searchList: [],
    detail: {
      name: '',
      list: []
    },
    page: 0
  })
  export default defineComponent({
    name: 'Film',
    setup() {
      const store = useStore()
      const search = () => {
        if (data.line === '') {
          ElMessage.warning('请选择线路')
          return
        }
        if (data.videoname === '') {
          ElMessage.warning('请输入视频名称')
          return
        }
        data.loading = true
        axios
          .post('http://localhost:4848/api', {
            url:
              'http://www.88ksk.cn/cgi/qingfeng?' +
              qs.stringify({
                type: 'search',
                jiekou: data.line,
                value: data.videoname
              })
          })
          .then(res => {
            const info = res?.data?.info || {}
            if (info.code === 200) {
              data.searchList = info.data
            } else {
              ElMessage.warning('暂无数据，试试其他线路吧')
              data.searchList = []
            }
          })
          .catch(error => {
            ElMessage.warning('暂无数据，试试其他线路吧')
          })
          .finally(() => {
            data.loading = false
          })
      }
      const handleClick = (item: VideoItem, type: string) => {
        if (type === 'more') {
          axios
            .post('http://localhost:4848/api', {
              url:
                'http://www.88ksk.cn/cgi/qingfeng?' +
                qs.stringify({
                  type: 'video',
                  jiekou: data.line,
                  value: item.url
                })
            })
            .then(res => {
              const info = res?.data?.info || {}
              if (info.code === 200) {
                data.detail.name = item.title
                data.detail.list = info.data.content
                data.activeName = 'detail'
                data.page = 0
              } else {
                ElMessage.warning('资源不存在，试试其他线路吧')
              }
            })
            .catch(error => {
              ElMessage.warning('资源不存在，试试其他线路吧')
            })
            .finally(() => {
              data.loading = false
            })
        }
      }
      const pageSelect = computed(() => {
        const page = (data.detail.list.length / 100) | 0
        const list = []
        for (let i = 0; i < page + 1; i++) {
          list.push({
            label:
              100 * i +
              1 +
              '~' +
              (i === page ? data.detail.list.length : 100 * (i + 1)),
            value: i
          })
        }
        return list
      })
      const detailList = computed(() => {
        return data.detail.list.slice(data.page * 100, (data.page + 1) * 100)
      })
      const playVideo = (item: VideoItem) => {
        Bus.$emit('play', item)
        store.commit('SET_MENU', 'player')
      }
      return {
        ...toRefs(data),
        search,
        handleClick,
        pageSelect,
        detailList,
        playVideo
      }
    }
  })
</script>
<style lang="scss" scoped>
  .film-container {
    padding-left: 50px;
    max-height: calc(100vh - 40px);
    overflow-y: auto;
    padding-right: 16px;
  }
  .detail-item {
    display: inline-block;
    cursor: pointer;
    color: #409eff;
    margin-right: 36px;
    margin-bottom: 16px;
    white-space: pre;
  }
</style>
