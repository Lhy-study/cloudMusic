<template>
  <RecommendVue/>
  <Hotplaylist/>
  <Newplaylist/>
  
</template>

<script setup lang="ts">
    import RecommendVue from "../components/Recommend.vue"
    import Hotplaylist from "../components/playlist/hotplatlist.vue"
    import Newplaylist from "../components/playlist/newplaylist.vue"
    document.title='主页'
</script>

<style>

</style>