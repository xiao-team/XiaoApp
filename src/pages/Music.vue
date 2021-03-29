<template>
  <div class="music-container">
    <el-radio-group v-model="listType" size="small" class="mr-8">
      <el-radio-button label="搜索列表"></el-radio-button>
      <el-radio-button label="播放列表"></el-radio-button>
    </el-radio-group>
    <el-select
      v-model="line"
      placeholder="请选择线路"
      style="width: 140px; margin-right: 10px"
      size="small"
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
      v-model="musicname"
      placeholder="请输入搜索内容"
      style="width: 200px"
      size="small"
      @keyup.enter="searchMusic"
    ></el-input>
    <el-button
      style="margin-left: 10px"
      @click="searchMusic"
      size="small"
      :loading="loading"
      >搜索</el-button
    >
    <el-table
      :data="list"
      :height="'calc(100vh - 166px)'"
      style="width: 100%"
      v-loading="loading"
      empty-text="暂无数据哦！试试搜索/添加吧"
    >
      <el-table-column
        type="index"
        :label="'共' + list.length + '条'"
        width="80"
      >
      </el-table-column>
      <el-table-column prop="title" label="专辑图片" width="120">
        <template #default="scope">
          <div class="cover-image">
            <el-image :src="scope.row.pic" fit="cover"> </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="歌名" width="180"> </el-table-column>
      <el-table-column prop="author" label="作者" width="180">
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template #default="scope">
          <i
            class="table-icon el-icon-circle-plus-outline"
            circle
            @click="handleClick(scope.row, 'add')"
            v-if="listType === '搜索列表'"
          ></i>
          <i
            class="table-icon el-icon-delete"
            circle
            @click="handleClick(scope.row, 'delete')"
            v-else
          ></i>
          <i
            class="table-icon el-icon-video-play"
            circle
            @click="handleClick(scope.row, 'play')"
          ></i>
          <i
            class="table-icon el-icon-download"
            circle
            @click="handleClick(scope.row, 'download')"
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
    <div id="aplayer"></div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs, onMounted, computed } from 'vue'
  import { ElMessage } from 'element-plus'
  // import { useStore } from 'vuex'
  import APlayer, { AudioInfo } from 'aplayer'
  import axios from 'axios'
  import audioDB from '../data/audio'
  import 'aplayer/dist/APlayer.min.css'

  const api = 'https://api.i-meto.com/meting/api'

  interface DataType {
    playList: AudioInfo[]
    options: any[]
    line: string
    musicname: string
    searchResult: AudioInfo[]
    loading: boolean
    listType: string
  }

  let player: APlayer

  const data = reactive<DataType>({
    options: [
      {
        label: '网易',
        value: 'netease'
      },
      {
        label: '腾讯',
        value: 'tencent'
      },
      {
        label: '酷狗',
        value: 'kugou'
      },
      {
        label: '虾米',
        value: 'xiami'
      },
      {
        label: '百度',
        value: 'baidu'
      }
    ],
    line: 'netease',
    musicname: '',
    searchResult: [],
    playList: [],
    loading: false,
    listType: '播放列表'
  })
  
  export default defineComponent({
    name: 'Music',
    setup() {
      // const store = useStore()
      onMounted(async () => {
        const audioList = await audioDB.all()
        player = new APlayer({
          container: document.getElementById('aplayer'),
          audio: [...audioList] || [],
          lrcType: 3
        })
        player.list.hide()
        data.playList = audioList as never[]
      })

      const searchMusic = () => {
        if (data.musicname === '') return
        data.loading = true
        data.listType = '搜索列表'
        axios
          .get(api, {
            params: {
              server: data.line,
              type: 'search',
              id: data.musicname
            }
          })
          .then(res => {
            data.searchResult = res.data.map((item: any) => {
              item.name = item.title
              item.cover = item.pic
              item.like = false
              return item
            })
          })
          .finally(() => {
            data.loading = false
          })
      }
      const handleClick = async (item: AudioInfo, type: string) => {
        if (type === 'add') {
          const hasAudio = await audioDB.find({
            author: item.author,
            name: item.name,
            url: item.url
          })
          if (!hasAudio) {
            audioDB.add(item)
            player?.list.add(item)
            data.playList.push(item)
          } else {
            ElMessage.warning('该歌曲已存在播放列表中')
          }
        } else if (type === 'delete') {
          const hasAudio = await audioDB.find({
            author: item.author,
            name: item.name,
            url: item.url
          })
          const index = data.playList.findIndex(e => {
            return item.name === e.name && item.url === e.url
          })
          data.playList.splice(index, 1)
          player?.list?.remove(index)
          hasAudio?.id && audioDB.remove(hasAudio.id)
        } else if (type === 'play') {
          const index = data.playList.findIndex(e => {
            return item.name === e.name && item.url === e.url
          })
          if (index === -1) {
            data.playList.push(item)
            player?.list?.add(item)
            await audioDB.add(item)
            player?.list?.switch(data.playList.length - 1)
            player.play()
          } else {
            player?.list?.switch(index)
            player.play()
          }
        } else if (type === 'download') {
          axios({
            method: 'get',
            url: item.url,
            // 必须显式指明响应类型是一个Blob对象，这样生成二进制的数据，才能通过window.URL.createObjectURL进行创建成功
            responseType: 'blob'
          }).then(res => {
            if (!res) {
              return
            }
            // 将lob对象转换为域名结合式的url
            const blobUrl = window.URL.createObjectURL(res.data)
            const link = document.createElement('a')
            link.style.display = 'none'
            link.href = blobUrl
            // 设置a标签的下载属性，设置文件名及格式，后缀名最好让后端在数据格式中返回
            link.download = item.name + '-' + item.author
            // 自触发click事件
            link.dispatchEvent(new MouseEvent('click'))
            window.URL.revokeObjectURL(blobUrl)
          })
        }
      }
      const list = computed(() => {
        return data.listType === '搜索列表' ? data.searchResult : data.playList
      })
      return { ...toRefs(data), searchMusic, handleClick, list }
    }
  })
</script>

<style lang="scss">
  .music-container {
    padding-left: 50px;
    max-height: calc(100vh - 40px);
    overflow-y: auto;
  }
  .aplayer {
    position: absolute;
    width: 600px;
    bottom: 0;
    left: 40px;
  }
  .cover-image {
    width: 80px;
    height: 80px;
    border-radius: 8px;
  }
  #aplayer {
    z-index: 2000;
  }
  .table-icon {
    font-size: 20px;
    cursor: pointer;
    margin-right: 10px;
  }
  .like {
    color: #ffbe2a;
  }
</style>
