/*
 * @Author: zi.yang
 * @Date: 2023-07-06 00:40:39
 * @LastEditors: zi.yang
 * @LastEditTime: 2023-08-05 22:51:42
 * @Description: 
 * @FilePath: /leafer-tooltip-plugin/index.d.ts
 */
declare type Noop = () => void;

declare const enum IncludeTypes {
  App = 'App', 
  Leafer = 'Leafer',
  Frame = 'Frame',
  Box = 'Box',
  Group = 'Group',
  Rect = 'Rect',
  Ellipse = 'Ellipse',
  Polygon = 'Polygon',
  Star = 'Star',
  Line = 'Line',
  Image = 'Image',
  Canvas = 'Canvas',
  Text = 'Text',
  Path = 'Path',
  Pen = 'Pen'
};

declare type registerType =  Boolean | String | undefined;

/**
 * @type { String } type： 注册组件类型, 为 true 默认为 ：'tooltip-plugin'，字符串则为自定义类型
 * @type { String } className：自定义容器类样式
 * @type { IncludeTypes } includeTypes： 允许显示的 Leafer 元素类型
 * @type { Function: IUI } getContent： Tooltip 显示的内容
 */
declare type UserConfig = {
  type?: registerType,
  className?: string,
  includeTypes?: Array<IncludeTypes>,
  getContent: (node: IUI) => string,
}

declare type cssStyleType = {
  [key: string]: string
}
