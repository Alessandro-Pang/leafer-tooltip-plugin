/*
 * @Author: zi.yang
 * @Date: 2023-08-01 23:32:45
 * @LastEditors: zi.yang
 * @LastEditTime: 2023-08-01 23:34:56
 * @Description: 
 * @FilePath: /leafer-tooltip-plugin/src/utils.ts
 */
export const PLUGIN_NAME = 'leafer-tooltip-plugin';
 
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