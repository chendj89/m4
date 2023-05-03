<template>
  <div>
    <n-form>
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
        <n-input
          v-model:value="form.size"
          :allow-input="onlyAllowNumber"
        ></n-input>
      </n-form-item>
      <n-form-item label="标记">
        <n-input v-model:value="form.url"></n-input>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import { NTag, type SelectRenderTag } from "naive-ui";
import { randomString } from "@/utils";
defineOptions({
  name: "WorkPlace",
});

const form = ref({
  name: "",
  icon: "",
  desc: "",
  url: "",
  tag: "",
  size: "",
  badge: "",
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
</script>

<style lang="scss" scoped></style>
