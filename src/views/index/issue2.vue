<template>
  <div>
    <n-space>
      <n-button @click="createRepo">新建仓库</n-button>
      <n-button @click="deleteRepo">删除仓库</n-button>
    </n-space>
    <n-space class="mt-2">
      <n-button @click="createIssue">新建问题</n-button>
      <n-button @click="createComment">添加评论</n-button>
      <n-button @click="createSonComment">添加子评论</n-button>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import DataForm from "@/components/common/DataForm";
import type { DataFormType } from "@/types/components";
import { NButton, useDialog, useMessage, type CascaderOption } from "naive-ui";
import {
  optionsItem,
  formConfig,
  buttonAction,
  badgeType,
  treeFindPath,
} from "./ts/issue";
import request from "@/utils/fetch";
defineOptions({
  name: "Issue2",
});
const dialog = useDialog();
const message = useMessage();
const createRepo = () => {
  const dataRef = ref<DataFormType | null>(null);
  const loading = ref(false);
  const repoDialog = dialog.create({
    title: "新建仓库",
    content: () =>
      h(DataForm, {
        ref: dataRef,
        options: [optionsItem({ label: "仓库", key: "repo" })],
        formConfig: formConfig,
      }),
    action: () =>
      buttonAction("创建", () => {
        let { repo } = dataRef.value?.generatorParams();
        if (dataRef.value?.validator()) {
          if (!dataRef.value.loading) {
            dataRef.value.loading = true;
            request("POST /user/repos", {
              body: JSON.stringify({
                name: repo,
              }),
            }).then((res) => {
              if (res.status == 201) {
                message.success("仓库创建成功");
                repoDialog.destroy();
              } else {
                res.json().then((error) => {
                  message.error(error.message);
                });
              }
              dataRef.value.loading = false;
            });
          }
        }
      }),
  });
};
const deleteRepo = () => {
  const dataRef = ref<DataFormType | null>(null);
  const loading = ref(false);
  const repoDialog = dialog.create({
    title: "删除仓库",
    content: () =>
      h(DataForm, {
        ref: dataRef,
        options: [optionsItem({ label: "仓库", key: "repo" })],
        formConfig: formConfig,
      }),
    action: () =>
      buttonAction("删除", () => {
        let { repo } = dataRef.value?.generatorParams();
        if (dataRef.value?.validator()) {
          if (!dataRef.value.loading) {
            dataRef.value.loading = true;
            request(`DELETE /repos/{owner}/{repo}`, {
              owner: "chendj89",
              repo: repo,
            }).then((res) => {
              if (res.status == 204) {
                message.success("仓库删除成功");
                repoDialog.destroy();
              } else {
                res.json().then((error) => {
                  message.error(error.message);
                });
              }
              dataRef.value.loading = false;
            });
          }
        }
      }),
  });
};
const repo = {
  owner: "chendj89",
  repo: "ii2",
};

/**
 * 获取所有问题
 */
const getIssue = async () => {
  let issues = localStorage.getItem("issues");
  if (issues) {
    return JSON.parse(issues);
  } else {
    return request("GET /repos/{owner}/{repo}/issues", {
      ...repo,
    })
      .then((res) => res.json())
      .then((res) => {
        let list = res.map((item: any) => {
          return {
            label: item.title,
            value: item.number,
            icon: JSON.parse(item.body).icon,
          };
        });
        if (list) {
          localStorage.setItem("issues", JSON.stringify(list));
        }
        return list;
      });
  }
};
/**
 * 获取指定问题下的评论
 */
const getAllComment = async () => {
  return request("GET /repos/{owner}/{repo}/issues/comments", {
    ...repo,
  })
    .then((res) => res.json())
    .then((data) => {
      let list = data.map((item) => {
        // id
        const body = JSON.parse(item.body);
        console.log("body", body);
        return {
          label: body.name,
          value: item.id,
          icon: body.icon,
          body: body,
          id:item.id,
          children: body.children
            ? body.children.map((cell) => {
                return {
                  label: cell.name,
                  value: cell.name,
                  icon: cell.icon,
                };
              })
            : null,
        };
      });
      return list;
    });
};
/**
 * 获取指定问题下的评论
 */
const getComment = async (issue_number: number) => {
  return request("GET /repos/{owner}/{repo}/issues/{issue_number}/comments", {
    ...repo,
    issue_number,
  })
    .then((res) => res.json())
    .then((res) => {
      let list = res.map((item: any, index: number) => {
        let body = JSON.parse(item.body);
        return {
          label: body.name,
          value: item.id,
          icon: body.icon,
          body: body,
          isLeaf: false,
          children: body.children.map((child) => {
            return {
              label: child.name,
              value: child.name,
              icon: child.icon,
            };
          }),
        };
      });
      return list;
    });
};

const createIssue = () => {
  const dataRef = ref<DataFormType | null>(null);
  const loading = ref(false);
  const repoDialog = dialog.create({
    title: "新建问题",
    content: () =>
      h(DataForm, {
        ref: dataRef,
        options: [
          optionsItem({ label: "标题", key: "name" }),
          optionsItem({
            label: "图标",
            key: "icon",
            renderConfig: {
              prefix: true,
            },
          }),
          optionsItem({ label: "链接", key: "url" }),
          optionsItem({ label: "描述", key: "desc" }),
          optionsItem({
            label: "标签",
            key: "labels",
            renderConfig: {
              type: "renderSelect",
              options: [
                {
                  label: "菜单",
                  value: "menu",
                },
              ],
            },
          }),
        ],

        formConfig: formConfig,
      }),
    action: () =>
      buttonAction("创建", () => {
        let { name, labels = "", ...rest } = dataRef.value?.generatorParams();
        if (dataRef.value?.validator()) {
          if (!dataRef.value.loading) {
            dataRef.value.loading = true;
            request("POST /repos/{owner}/{repo}/issues", {
              ...repo,
              body: JSON.stringify({
                title: name,
                labels: [labels],
                body: JSON.stringify(
                  {
                    name,
                    ...rest,
                  },
                  null,
                  2
                ),
              }),
            }).then((res) => {
              if (res.status == 201) {
                message.success("问题创建成功");
                localStorage.removeItem("issues");
                repoDialog.destroy();
              } else {
                res.json().then((error) => {
                  message.error(error.message);
                });
              }
              dataRef.value.loading = false;
            });
          }
        }
      }),
  });
};
const createComment = async () => {
  const dataRef = ref<DataFormType | null>(null);
  const loading = ref(false);
  let issues = await getIssue();
  const repoDialog = dialog.create({
    title: "新建评论1级",
    content: () =>
      h(DataForm, {
        ref: dataRef,
        options: [
          optionsItem({ label: "名称", key: "name" }),
          optionsItem({
            label: "图标",
            key: "icon",
            renderConfig: {
              prefix: true,
            },
          }),
          optionsItem({ label: "链接", key: "url" }),
          optionsItem({
            label: "描述",
            key: "desc",
          }),
          optionsItem({
            label: "问题",
            key: "labels",
            renderConfig: {
              type: "renderSelect",
              options: issues,
              tag: true,
            },
          }),
          // optionsItem({ label: "标记", key: "badge", required: false }),
          // optionsItem({
          //   label: "类型",
          //   key: "badgeType",
          //   required: false,
          //   renderConfig: {
          //     type: "renderSelect",
          //     options: badgeType,
          //   },
          // }),
        ],
        formConfig: formConfig,
      }),
    action: () =>
      buttonAction("添加", () => {
        let { name, labels = [], ...rest } = dataRef.value?.generatorParams();
        if (dataRef.value?.validator()) {
          if (!dataRef.value.loading) {
            dataRef.value.loading = true;
            request(
              "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
              {
                ...repo,
                issue_number: labels,
                body: JSON.stringify({
                  body: JSON.stringify(
                    {
                      name,
                      ...rest,
                    },
                    null,
                    2
                  ),
                }),
              }
            ).then((res) => {
              if (res.status == 201) {
                message.success("问题评论成功");
                repoDialog.destroy();
              } else {
                res.json().then((error) => {
                  message.error(error.message);
                });
              }
              dataRef.value.loading = false;
            });
          }
        }
      }),
  });
};

let t1 = ref([{ label: 1, value: 1, isLeaf: false }]);

const createSonComment = async () => {
  const dataRef = ref<DataFormType | null>(null);
  const loading = ref(false);
  let comment_id = 2;
  // let comments = await getComment(2);
  const options: any = ref([]);
  const repoDialog = dialog.create({
    title: "新建子评论",
    onAfterEnter: () => {
      dataRef.value.loading = true;
      getAllComment().then((list) => {
        options.value = list;
        dataRef.value.loading = false;
      });
    },
    content: () =>
      h(DataForm, {
        ref: dataRef,
        options: [
          optionsItem({ label: "名称", key: "name" }),
          optionsItem({
            label: "图标",
            key: "icon",
            renderConfig: {
              prefix: true,
            },
          }),
          optionsItem({ label: "链接", key: "url" }),
          optionsItem({
            label: "描述",
            key: "desc",
          }),
          optionsItem({
            label: "问题",
            key: "labels",
            renderConfig: {
              type: "renderCascader",
              options: options.value,
              tag: true,
            },
          }),
          // optionsItem({ label: "标记", key: "badge", required: false }),
          // optionsItem({
          //   label: "类型b2",
          //   key: "b2",
          //   required: false,
          //   renderConfig: {
          //     type: "renderCascader",
          //     options: comments,
          //     tag: true,
          //     onload: (option: CascaderOption) => {
          //       return new Promise((resolve) => {
          //         let list = [];
          //         list = option.body.children.map((item: any) => {
          //           return {
          //             label: item.name,
          //             value: item.name,
          //             isLeaf: true,
          //             icon: item.icon,
          //           };
          //         });
          //         option.children = list;
          //         resolve(true);
          //       });
          //     },
          //   },
          // }),
          // optionsItem({
          //   label: "问题2",
          //   key: "badgeType",
          //   required: false,
          //   renderConfig: {
          //     type: "renderSelect",
          //     options: badgeType,
          //   },
          // }),
        ],
        formConfig: formConfig,
      }),
    action: () =>
      buttonAction("添加", () => {
        let { name, labels = "", ...rest } = dataRef.value?.generatorParams();
        if (dataRef.value?.validator()) {
          if (!dataRef.value.loading) {
            dataRef.value.loading = true;
            let result = treeFindPath(
              options.value,
              (data) => data.value == labels,
              "value"
            );
            if(result.length>1){
              let first=result[0]
              let last=result[result.length-1];
              if(!last.children){
                last.children=[]
              }
              last.children.push({
                name,
                ...rest
              })
              
            }
            request(
              "PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}",
              {
                ...repo,
                comment_id:result[0].id,
                body: JSON.stringify({
                  body: JSON.stringify(result[0], null, 2),
                }),
              }
            ).then((res) => {
              if (res.status == 200) {
                message.success("添加子评论成功");
                repoDialog.destroy();
              } else {
                res.json().then((error) => {
                  message.error(error.message);
                });
              }
              dataRef.value.loading = false;
            });
          }
        }
      }),
  });
};
</script>

<style scoped></style>
