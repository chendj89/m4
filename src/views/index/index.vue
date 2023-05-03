<template>
  <n-grid cols="1 s:2 m:3 l:4 xl:6 2xl:7" responsive="screen">
    <n-grid-item v-for="item in data">
      <div class="card">
        <div class="card-content flex">
          <div class="card-logo">
            <storeIcon :src="item.src"></storeIcon>
          </div>
          <div class="card-title">
            <div class="card-title-name">{{ item.name }}</div>
            <div class="card-title-desc">{{ item.desc }}</div>
          </div>
        </div>
        <div class="card-footer">
          <div class="card-tool">
            <n-space>
              <rIconLink v-for="cell in item.options" :data="cell"></rIconLink>
            </n-space>
          </div>
        </div>
      </div>
    </n-grid-item>
  </n-grid>
</template>
<script lang="ts" setup>
import storeIcon from "@/unity/storeIcon";
import rIconImage from "@/unity/rIconImage";
import rIconButton from "@/unity/rIconButton";
import rIconUser from "@/unity/rIconUser";
import rIconLink from "@/unity/rIconLink";
import request from "@/utils/fetch";
import { listIssues } from "@/utils/issue";
defineOptions({
  name: "Index",
});
const list: any = ref([]);
onMounted(() => {
  init();
});
const labels = ref([]);
const data = ref([]);
const init = () => {
  listIssues({
    repo: "ii2",
  })
    .then((res) => res.json())
    .then((list: any) => {
      list.map((item: any) => {
        labels.value.push(item.labels[0]);
        if (item.title == "版本") {
          version.value = item.body;
        }
      });
      return list.filter((item: any) => item.title !== "版本");
    })
    .then((list) => {
      data.value = list.map((item: any) => {
        return {
          ...JSON.parse(item.body),
          name: item.title,
          number: item.number,
          src: JSON.parse(item.body).icon,
          options: [],
        };
      });
    })
    .finally(() => {
      request("GET /repos/{owner}/{repo}/issues/comments", {
        owner: "chendj89",
        repo: "ii2",
      })
        .then((res) => res.json())
        .then((comments) => {
          let list = comments.forEach((com) => {
            let body = JSON.parse(com.body);
            if (body.children) {
              console.log(body.children);
              body.options = body.children;
              body.options = body.options.map((item) => {
                return { ...item, src: item.icon };
              });
              let options = body.children.map((item: any) => {
                return {
                  label: item.name,
                  key: body.name + item.name,
                  url: item.url,
                  icon: () => rIconButton({ src: item.icon, disabled: true }),
                  children:item.children.map(o=>{
                    return {
                      label:o.name,
                      key:body.name+item.name+o.name,
                      url:o.url,
                      icon:() => rIconButton({ src: o.icon, disabled: true })
                    }
                  })
                };
              });
              options.unshift({
                name: body.name,
                key: "header",
                type: "render",
                render: () =>
                  rIconUser({
                    src: body.icon,
                    name: body.name,
                    desc: body.desc,
                  }),
              });
              body.options = options;
            }
            let t1 = {
              ...body,
              src: body.icon,
            };
            let parentId = com.issue_url.split("/").pop();
            let parent = data.value.find((da: any) => {
              return da.number == parentId;
            });
            parent && parent.options.push(t1);
          });
          localStorage.setItem("oList", JSON.stringify(data.value));
        });
    });
};
</script>

<style scoped></style>
