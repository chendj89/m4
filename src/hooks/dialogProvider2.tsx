import { Fragment, Teleport } from "vue";

export default defineComponent({
  name: "DialogProvider2",
  setup() {
    let index = 0;
    const dialogListRef = ref<any[]>([]);
    const create = (options: any) => {
      let com = null;
      if (options.temp) {
        com = options.temp;
      }
      const key = index++;
      const dialogReactive = reactive({
        ...options,
        key,
        com,
        destory: () => {},
      });
      dialogListRef.value.push(dialogReactive);
      return new Promise((resolve) => {
        resolve(dialogReactive);
      });
    };
    const api = {
      create,
      success: (options: any) => {
        console.log(options, "success");
        return create({ ...options, type: "suceess" });
      },
    };
    provide("dialogApiInjectionKey", api);
    return {
      ...api,
      dialogList: dialogListRef,
    };
  },
  render() {
    if (this.dialogList.length) {
      return h(Fragment, null, [
        h(Teleport, { to: "body" }, [
          this.dialogList.map((item) => h(defineAsyncComponent(item.com))),
        ]),
        this.$slots.default?.(),
      ]);
    } else {
      return h(Fragment, null, [this.$slots.default?.()]);
    }
  },
});
