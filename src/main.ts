import { MODULE_ID ,getModule, registerHandlebarsHelpers, i18nLocalize as l } from "@helpers";
import { ShowImageForm } from "app/features/app/ShowImageForm";
import { SETTINGS_DATA_KEYS, registerSettings } from "app/core/services/register.service";

Hooks.on("init", () => {
  registerHandlebarsHelpers();
  registerSettings();
  
  console.log(
    `%c
       _           _           _    _                             _  __ 
      | |         | |         | |  | |                           | |/ _|
      | |     ___ | |__   ___ | |  | | ___ _ __ _____      _____ | | |_ 
      | |    / _ \\| '_ \\ / _ \\| |/\\| |/ _ \\ '__/ _ \\ \\ /\\ / / _ \\| |  _|
      | |___| (_) | |_) | (_) \\  /\\  /  __/ | |  __/\\ V  V / (_) | | |  
      \\_____/\\___/|_.__/ \\___/ \\/  \\/ \\___|_|  \\___| \\_/\\_/ \\___/|_|_|  
                                                                        
                                                                        
       _____ _                     _____                                
      /  ___| |                   |_   _|                               
      \\ \`--.| |__   _____      __   | | _ __ ___   __ _  __ _  ___      
       \`--. \\ '_ \\ / _ \\ \\ /\\ / /   | || '_ \` _ \\ / _\` |/ _\` |/ _ \\     
      /\\__/ / | | | (_) \\ V  V /   _| || | | | | | (_| | (_| |  __/     
      \\____/|_| |_|\\___/ \\_/\\_/    \\___/_| |_| |_|\\__,_|\\__, |\\___|     
                                                         __/ |              
                                                        |___/               

      Show Image | Initializing module...
      `,
    "color: #7c4dff; font-family: monospace; font-weight: bold;"
  );
});

Hooks.once("setup", () => {
  const werewolfHubModule = getModule("lobowerewolf-hub") as WerewolfHub;
  if (!werewolfHubModule.api?.hub) {
    console.log(
      "Show Image: LoboWerewolf Hub not found. Make sure the hub module is installed and activated."
    );
  }

  werewolfHubModule?.api?.hub?.setTool({
    name: "showImageButton",
    title: "Show Image",
    icon: "fa-solid fa-image",
    button: true,
    visible: (game as Game).user?.isGM || ((game as Game).settings?.get(MODULE_ID, SETTINGS_DATA_KEYS.AllowPlayersToShareImages) ?? false),
    onClick: () => {
      new ShowImageForm().render(true);
    },
  });
});

Hooks.on("renderChatMessage", (_message, html) => {
  const root = (html as any)[0] as HTMLElement | undefined;
  if (!root) return;

  root.querySelectorAll('img[data-show-image="true"]').forEach((img) => {
    img.addEventListener("click", () => {
      const ImagePopoutCtor = (foundry as any)?.applications?.apps?.ImagePopout;
      if (!ImagePopoutCtor) {
        console.log("[show-image] ImagePopout not available.");
        return;
      }

      const src = img.getAttribute("src") ?? "";
      const popout = new ImagePopoutCtor({
        src,
        window: {
          title: l("image"),
        },
        shareable: game.user?.isGM ?? false,
      });
      popout.render(true);
    });
  });
});
