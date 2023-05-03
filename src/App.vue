<template>
  <n-notification-provider>
    <n-message-provider>
      <router-view />
    </n-message-provider>
  </n-notification-provider>
</template>
<script lang="ts" setup>
defineOptions({
  name: "App",
});
</script>
