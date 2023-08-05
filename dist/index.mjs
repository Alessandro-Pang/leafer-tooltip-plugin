const PLUGIN_NAME = "leafer-tooltip-plugin";
const ATTRS_NAME = "data-leafer-tooltip-id";
function assert(condition, msg) {
  if (condition) {
    throw new Error(`[${PLUGIN_NAME}]: ${msg}`);
  }
}
function addStyle(element, cssStyle) {
  Object.keys(cssStyle).forEach((prop) => {
    element.style[prop] = cssStyle[prop];
  });
}
function allowNodeType(config, type) {
  if (!Array.isArray(config?.includeTypes))
    return true;
  if (config.includeTypes.length === 0)
    return true;
  return config.includeTypes.includes(type);
}
function getRegisterType(type) {
  if (!type)
    return "";
  const dataType = typeof type;
  assert(!["string", "boolean"].includes(dataType), `\u6CE8\u518C\u7C7B\u578B\u5FC5\u987B\u4E3A\u5B57\u7B26\u4E32\u6216\u8005\u5E03\u5C14\u7C7B\u578B\uFF0C\u5F53\u524D\u4E3A\uFF1A${dataType}`);
  if (typeof type === "string") {
    const registerType = type.trim();
    assert(!registerType, "\u6CE8\u518C\u7C7B\u578B\u4E0D\u80FD\u4E3A\u7A7A\u5B57\u7B26\u4E32");
    return registerType;
  }
  return "tooltip-plugin";
}
function getTooltip(dataId) {
  return document.querySelector(`[${ATTRS_NAME}=${dataId}]`);
}

const plugin = {
  name: PLUGIN_NAME,
  importVersion: "1.0.0-beta.8",
  import: ["LeaferTypeCreator", "LeaferEvent", "PointerEvent"],
  config: null,
  LeaferUI: {},
  run(LeaferUI, config) {
    config.type = getRegisterType(config.type);
    this.config = config;
    this.LeaferUI = LeaferUI;
    if (config.type) {
      const LeaferTypeCreator = LeaferUI.LeaferTypeCreator;
      LeaferTypeCreator.register(config.type, (leafer) => tooltipPluginType(leafer, LeaferUI, config));
    }
  },
  onLeafer(leafer) {
    if (!this.config?.type) {
      tooltipPluginType(leafer, this.LeaferUI, this.config);
    }
  }
};
function tooltipPluginType(leafer, LeaferUI, config) {
  const { PointerEvent, LeaferEvent } = LeaferUI;
  const randomStr = Math.random().toString(32).slice(2, 10);
  const domId = `leafer-tooltip-plugin--${randomStr}`;
  let mouseoverNode = null;
  leafer.on(PointerEvent.MOVE, (evt) => {
    const node = evt.target;
    if (node.isLeafer || !allowNodeType(config, node.tag)) {
      mouseoverNode = null;
      const tooltipDOM = getTooltip(domId);
      if (tooltipDOM) {
        tooltipDOM.style.display = "none";
      }
      return;
    }
    mouseoverNode = node;
  });
  leafer.on(LeaferEvent.VIEW_READY, () => {
    if (!(leafer.view instanceof HTMLElement))
      return;
    assert(!leafer.view?.addEventListener, "leafer.view \u52A0\u8F7D\u5931\u8D25\uFF01");
    leafer.view.addEventListener("mousemove", (event) => {
      if (!mouseoverNode)
        return;
      createTooltip(domId, event, mouseoverNode, config);
    });
  });
}
function createTooltip(domId, event, node, config) {
  const argumentType = typeof config.getContent;
  assert(argumentType !== "function", `getContent \u4E3A\u5FC5\u4F20\u53C2\u6570\uFF0C\u4E14\u5FC5\u987B\u662F\u4E00\u4E2A\u51FD\u6570\uFF0C\u5F53\u524D\u4E3A\uFF1A${argumentType} \u7C7B\u578B`);
  const content = config.getContent(node);
  assert(!content, `getContent \u8FD4\u56DE\u503C\u4E0D\u80FD\u4E3A\u7A7A`);
  let container = getTooltip(domId);
  const isExists = container !== null;
  if (!isExists) {
    container = document.createElement("div");
  }
  if (container === null)
    return;
  container.setAttribute(ATTRS_NAME, domId);
  container.innerHTML = content;
  if (config.className) {
    container.className = config.className;
  } else {
    addStyle(container, {
      padding: "8px 10px",
      backgroundColor: "#fff",
      borderRadius: "2px",
      boxShadow: "0 0 4px #e2e2e2"
    });
  }
  addStyle(container, {
    display: "block",
    position: "absolute",
    left: event.pageX + 4 + "px",
    top: event.pageY + 4 + "px"
  });
  if (!isExists) {
    document.body.appendChild(container);
  }
}

export { plugin };
