declare module "pannellum" {
  export interface PannellumViewer {
    destroy(): void;
    on(event: string, callback: (...args: unknown[]) => void): void;
    off(event: string, callback: (...args: unknown[]) => void): void;
    isLoaded(): boolean;
  }

  export interface PannellumConfig {
    type?: string;
    panorama?: string;
    autoLoad?: boolean;
    haov?: number;
    vaov?: number;
    vOffset?: number;
    showFullscreenCtrl?: boolean;
    showZoomCtrl?: boolean;
    mouseZoom?: boolean;
    touchZoom?: boolean;
    showControls?: boolean;
    hotSpotDebug?: boolean;
    [key: string]: unknown;
  }

  export function viewer(container: HTMLElement, config: PannellumConfig): PannellumViewer;
}
