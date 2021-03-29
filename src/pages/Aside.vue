<template>
  <div class="asside-container">
    <div
      v-for="(item, index) in menu"
      :key="item.type"
      :class="{ active: index === nowIndex }"
      @click="setMenu(index)"
    >
      <el-tooltip effect="dark" :content="item.text" placement="left">
        <i :class="item.icon"></i>
      </el-tooltip>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs, computed } from 'vue'
  import { useStore } from 'vuex'
  export default defineComponent({
    name: 'Aside',
    props: {
      show: Boolean
    },
    setup() {
      const store = useStore()
      const data = reactive({
        menu: [
          {
            icon: 'el-icon-setting',
            text: '设置',
            type: 'setting'
          },
          {
            icon: 'el-icon-folder-opened',
            text: '收藏',
            type: 'love'
          },
          {
            icon: 'el-icon-picture-outline-round',
            text: '股票',
            type: 'stock'
          },
          {
            icon: 'el-icon-headset',
            text: '音乐',
            type: 'music'
          },
          {
            icon: 'el-icon-video-play',
            text: '播放',
            type: 'player'
          },
          {
            icon: 'el-icon-video-camera',
            text: '视频',
            type: 'video'
          }
        ]
      })
      const nowIndex = computed(() => {
        return data.menu.findIndex(item => item.type === store.state.menu)
      })
      const setMenu = function(index: number) {
        store.commit('SET_MENU', data.menu[index].type)
      }
      return { ...toRefs(data), setMenu, nowIndex }
    }
  })
</script>

<style lang="scss">
  .asside-container {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column-reverse;
    height: 100vh;
    width: 40px;
    border-right: 1px solid #eee;
    padding: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    i {
      margin-right: 2px;
    }
    div {
      margin-bottom: 8px;
      cursor: pointer;
      height: 40px;
      color: #444;
      line-height: 40px;
      font-size: 20px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-weight: 400;
    }
    .active {
      color: #409eff;
    }
  }
</style>
