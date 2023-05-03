export default [
  {
    menuUrl: "/index",
    menuName: "Dashborad",
    routeName: "dashborad",
    icon: "icon-dashboard",
    parentPath: "",
    children: [
      {
        parentPath: "/index",
        menuUrl: "/index/index",
        menuName: "首页",
        routeName: "Index",
      },
      {
        parentPath: "/index",
        menuUrl: "/index/home",
        menuName: "主控台",
        routeName: "home",
      },
      {
        parentPath: "/index",
        menuUrl: "/index/work-place",
        menuName: "工作台",
        routeName: "workPlace",
      },
      {
        parentPath: "/index",
        menuUrl: "/index/issue",
        menuName: "仓库",
        routeName: "issue",
      },
      {
        parentPath: "/index",
        menuUrl: "/index/issue2",
        menuName: "仓库2",
        routeName: "issue2",
      },
    ],
  },
];
