import { NText } from 'naive-ui'
import { h, type CSSProperties } from 'vue'
import rIconImage from '../rIconImage'
import storeIcon from '../storeIcon'
interface iRIuser {
  name: string
  desc: string
  /**
   * 图源 svg格式、网络图片、base64
   */
  src: string
  style?: CSSProperties
  size?: number
  iconStyle?: CSSProperties
  [x: string]: any
}
/**
 * 用户信息
 * @param opts
 * @param {string} opts.src 图源 svg格式、网络图片、base64
 */
export default function rIconUser({
  name,
  desc,
  src,
  style,
  size = 40,
  iconStyle = { marginRight: '8px' }
}: iRIuser) {
  const defaultStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '5px 8px',
    cursor: 'default'
  }
  return h(
    'div',
    {
      style: { ...defaultStyle, style }
    },
    [
      h(storeIcon, { src, size, style: iconStyle }),
      h('div', null, [
        h(NText, { depth: 2 }, { default: () => name }),
        h(
          NText,
          { depth: 3, style: { fontSize: '12px', display: 'block' } },
          { default: () => desc }
        )
      ])
    ]
  )
}
