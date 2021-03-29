<template>
  <div id="nav">
    <Aside />
    <Frame />
    <Music v-show="menu === 'music'"/>
    <Film v-show="menu === 'video'"/>
    <Player v-show="menu === 'player'"/>
    <Stock v-show="menu === 'stock'"/>
    <Setting v-show="menu === 'setting'"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex'
import Aside from './pages/Aside.vue'
import Frame from './pages/Frame.vue'
import Music from './pages/Music.vue'
import Film from './pages/Film.vue'
import Player from './pages/Player.vue'
import Stock from './pages/Stock.vue'
import Setting from './pages/Setting.vue'
import { StateType } from './store'
export default defineComponent({
  name: 'App',
  components: {
    Aside, Frame, Music, Film, Player, Stock, Setting
  },
  setup() {
    const store = useStore<StateType>()
    const menu = computed(() => store.state.menu)
    return {
      menu
    }
  }
});
</script>

