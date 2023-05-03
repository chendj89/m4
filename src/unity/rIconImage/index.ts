import storeIcon from "@/unity/storeIcon";
import { h } from "vue";
interface iRIimage {
  /**
   * 图源 svg格式、网络图片、base64
   */
  src: string;
  [x: string]: any;
}
/**
 * 渲染图标
 * @param opts
 * @param {string} opts.src 图源 svg格式、网络图片、base64
 */
export default function rIconImage(opts: iRIimage) {
  let { src, ...rest } = opts;
  return h(storeIcon, { src, ...rest });
}
