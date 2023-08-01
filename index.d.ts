/*
 * @Author: zi.yang
 * @Date: 2023-07-06 00:40:39
 * @LastEditors: zi.yang
 * @LastEditTime: 2023-08-01 21:55:33
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

/**
 * @type includeTypes { IncludeTypes } 允许显示的 Leafer 元素类型
 * @type getContent { Function: IUI } Tooltip 显示的内容
 */
declare type UserConfig = {
  includeTypes?: Array<IncludeTypes>,
  getContent: (node: IUI) => string,
}

declare type cssStyleType = {
  [key: string]: string
}
