<template>
  <div class="main-container">
    <ExceptionStatus status="500" />
  </div>
</template>

<script lang="ts" setup>
import ExceptionStatus from "./components/ExceptionStatus.vue";
defineOptions({
  name: "Page500",
});
</script>
