import { ShowImageApp } from "./src/show-image-app.js";

Hooks.on("init", () => {
  console.log("Show Image module initialized");
});

Hooks.on("ready", () => {
  if (!game.lobowerewolfHub) {
    console.error(
      "Show Image: LoboWerewolf Hub not found. Make sure the hub module is installed and activated."
    );
    return;
  }

  game.lobowerewolfHub.registerTool({
    name: "showImageButton",
    title: "Show Image",
    icon: "fa-solid fa-image",
    button: true,
    visible: game.user.isGM,
    onClick: () => {
      new ShowImageApp().render(true);
    },
  });
});
