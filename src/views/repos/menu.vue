<template>
  <div>
    <n-form label-placement="left">
      <n-form-item label="名称">
        <n-input v-model:value="form.name"></n-input>
      </n-form-item>
      <n-form-item label="图标">
        <n-input v-model:value="form.icon"></n-input>
      </n-form-item>
      <n-form-item label="描述">
        <n-input v-model:value="form.desc"></n-input>
      </n-form-item>
      <n-form-item label="链接">
        <n-input v-model:value="form.url"></n-input>
      </n-form-item>
      <n-form-item label="标签">
        <n-select
          multiple
          v-model:value="form.tag"
          :render-tag="renderTag"
          :options="tags"
        ></n-select>
      </n-form-item>
      <n-form-item label="大小">
        <n-select v-model:size="form.size" :options="sizes" />
      </n-form-item>
      <n-form-item label="排序">
        <n-input
          v-model:value="form.sort"
          :allow-input="onlyAllowNumber"
        ></n-input>
      </n-form-item>
      <n-form-item label="标记">
        <n-input v-model:value="form.badge"></n-input>
      </n-form-item>
    </n-form>
    <n-button @click="submit">提交</n-button>
  </div>
</template>

<script lang="ts" setup>
import { NTag, type SelectRenderTag } from "naive-ui";
import { randomString } from "@/utils";
import useAppConfigStore from "@/store/modules/app-config";
const appConfig = useAppConfigStore();
defineOptions({
  name: "Menu",
});

const form = ref({
  name: "",
  icon: "",
  desc: "",
  url: "",
  tag: "",
  size: "",
  badge: "",
  sort: "",
  uuid: randomString(6),
});
const tags = [
  {
    label: "菜单",
    value: "menu",
    type: "success",
  },
  {
    label: "版本",
    value: "version",
    type: "warning",
  },
];
const sizes = [
  {
    label: 48,
    value: 48,
  },
  {
    label: 28,
    value: 28,
  },
  {
    label: 24,
    value: 24,
  },
  {
    label: 20,
    value: 20,
  },
];
const renderTag: SelectRenderTag = ({ option, handleClose }) => {
  return h(
    NTag,
    {
      type: option.type as "success" | "warning",
      closable: true,
      onMousedown: (e: FocusEvent) => {
        e.preventDefault();
      },
      onClose: (e: MouseEvent) => {
        e.stopPropagation();
        handleClose();
      },
    },
    { default: () => option.label }
  );
};
const onlyAllowNumber = (value: string) => !value || /^\d+$/.test(value);

const submit = () => {
  
};
</script>

<style lang="scss" scoped></style>
