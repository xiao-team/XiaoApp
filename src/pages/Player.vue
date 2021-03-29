<template>
  <div class="player-container">
    <el-link type="primary" @click="playVideoOnline" class="tips">无法播放？试试点击前往网页端观看</el-link>
    <div id="dplayer"></div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, reactive, toRefs, onMounted } from 'vue'
  import { shell } from 'electron'
  import Bus from '../eventBus'
  // @ts-ignore
  import DPlayer from 'dplayer'
  let dp: any = null, videoUrl = ""
  export default defineComponent({
    setup() {
      onMounted(() => {
        dp = new DPlayer({
          container: document.getElementById('dplayer'),
          autoplay: true,
          video: {
            // url: 'https://d.mhqiyi.com/20210113/5IeUy2mW/index.m3u8',
            url: '',
            type: 'auto'
          },
          pluginOptions: {
            hls: {
              // hls config
            }
          }
        })
        Bus.$on('play', (data: any) => {
          videoUrl = data.url
          dp.switchVideo && dp.switchVideo({
            url: data.url
          })
          dp.play()
        })
      })
      const playVideoOnline = () => {
        const url = 'https://zxpsuper.gitee.io/zxpsuper.gitee.io/index.html?url=' + btoa(videoUrl)
        shell.openExternal(url)
      }
      return {
        playVideoOnline
      }
    }
  })
</script>

<style lang="scss" scoped>
  .player-container {
    padding-left: 50px;
    padding-right: 16px;
  }
  #dplayer {
    width: 100%;
    height: calc(100vh - 80px);
  }
  .tips {
    // position: absolute;
    // top: 0;
    margin-bottom: 8px;
  }
</style>
