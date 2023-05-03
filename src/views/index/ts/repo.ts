import { renderInput } from "@/hooks/form";
import type { FormItem } from "@/types/components";
import { NButton, type FormProps } from "naive-ui";

export const formConfig: FormProps = {
  labelWidth: 60,
  size: "medium",
  labelAlign: "right",
};

export type tItem = {
  value?: any;
  label: string;
  key: string;
};

export const optionsItem = ({ value = "", label, key }: tItem) => {
  return {
    label: label,
    key: key,
    required: true,
    value: ref(value || null),
    render: (formItem) =>
      renderInput(formItem.value, {
        placeholder: `请输入${label}`,
        clearable: true,
      }),
    validator: (formItem, message) => {
      if (!formItem.value.value) {
        message.error(`请输入${label}`);
        return false;
      }
      return true;
    },
  } as FormItem;
};

export const buttonAction = (onClick: any) => {
  return h(
    NButton,
    {
      onClick,
    },
    () => "add"
  );
};
