<template>
  <div>
    <NDataTable :columns="columns" :data="list"></NDataTable>
  </div>
</template>
<script lang="ts" setup>
import storeIcon from "@/unity/storeIcon";
import { NA, NDataTable } from "naive-ui";
defineOptions({
  name: "Home",
});
const columns = [
  {
    title: "名称",
    key: "name",
  },
  {
    title: "图标",
    key: "icon",
    render: (item: any) => {
      return h(storeIcon, { size: 20, src: item.icon });
    },
  },
  {
    title: "描述",
    key: "desc",
  },
  {
    title: "链接",
    key: "url",
    render: (item: any) => {
      if (item.url) {
        return h(
          NA,
          { href: item.url, target: "_blank" },
          { default: () => "链接" }
        );
      } else {
        return "--";
      }
    },
  },
  {
    title: "图标大小",
    key: "size",
  },
  {
    title: "标记",
    key: "badge",
  },
  {
    title: "上下文菜单",
    key: "dropdown",
  },
];
const list = [
  {
    name: "九转灵山",
    icon: "https://chendj89.github.io/chendj89/assets/xiaochou.jpg",
    url: "https://chendj89.github.io/v12/",
    desc: "哈哈",
    size: 20,
    badge: "",
    dropdown: "",
    children: [
      {
        name: "双刃战意",
        icon: "https://chendj89.github.io/chendj89/assets/xiaochou.jpg",
        url: "https://chendj89.github.io/v12/",
        desc: "哈哈",
        size: 24,
        badge: "",
        dropdown: "",
      },
    ],
  },
];
</script>

<style scoped></style>
