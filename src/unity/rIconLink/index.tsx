import { NA, NAvatar, NBadge, NDropdown } from "naive-ui";
import {
  defineComponent,
  nextTick,
  ref,
  type PropType,
  Fragment,
  h,
} from "vue";
import rIconImage from "@/unity/rIconImage";
import { http } from "@/utils/regExp";

interface iUserInfo {
  /**
   * 用户名
   */
  name: string;
  /**
   * 图片
   */
  src: string;
  /**
   * 链接
   */
  url: string;
  /**
   * 图标大小
   */
  size: number | string;
  dropdown: string;
  /**
   * 上下菜单数据
   */
  options: any[];
  [x: string]: any;
}
/**
 * 图标链接
 * @param {object} data
 * @param {string} data.name 用户名
 * @param {string} data.src 图片
 * @param {string} data.url 链接
 * @param {string} data.options 上下菜单数据
 */
export default defineComponent({
  name: "RIconLink",
  props: {
    /**
     * 数据
     */
    data: {
      required: true,
      type: Object as PropType<iUserInfo>,
      default: {
        name: "",
        src: "",
        size: 24,
        dropdown: "width:200px;",
        options: [],
      },
    },
  },
  components: {
    rIconImage,
  },
  setup(props) {
    // 变量
    const x = ref(0);
    const y = ref(0);
    const show = ref(false);
    const options: any[] = [];
    // 函数

    // 选择
    const select = (key: string | number, option: any) => {
      show.value = false;
      if (http.test(option?.url)) {
        window.open(option.url);
      }
    };
    // 右键上下文
    const contextMenu = (e: MouseEvent) => {
      e.preventDefault();
      show.value = false;
      nextTick().then(() => {
        show.value = true;
        x.value = e.clientX;
        y.value = e.clientY;
      });
    };
    const clickOutSlide = (item: any) => {
      show.value = false;
    };
    const clickUrl = () => {
      if (props.data?.url) {
        window.open(props.data?.url);
      }
    };
    console.log(options)
    return {
      // 变量
      x,
      y,
      show,
      options,
      // 函数
      select,
      contextMenu,
      clickOutSlide,
      clickUrl,
    };
  },
  render() {
    return h(
      NBadge,
      this.data.badge
        ? {
            ...this.data.badge,
            style: "cursor: pointer;",
          }
        : {
            style: "cursor: pointer;",
          },
      {
        default: () => (
          <Fragment>
            <NDropdown
              placement="bottom-start"
              trigger="manual"
              options={this.data.options}
              show={this.show}
              x={this.x}
              y={this.y}
              onClickoutside={this.clickOutSlide}
              onSelect={this.select}
              menuProps={() => ({ style: "width:200px" })}
            />
            <rIconImage
              src={this.data.src}
              size={this.data.size}
              onClick={this.clickUrl}
              onContextmenu={this.contextMenu}
            />
          </Fragment>
        ),
      }
    );
  },
});
