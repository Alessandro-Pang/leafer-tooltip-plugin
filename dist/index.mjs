const PLUGIN_NAME = "leafer-tooltip-plugin";
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

const plugin = {
  name: PLUGIN_NAME,
  importVersion: "1.0.0-beta.7",
  import: ["LeaferTypeCreator", "LeaferEvent", "PointerEvent"],
  run(LeaferUI, config) {
    const LeaferTypeCreator = LeaferUI.LeaferTypeCreator;
    LeaferTypeCreator.register("tooltip-plugin", (leafer) => tooltipPluginType(leafer, LeaferUI, config));
  }
};
function tooltipPluginType(leafer, LeaferUI, config) {
  const { PointerEvent, LeaferEvent } = LeaferUI;
  const randomStr = Math.random().toString(32).slice(2, 10);
  const domID = `leafer-tooltip-plugin--${randomStr}`;
  let mouseoverNode = null;
  leafer.on(PointerEvent.MOVE, (evt) => {
    const node = evt.target;
    if (node.isLeafer || !allowNodeType(config, node.tag)) {
      mouseoverNode = null;
      const tooltipDOM = document.getElementById(domID);
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
      createTooltip(domID, event, mouseoverNode, config);
    });
  });
}
function createTooltip(domID, event, node, config) {
  const argumentType = typeof config.getContent;
  assert(argumentType !== "function", `getContent \u4E3A\u5FC5\u4F20\u53C2\u6570\uFF0C\u4E14\u5FC5\u987B\u662F\u4E00\u4E2A\u51FD\u6570\uFF0C\u5F53\u524D\u4E3A\uFF1A${argumentType} \u7C7B\u578B`);
  const content = config.getContent(node);
  assert(!content, `getContent \u8FD4\u56DE\u503C\u4E0D\u80FD\u4E3A\u7A7A`);
  let container = document.getElementById(domID);
  const isExists = container !== null;
  if (!isExists) {
    container = document.createElement("div");
  }
  if (container === null)
    return;
  container.setAttribute("id", domID);
  container.innerHTML = content;
  addStyle(container, {
    display: "block",
    position: "absolute",
    left: event.pageX + 4 + "px",
    top: event.pageY + 4 + "px",
    padding: "8px 10px",
    backgroundColor: "#fff",
    borderRadius: "2px",
    boxShadow: "0 0 4px #e2e2e2"
  });
  if (!isExists) {
    document.body.appendChild(container);
  }
}

export { plugin };
