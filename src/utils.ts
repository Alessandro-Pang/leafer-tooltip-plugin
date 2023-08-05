/*
 * @Author: zi.yang
 * @Date: 2023-08-01 23:32:45
 * @LastEditors: zi.yang
 * @LastEditTime: 2023-08-05 22:44:08
 * @Description:
 * @FilePath: /leafer-tooltip-plugin/src/utils.ts
 */
export const PLUGIN_NAME = 'leafer-tooltip-plugin';
export const ATTRS_NAME = 'data-leafer-tooltip-id';

/**
 * 异常抛出函数
 * @param condition
 * @param msg
 */
export function assert(condition: Boolean, msg: string) {
  if (condition) {
    throw new Error(`[${PLUGIN_NAME}]: ${msg}`);
  }
}

/**
 * html 添加样式
 * @param element
 * @param cssStyle
 */
export function addStyle(element: HTMLElement, cssStyle: cssStyleType) {
  Object.keys(cssStyle).forEach((prop: any) => {
    element.style[prop] = cssStyle[prop];
  });
}

/**
 * 允许显示的节点类型
 * @param config
 * @param type
 * @returns { Boolean }
 */
export function allowNodeType(config: UserConfig, type: IncludeTypes): Boolean {
  if (!Array.isArray(config?.includeTypes)) return true;
  if (config.includeTypes.length === 0) return true;
  return config.includeTypes.includes(type);
}

/**
 * 获取用户传入的自定义注册类型
 * @param type
 * @returns
 */
export function getRegisterType(type: registerType): string {
  if (!type) return '';

  const dataType = typeof type;
  assert(
    !['string', 'boolean'].includes(dataType),
    `注册类型必须为字符串或者布尔类型，当前为：${dataType}`
  );

  if (typeof type === 'string') {
    const registerType = type.trim();
    assert(!registerType, '注册类型不能为空字符串');
    return registerType;
  }

  return 'tooltip-plugin';
}

/**
 * 获取 tooltip dom
 * @param dataId 
 * @returns { HTMLElement | null  } 
 */
export function getTooltip(dataId: String): HTMLElement | null {
  return document.querySelector(`[${ATTRS_NAME}=${dataId}]`)
}