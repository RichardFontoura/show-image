import { MODULE_ID, i18nLocalize as l } from "@helpers";

export const SETTINGS_DATA_KEYS = {
  AllowPlayersToShareImages: "allowPlayersToShareImages",
} as const;

export function registerSettings() {
  (game as Game).settings.register(MODULE_ID, SETTINGS_DATA_KEYS.AllowPlayersToShareImages, {
    name: l("settings.allowPlayersToShareImages.name") ?? "Allow Players to Share Images",
    hint: l("settings.allowPlayersToShareImages.hint") ?? "Allow non-GM users to share images via the Show Image tool. When enabled, players can send images to chat and open image popouts. Disable to restrict sharing to GMs only. Changing this setting requires a page reload.",
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    onChange: value => {
      if (!game.ready) return;
      ui.notifications?.info(l("settings.reloadNotice") ?? "Settings changed. Reloading...");
      setTimeout(() => window.location.reload(), 600);
    },
  });
}
