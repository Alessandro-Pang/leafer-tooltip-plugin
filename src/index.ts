/*
 * @Author: zi.yang
 * @Date: 2023-07-06 00:32:35
 * @LastEditors: zi.yang
 * @LastEditTime: 2023-08-05 22:52:13
 * @Description: Leafer Tooltip Plugin
 * @FilePath: /leafer-tooltip-plugin/src/index.ts
 */
import { ILeafer, IObject, IPlugin, IUI } from '@leafer-ui/interface';

import {
  addStyle,
  allowNodeType,
  assert,
  ATTRS_NAME,
  getRegisterType,
  getTooltip,
  PLUGIN_NAME,
} from './utils';

export const plugin: IPlugin = {
    name: PLUGIN_NAME,
    importVersion: '1.0.0-beta.8',
    import: ['LeaferTypeCreator', 'LeaferEvent', 'PointerEvent'],
    config: null,
    LeaferUI: {},
    run(LeaferUI: IObject, config: UserConfig): void {
        config.type = getRegisterType(config.type);
        this.config = config;
        this.LeaferUI = LeaferUI;
        if (config.type) {
            const LeaferTypeCreator = LeaferUI.LeaferTypeCreator;
            LeaferTypeCreator.register(config.type, (leafer: ILeafer) =>
                tooltipPluginType(leafer, LeaferUI, config)
            );
        }
    },
    onLeafer(leafer: ILeafer) {
        if (!this.config?.type) {
            tooltipPluginType(leafer, this.LeaferUI, this.config);
        }
    },
};

/**
 * @param { ILeafer } leafer leafer 实例
 * @param { IObject } LeaferUI Leafer UI
 * @param { UserConfig } config 用户自定义配置
 */
function tooltipPluginType(
    leafer: ILeafer,
    LeaferUI: IObject,
    config: UserConfig
) {
    const { PointerEvent, LeaferEvent } = LeaferUI;
    const randomStr = Math.random().toString(32).slice(2, 10);
    const domId = `leafer-tooltip-plugin--${randomStr}`;

    let mouseoverNode: IUI | null = null;
    // leafer 鼠标移动事件，用于捕获节点
    leafer.on(PointerEvent.MOVE, (evt) => {
        const node = evt.target;
        if (node.isLeafer || !allowNodeType(config, node.tag)) {
            mouseoverNode = null;
            const tooltipDOM = getTooltip(domId);
            if (tooltipDOM) {
                tooltipDOM.style.display = 'none';
            }
            return;
        }
        mouseoverNode = node;
    });

    // 挂载画布事件
    leafer.on(LeaferEvent.VIEW_READY, () => {
        if (!(leafer.view instanceof HTMLElement)) return;
        assert(!leafer.view?.addEventListener, 'leafer.view 加载失败！');

        leafer.view.addEventListener('mousemove', (event: MouseEvent) => {
            if (!mouseoverNode) return;
            createTooltip(domId, event, mouseoverNode, config);
        });
    });
}

/**
 * 创建提示元素
 * @param { string } domID dom id
 * @param { MouseEvent } event DOM 事件
 * @param { IUI } node 触发事件的元素
 * @param { UserConfig } config 用户传入的配置
 * @returns
 */
function createTooltip(
    domId: string,
    event: MouseEvent,
    node: IUI,
    config: UserConfig
) {
    const argumentType = typeof config.getContent;
    assert(
        argumentType !== 'function',
        `getContent 为必传参数，且必须是一个函数，当前为：${argumentType} 类型`
    );

    const content = config.getContent(node);
    assert(!content, `getContent 返回值不能为空`);

    let container: HTMLElement | null = getTooltip(domId);
    const isExists = container !== null;
    if (!isExists) {
        container = document.createElement('div');
    }
    if (container === null) return;

    container.setAttribute(ATTRS_NAME, domId);
    container.innerHTML = content;
    // 允许用户自定义样式
    if (config.className) {
        container.className = config.className;
    } else {
        addStyle(container, {
            padding: '8px 10px',
            backgroundColor: '#fff',
            borderRadius: '2px',
            boxShadow: '0 0 4px #e2e2e2',
        });
    }
    addStyle(container, {
        display: 'block',
        position: 'absolute',
        left: event.pageX + 4 + 'px',
        top: event.pageY + 4 + 'px',
    });

    if (!isExists) {
        document.body.appendChild(container);
    }
}
