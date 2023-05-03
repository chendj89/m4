import { renderCascader, renderInput, renderSelect } from "@/hooks/form";
import type { FormItem } from "@/types/components";
import storeIcon from "@/unity/storeIcon";
import {
  NButton,
  type FormProps,
  type SelectRenderTag,
  NAvatar,
  type SelectRenderLabel,
  NText,
} from "naive-ui";
import { resolve } from "path-browserify";

export const formConfig: FormProps = {
  labelWidth: 60,
  size: "medium",
  labelAlign: "right",
};

export type tItem = {
  value?: any;
  label: string;
  key: string;
  renderConfig?: any;
  required?: boolean;
  [x: string]: any;
};
export const badgeType = [
  { label: "success", value: "success" },
  { label: "error", value: "error" },
  { label: "warning", value: "warning" },
  { label: "info", value: "info" },
];

export const optionsItem = ({
  renderConfig,
  label,
  key,
  value = "",
  required = true,
}: tItem) => {
  return {
    name: key,
    label: label,
    key: key,
    required: required,
    value: ref(value || null),
    render: (formItem) => {
      if (renderConfig) {
        let {
          type,
          options = [],
          prefix = false,
          // select 是否自定义渲染数据
          tag = false,
          onload = () => {},
          ...rest
        } = renderConfig;
        const renderLabel: SelectRenderLabel = (option) => {
          return h(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
              },
            },
            [
              h(NAvatar, {
                src: option.icon as string,
                round: true,
                size: 20,
                color: "transparent",
                style: {
                  marginRight: "12px",
                },
              }),
              h(
                "div",
                {
                  style: {
                    padding: "4px 0",
                  },
                },
                [h("div", null, [option.label as string])]
              ),
            ]
          );
        };
        const renderSingleSelectTag: SelectRenderTag = ({ option }) => {
          return h(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
              },
            },
            [
              h(NAvatar, {
                src: option.icon as string,
                round: true,
                size: 20,
                color: "transparent",
                style: {
                  marginRight: "12px",
                },
              }),
              option.label as string,
            ]
          );
        };
        if (type == "renderSelect") {
          return renderSelect(formItem.value, options, {
            clearable: true,
            ...rest,
            renderLabel: tag ? renderLabel : null,
            renderTag: tag ? renderSingleSelectTag : null,
          });
        } else if (type == "renderCascader") {
          return renderCascader(formItem.value, options, {
            remote: true,
            showPath: false,
            checkStrategy: "child",
            renderLabel: tag ? renderLabel : null,
          });
        } else {
          return renderInput(
            formItem.value,
            {
              placeholder: `请输入${label}`,
              clearable: true,
              ...rest,
            },
            {
              prefix: prefix
                ? () => h(storeIcon, { src: formItem.value.value, size: 20 })
                : null,
            }
          );
        }
      } else {
        return renderInput(formItem.value, {
          placeholder: `请输入${label}`,
          clearable: true,
        });
      }
    },
    validator: (formItem, message) => {
      if (!formItem.value.value) {
        message.error(`请输入${label}`);
        return false;
      }
      return true;
    },
  } as FormItem;
};

export const buttonAction = (text: string = "", onClick: any) => {
  return h(
    NButton,
    {
      onClick,
    },
    () => text
  );
};


/**
 * 根据子节点数据获取所有父节点数据
 * @param {any[]} tree 多维数组
 * @param {*} func 自定义判断函数
 * @param {*} field 取多维数组的哪个属性来对比
 * @param {*} path 存储结果
 * @returns 
 */
export function treeFindPath(tree:any[], func:any, field = "", path = []) {
  if (!tree) return [];
  for (const data of tree) {
    // 二选一 返回完整节点
    path.push(data) 
    // 二选一 
    // field === "" ? path.push(data) : path.push(data[field]);
    if (func(data)) return path;
    if (data.children) {
      const findChildren = treeFindPath(data.children, func, field, path);
      if (findChildren.length) return findChildren;
    }
    path.pop();
  }
  return [];
}

