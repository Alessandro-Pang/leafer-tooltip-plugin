<!--
 * @Author: zi.yang
 * @Date: 2023-08-01 21:53:46
 * @LastEditors: zi.yang
 * @LastEditTime: 2023-08-01 22:21:11
 * @Description: README
 * @FilePath: /leafer-tooltip-plugin/README.md
-->

# Leafer Tooltip Plugin

Tooltip 插件主要用于 Leafer 元素/节点上 展示一些自定义信息。

使用 Tooltip 插件后，当鼠标悬浮在元素上时，会显示一个弹框展示节点的详细信息。

# 快速上手

## 安装

```shell
npm i leafer-tooltip-plugin --save
```

## 使用方法

使用插件时，传入 `getContent` 参数，并返回需要展示的内容即可

```js
import { plugin } from 'leafer-tooltip-plugin';

usePlugin(plugin, {
  getContent(node) {
    const dom = `<ul style="list-style: none; margin: 0; padding: 0">
      <li>节点类型：${node.tag}</li>
      <li>宽度：${node.width}</li>
      <li>高度：${node.height}</li>
    </ul>
    `;
    return dom;
  },
});
```

### 效果演示

![效果演示](./readme/image-1.gif)

## 允许限制指定的元素类型

传入 `includeTypes` 参数，限制允许显示提示框的类型

```js
import { plugin } from 'leafer-tooltip-plugin';

usePlugin(plugin, {
  includeTypes: ['Ellipse'],
  getContent(node) {
    const dom = `<ul style="list-style: none; margin: 0; padding: 0">
      <li>节点类型：${node.tag}</li>
      <li>宽度：${node.width}</li>
      <li>高度：${node.height}</li>
    </ul>
    `;
    return dom;
  },
});
```

### 效果演示

![效果演示](./readme/image-2.gif)

# 属性列表

| 属性         | 类型 | 说明                     | 默认值｜ |
| ------------ | ---- | ------------------------ | -------- |
| includeTypes | 数组 | 允许展示提示框的类型列表 | 所有类型 |
| getContent   | 函数 | 显示的内容               | -        |
