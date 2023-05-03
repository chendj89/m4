let zhibo = {
  name: "直播",
  desc: "",
  url: "",
  icon: "",
  children: [
    {
      name: "B站",
      desc: "",
      url: "",
      icon: "",
      children: [
        {
          name: "帅大头",
          desc: "",
          url: "",
          icon: "",
          children: [
            {
              name: "西游",
              desc: "",
              url: "",
              icon: "",
            },
          ],
        },
      ],
    },
  ],
};

/**
 * 根据子节点数据获取所有父节点数据
 * @param {any[]} tree 多维数组
 * @param {*} func 自定义判断函数
 * @param {*} field 取多维数组的哪个属性来对比
 * @param {*} path 存储结果
 * @returns 
 */
function treeFindPath(tree, func, field = "", path = []) {
  if (!tree) return [];
  for (const data of tree) {
    // 二选一 返回完整节点
    // path.push(data) 
    // 二选一 
    field === "" ? path.push(data) : path.push(data[field]);
    if (func(data)) return path;
    if (data.children) {
      const findChildren = treeFindPath(data.children, func, field, path);
      if (findChildren.length) return findChildren;
    }
    path.pop();
  }
  return [];
}
const cId = "西游";
let arr = treeFindPath([zhibo], (data) => data.name === cId, "name");
console.log(arr);
//  ['直播', 'B站', '帅大头', '西游']
