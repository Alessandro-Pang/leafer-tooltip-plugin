export declare const PLUGIN_NAME = "leafer-tooltip-plugin";
export declare const ATTRS_NAME = "data-leafer-tooltip-id";
export declare function assert(condition: Boolean, msg: string): void;
export declare function addStyle(element: HTMLElement, cssStyle: cssStyleType): void;
export declare function allowNodeType(config: UserConfig, type: IncludeTypes): Boolean;
export declare function getRegisterType(type: registerType): string;
export declare function getTooltip(dataId: String): HTMLElement | null;
