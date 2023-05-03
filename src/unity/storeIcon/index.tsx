import { NAvatar, NIcon } from "naive-ui";

/**
 * 1、可以接受svg、http
 */
export default defineComponent({
  name: "StoreIcon",
  props: {
    src: {
      type: String,
      default: () => "",
    },
    size: {
      type: Number || String,
      default: () => 28,
    },
  },
  setup(props, ctx) {
    let src: any = ref("");
    watch(
      () => props.src,
      (val) => {
        src.value = getSrc(val);
      }
    );
    const getSrc = (src: string) => {
      if (src) {
        let localSrc = localStorage.getItem(src);
        // 如果已保存了
        if (localSrc) {
          return localSrc;
        } else {
          if (src.startsWith("<svg")) {
            return src;
          } else if (src.startsWith("http")) {
            fetch(src)
              .then((res) => res.blob())
              .then((blob) => {
                if (blob.type == "image/svg+xml") {
                  let reader: any = new FileReader();
                  reader.readAsText(blob, "utf-8");
                  reader.onload = function () {
                    localStorage.setItem(
                      src,
                      reader.result.replace(/\"/gm, "'")
                    );
                  };
                } else {
                  localStorage.setItem(src, src);
                }
              });
            return src;
          } else {
            localStorage.setItem(src, src);
            return src;
          }
        }
      } else {
        return undefined;
      }
    };
    src.value = getSrc(props.src);
    return {
      src,
    };
  },
  render(props: any) {
    if (this.src) {
      if (this.src.startsWith("<svg")) {
        return h(NIcon, { innerHTML: this.src, size: props.size });
      } else {
        return h(NAvatar, {
          color: "transparent",
          src: this.src,
          size: props.size,
        });
      }
    }
  },
});
