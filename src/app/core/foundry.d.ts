import { Tool } from "./types/lobowerewolf-hub.types";

declare class LoboWerewolfHub {
  setTool(tool: Tool): void;
  getTools(): Map<string, Tool>;
}

declare global {
  interface SettingConfig {
    "show-image.allowPlayersToShareImages": typeof Boolean;
  }

  interface WerewolfHub {
    api?: {
      hub?: LoboWerewolfHub;
    };
  }

  interface ModuleAPI {}

  interface Module {
    api?: ModuleAPI;
  }
}

export {};
