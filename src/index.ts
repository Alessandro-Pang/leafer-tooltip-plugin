/*
 * @Author: zi.yang
 * @Date: 2023-07-06 00:32:35
 * @LastEditors: zi.yang
 * @LastEditTime: 2023-08-01 21:55:41
 * @Description:
 * @FilePath: /leafer-tooltip-plugin/src/index.ts
 */
import { ILeafer, IObject, IPlugin, IUI } from '@leafer-ui/interface';

const PLUGIN_NAME = 'leafer-tooltip-plugin';

export const plugin: IPlugin = {
    name: PLUGIN_NAME,
    importVersion: '1.0.0-beta.7',
    import: ['LeaferTypeCreator', 'LeaferEvent', 'PointerEvent', 'LeafHelper'],
    run(LeaferUI: IObject, config: UserConfig): void {
        const LeaferTypeCreator = LeaferUI.LeaferTypeCreator;
        LeaferTypeCreator.register('tooltip-plugin', (leafer: ILeafer) =>
            tooltipPluginType(leafer, LeaferUI, config)
        );
    },
};

function assert(condition: Boolean, msg: string) {
    if (condition) {
        throw new Error(`[${PLUGIN_NAME}]: ${msg}`);
    }
}

function addStyle(element: HTMLElement, cssStyle: cssStyleType) {
    Object.keys(cssStyle).forEach((prop: any) => {
        element.style[prop] = cssStyle[prop];
    });
}

/**
 * 允许显示的节点类型
 * @param config
 * @param type
 * @returns
 */
function allowNodeType(config: UserConfig, type: IncludeTypes) {
    if (!Array.isArray(config?.includeTypes)) return true;
    if (config.includeTypes.length === 0) return true;
    return config.includeTypes.includes(type);
}

/**
 * @param leafer
 * @param LeaferUI
 * @param config
 */
function tooltipPluginType(
    leafer: ILeafer,
    LeaferUI: IObject,
    config: UserConfig
) {
    const { PointerEvent, LeaferEvent } = LeaferUI;
    const randomStr = Math.random().toString(32).slice(2, 10);
    const domID = `leafer-tooltip-plgin--${randomStr}`;

    let mouseoverNode: IUI | null = null;
    // leafer 鼠标移动事件，用于捕获节点
    leafer.on(PointerEvent.MOVE, (evt) => {
        const node = evt.target;
        if (node.isLeafer || !allowNodeType(config, node.tag)) {
            mouseoverNode = null;
            const tooltipDOM = document.getElementById(domID);
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
            createTooltip(domID, event, mouseoverNode, config);
        });
    });
}

/**
 * 创建提示元素
 * @param domID dom id
 * @param event DOM 事件
 * @param node 触发事件的元素
 * @param config 用户传入的配置
 * @returns
 */
function createTooltip(
    domID: string,
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

    let container: HTMLElement | null = document.getElementById(domID);
    const isExists = container !== null;
    if (!isExists) {
        container = document.createElement('div');
    }
    if (container === null) return;

    container.setAttribute('id', domID);
    container.innerHTML = content;
    addStyle(container, {
        display: 'block',
        position: 'absolute',
        left: event.clientX + 4 + 'px',
        top: event.clientY + 4 + 'px',
        padding: '8px 10px',
        backgroundColor: '#fff',
        borderRadius: '2px',
        boxShadow: '0 0 4px #e2e2e2',
    });

    if (!isExists) {
        document.body.appendChild(container);
    }
}
