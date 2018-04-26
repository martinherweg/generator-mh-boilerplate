<template><%_ if(projectUsage === 'vueapp' || projectVuePlugins.includes('vuerouter')) { -%>
  <div id="app">
    <router-view></router-view>
  </div>
<% } else { -%>
<div id="app" />
<%_ } -%></template>

<script>
export default {
  name: 'App',
};
</script>

<style lang="scss">
  #app {
    color: color('white');
  }
</style>
