import { NIcon, NPopover } from 'naive-ui'
import { h } from 'vue'
import rIconImage from '../rIconImage'

interface iRIbutton {
  /**
   * 图源 svg格式、网络图片、base64
   */
  src: string
  /**
   * 显示图标大小
   */
  size?: number
  /**
   * 放大图标大小
   */
  size2?: number
  [x: string]: any
}
/**
 * 渲染图标
 * @param opts
 * @param {string} opts.src 图源 svg格式、网络图片、base64
 * @param {number} opts.size 显示图标大小
 * @param {number} opts.size2 放大图标大小
 */
export default function rIconButton({
  src,
  size = 24,
  size2 = 48,
  trigger = 'hover',
  ...rest
}: iRIbutton) {
  return h(NIcon, {size}, {
    default: () =>
      h(
        NPopover,
        {
          trigger: 'hover',
          contentStyle: 'padding:8px;background:white;',
          raw: true,
          ...rest
        },
        {
          default: () => rIconImage({ src, size: size2 }),
          trigger: () => rIconImage({ src, size })
        }
      )
  })
}
