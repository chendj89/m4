interface Menu {
  name: string;
  desc: string;
  url: string;
  icon: string;
  children?: Menu[];
  [x: string]: any;
}

let zhibo: Menu = {
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
