import { LAYOUT } from "@/store/keys";

export const asyncRoutes = [
  {
    path: "/index",
    component: LAYOUT,
    name: "Index",
    meta: {
      title: "控制台",
      iconPrefix: "icon",
      icon: "dashboard",
    },
    redirect:"/index/index",
    children: [
      {
        path: "index",
        name: "Index",
        component: () => import("@/views/index/index.vue"),
        meta: {
          title: "首页",
          affix: true,
          cacheable: true,
          iconPrefix: "icon",
          icon: "menu",
        },
      },
      {
        path: "home",
        name: "Home",
        component: () => import("@/views/index/main.vue"),
        meta: {
          title: "主控台",
          affix: true,
          cacheable: true,
          iconPrefix: "icon",
          icon: "menu",
          refresh: ["menu"],
        },
      },
      {
        path: "work-place",
        name: "WorkPlace",
        component: () => import("@/views/index/work-place.vue"),
        meta: {
          title: "工作台",
          affix: true,
          cacheable: true,
          iconPrefix: "icon",
          icon: "menu",
        },
      },
      {
        path: "issue",
        name: "Issue",
        component: () => import("@/views/index/issue.vue"),
        meta: {
          title: "仓库",
          affix: true,
          cacheable: true,
          iconPrefix: "icon",
          icon: "menu",
        },
      },
      {
        path: "issue2",
        name: "Issue2",
        component: () => import("@/views/index/issue2.vue"),
        meta: {
          title: "仓库2",
          affix: true,
          cacheable: true,
          iconPrefix: "icon",
          icon: "menu",
        },
      },
    ],
  },
  {
    path: "/repos",
    component: LAYOUT,
    name: "Repos",
    meta: {
      title: "仓库",
      iconPrefix: "icon",
      icon: "tools",
    },
    children: [
      {
        path: "menu",
        name: "Menu",
        component: () => import("@/views/repos/menu.vue"),
        meta: {
          title: "菜单",
          iconPrefix: "icon",
          icon: "menu",
        },
      },
    ],
  },
];
