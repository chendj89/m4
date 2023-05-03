<template>
  <div>
    <div class="pt-2 pb-2">
      <n-space :size="12">
        <n-button type="success" @click="add">添加issue</n-button>
      </n-space>
    </div>
    <n-data-table
      :columns="columns"
      :data="data"
      :row-key="(item) => item.data.id"
    ></n-data-table>
  </div>
</template>

<script setup lang="ts">
const repo = "z1";
import type { DataFormType, FormItem } from "@/types/components";
import { Fragment, defineComponent, ref } from "vue";
import {
  renderCheckbox,
  renderCheckboxGroup,
  renderDatePicker,
  renderInput,
  renderPopSelect,
  renderSelect,
  renderSwitch,
  renderTimePicker,
} from "@/hooks/form";
import {
  createRepo,
  delRepo,
  createIssue,
  updateVersion,
  type Menu,
  listIssues,
} from "@/utils/issue";
import {
  NButton,
  NEl,
  NForm,
  NFormItem,
  NInput,
  NSpace,
  NSwitch,
  useDialog,
  useMessage,
  type FormProps,
} from "naive-ui";
import DataForm from "@/components/common/DataForm";
import request from "@/utils/fetch";
import storeIcon from "@/unity/storeIcon";
import IcOutlineAdd from "~icons/ic/outline-add";
import rIconLink from "@/unity/rIconLink";
import rIconUser from "@/unity/rIconUser";
import rIconButton from "@/unity/rIconButton";
defineOptions({
  name: "Issue",
});
const version=ref("");
const emit = defineEmits(["update:modelValue"]);
const columns: any = [
  {
    title: "名称",
    key: "name",
  },
  {
    title: "描述",
    key: "desc",
  },
  {
    title: "图标",
    key: "icon",
    render: (row) => {
      return h(storeIcon, { src: row.icon });
    },
  },
  {
    title: "图集",
    key: "id",
    render: (row: any) => {
      if (row?.children) {
        let options = row.children.map((item: any) => {
          return {
            label: item.name,
            key: row.name + item.name,
            url: item.url,
            icon: () => rIconButton({ src: item.icon, disabled: true }),
          };
        });
        options.unshift({
          name: row.name,
          key: "header",
          type: "render",
          render: () =>
            rIconUser({
              src: row.icon,
              name: row.name,
              desc: row.desc,
            }),
        });
        const data2 = {
          name: "",
          url: "http://www.baidu.com",
          src: row.icon,
          size: 28,
          badge: { value: row.badge ? "1" : "0", type: "success" },
          dropdown: "width:200px;",
          options: options,
        };
        return h(rIconLink, { data: data2 });
      }
      return null;
    },
  },
  {
    key: "option",
    title: (column: any) => {
      return h(NSpace, { style: { fontSize: "24px" } }, () => [
        h(IcOutlineAdd, {}),
      ]);
    },
    render(row) {
      return row.children
        ? h(NSpace, {}, () => [
            h(
              NButton,
              { size: "small", type: "success", onClick: () => addMenu(row) },
              { default: () => "添加菜单" }
            ),
            h(
              NButton,
              { size: "small", type: "info", onClick: () => updateMenu(row) },
              { default: () => "更新菜单" }
            ),
            h(
              NButton,
              { size: "small", type: "error", onClick: () => closeMenu(row) },
              { default: () => "关闭菜单" }
            ),
          ])
        : h(NSpace, {}, () => [
            h(
              NButton,
              { size: "small", type: "success", onClick: () => editMenu(row) },
              { default: () => "编辑" }
            ),
            h(
              NButton,
              { size: "small", type: "error", onClick: () => delMenu(row) },
              { default: () => "删除" }
            ),
          ]);
    },
  },
];
const data = ref([]);

const labels = ref([]);

const init = () => {
  listIssues({
    repo,
  })
    .then((res) => res.json())
    .then((list: any) => {
      list.map((item: any) => {
        item.labels;
        labels.value.push(item.labels[0]);
        if(item.title=="版本"){
          version.value=item.body
        }
      });
      return list.filter((item: any) => item.title !== "版本");
    })
    .then((list) => {
      data.value = list.map((item: any) => {
        return {
          ...JSON.parse(item.body),
          name: item.title,
          data: item,
          children: [],
        };
      });
    })
    .finally(() => {
      request("GET /repos/{owner}/{repo}/issues/comments", {
        owner: "chendj89",
        repo: repo,
      })
        .then((res) => res.json())
        .then((comments) => {
          let list = comments.forEach((com) => {
            let t1 = {
              ...JSON.parse(com.body),
              data: com,
            };
            let parentId = com.issue_url.split("/").pop();
            let parent = data.value.find((da: any) => {
              return da.data.number == parentId;
            });
            parent && parent.children.push(t1);
          });
          localStorage.setItem("oList",JSON.stringify(data.value))
        });
    });
};
onMounted(() => {
  init();
});
const dialog = useDialog();


const add = (row: any) => {
  let dataRef: any = ref(null);
  let dialogIns = dialog.create({
    title: "添加",
    content: () =>
      h(NEl, {}, () => [
        h(DataForm, {
          ref: dataRef,
          options: formItems(),
          formConfig: formConfig,
        }),
        h(
          NButton,
          {
            size: "small",
            type: "success",
            onClick: () => {
              if (dataRef.value?.validator()) {
                submitLoading.value = true;
                let params = dataRef.value?.generatorParams();
                console.log("params=>", params);
                request("POST /repos/{owner}/{repo}/issues", {
                  owner: "chendj89",
                  repo: repo,
                  body: JSON.stringify({
                    title: params.name,
                    labels: [params.tag],
                    body: JSON.stringify(params, null, 2),
                  }),
                }).then((res) => {
                  submitLoading.value = false;
                  dialogIns.destroy();
                  
                  // updateVersion({
                  //   repo: "z1",
                  //   body: "1.0.1",
                  // });

                  init();
                });
              }
            },
          },
          () => "确定"
        ),
      ]),
  });
};
const addMenu = (row) => {
  let dataRef: any = ref(null);
  let dialogIns: any = dialog.create({
    title: "添加菜单",
    content: () =>
      h(NEl, {}, () => [
        h(DataForm, {
          ref: dataRef,
          options: formItems(),
          formConfig: formConfig,
        }),
        h(
          NButton,
          {
            size: "small",
            type: "success",
            onClick: () =>
              submit(dataRef, row, () => {
                dialogIns.destroy();
              }),
          },
          () => "确定"
        ),
      ]),
  });
};
const editMenu = (row) => {
  let dataRef: any = ref(null);
  let dialogIns = dialog.create({
    title: "添加",
    content: () =>
      h(NEl, {}, () => [
        h(DataForm, {
          ref: dataRef,
          options: formItems(row),
          formConfig: formConfig,
        }),
        h(
          NButton,
          {
            size: "small",
            type: "success",
            onClick: () => {
              console.log(row);
              if (dataRef.value?.validator()) {
                submitLoading.value = true;
                request(
                  "PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}",
                  {
                    owner: row.data.user.login,
                    repo: repo,
                    comment_id: row.data.id,
                    body: JSON.stringify({
                      body: JSON.stringify(dataRef.value?.generatorParams()),
                    }),
                  }
                ).then((res) => {
                  submitLoading.value = false;
                  dialogIns.destroy();
                  init();
                });
              }
            },
          },
          () => "确定"
        ),
      ]),
  });
};
const delMenu = (row) => {
  let dataRef: any = ref(null);
  let dialogIns = dialog.create({
    title: "删除",
    content: () =>
      h(NEl, {}, () => [
        h(DataForm, {
          ref: dataRef,
          options: formItems(row),
          formConfig: formConfig,
        }),
        h(
          NButton,
          {
            size: "small",
            type: "success",
            onClick: () => {
              console.log(row);
              if (dataRef.value?.validator()) {
                submitLoading.value = true;
                request(
                  "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}",
                  {
                    owner: row.data.user.login,
                    repo: repo,
                    comment_id: row.data.id,
                  }
                ).then((res) => {
                  submitLoading.value = false;
                  dialogIns.destroy();
                  init();
                });
              }
            },
          },
          () => "确定"
        ),
      ]),
  });
};
const updateMenu = (row) => {
  let dataRef: any = ref(null);
  let dialogIns: any = dialog.create({
    title: "更新菜单",
    content: () =>
      h(NEl, {}, () => [
        h(DataForm, {
          ref: dataRef,
          options: formItems(row),
          formConfig: formConfig,
        }),
        h(
          NButton,
          {
            size: "small",
            type: "success",
            onClick: () => {
              if (dataRef.value?.validator()) {
                submitLoading.value = true;
                request("PATCH /repos/{owner}/{repo}/issues/{issue_number}", {
                  owner: "chendj89",
                  repo: repo,
                  issue_number: row.data.number,
                  body: JSON.stringify({
                    body: JSON.stringify(dataRef.value?.generatorParams()),
                  }),
                }).then((res) => {
                  submitLoading.value = false;
                  dialogIns.destroy();
                  init();
                });
              }
            },
          },
          () => "确定"
        ),
      ]),
  });
};
const closeMenu = (row) => {
  let dataRef: any = ref(null);
  let dialogIns: any = dialog.create({
    title: "关闭菜单",
    content: () =>
      h(NEl, {}, () => [
        h(DataForm, {
          ref: dataRef,
          options: formItems(row),
          formConfig: formConfig,
        }),
        h(
          NButton,
          {
            size: "small",
            type: "success",
            onClick: () => {
              if (dataRef.value?.validator()) {
                submitLoading.value = true;
                request("PATCH /repos/{owner}/{repo}/issues/{issue_number}", {
                  owner: "chendj89",
                  repo: repo,
                  issue_number: row.data.number,
                  body: JSON.stringify({
                    body: JSON.stringify(dataRef.value?.generatorParams()),
                    state: "closed",
                  }),
                }).then((res) => {
                  submitLoading.value = false;
                  dialogIns.destroy();
                  init();
                });
              }
            },
          },
          () => "确定"
        ),
      ]),
  });
};
const message = useMessage();
const dataForm = ref<DataFormType | null>(null);
const formItems = (row) =>
  [
    {
      label: "名称",
      key: "name",
      required: true,
      value: ref(row?.name || null),
      render: (formItem) =>
        renderInput(formItem.value, {
          placeholder: "请输入名称",
          clearable: true,
        }),
      validator: (formItem, message) => {
        if (!formItem.value.value) {
          message.error("请输入名称");
          return false;
        }
        return true;
      },
    },
    {
      label: "链接",
      key: "url",
      required: true,
      value: ref(row?.url || null),
      render: (formItem) =>
        renderInput(formItem.value, {
          placeholder: "请输入链接",
          clearable: true,
        }),
      validator: (formItem, message) => {
        if (!formItem.value.value) {
          message.error("请输入链接");
          return false;
        }
        return true;
      },
    },
    {
      label: "图标",
      key: "icon",
      required: true,
      value: ref(row?.icon || null),
      render: (formItem) =>
        renderInput(
          formItem.value,
          {
            placeholder: "请输入图标",
            clearable: true,
          },
          { prefix: () => h(storeIcon, { src: formItem.value.value }) }
        ),
      validator: (formItem, message) => {
        if (!formItem.value.value) {
          message.error("请输入图标");
          return false;
        }
        return true;
      },
    },
    {
      label: "标记",
      key: "tag",
      required: true,
      value: ref(row?.menu || "menu"),
      optionItems: [
        { label: "版本", value: "version" },
        { label: "菜单", value: "menu" },
      ],
      render: (formItem) =>
        renderSelect(formItem.value, formItem.optionItems as SelectOption[], {
          placeholder: "请选标记",
          clearable: true,
        }),
    },
    {
      label: "固定",
      key: "badge",
      value: ref(row?.badge || false),
      render: (formItem) => renderSwitch(formItem.value),
    },
    {
      label: "描述",
      key: "desc",
      value: ref(row?.desc || null),
      render: (formItem) =>
        renderInput(formItem.value, {
          placeholder: "请输入描述",
          type: "textarea",
          rows: 3,
        }),
    },
  ] as FormItem[];

const formConfig = {
  labelWidth: 60,
  size: "medium",
  labelAlign: "right",
} as FormProps;
const submitLoading = ref(false);
const show = ref(true);
function submit(elRef: any, row: any, cb) {
  if (elRef.value?.validator()) {
    submitLoading.value = true;
    request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
      owner: row.data.user.login,
      repo: repo,
      issue_number: row.data.number,
      body: JSON.stringify({
        body: JSON.stringify(elRef.value?.generatorParams()),
      }),
    }).then((res) => {
      submitLoading.value = false;
      cb && cb();
      init();
    });
  }
}
// 创建仓库
// createRepo("z1")

// 删除仓库
// delRepo("z1");

// 创建问题
// createIssue({
//     repo:'z1',
//     title:"版本",
//     body:'1.0.0',
//     labels:['version']
//   })

// 更新版本
// updateVersion({
//   repo: "z1",
//   body: "1.0.1",
// });

// 创建问题
// createIssue({
//   repo: repo,
//   title: "技术",
//   body: {
//     name: "哈哈",
//     url: "https://chendj89.github.io/v12/",
//     desc: "哈哈",
//     icon: "https://api.iconify.design/logos:adobe-photoshop.svg?color=%2302dbf7",
//     sort: 1,
//     badge: "",
//   },
//   labels: ["menu"],
// });
</script>

<style scoped></style>
