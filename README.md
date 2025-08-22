# Show Images

**Show Images** is a Foundry VTT module that makes it easy for Game Masters to share images with players.  

## Requirements
- Foundry VTT v13 or later  
- Dependency: [LoboWerewolf Hub](https://github.com/RichardFontoura/lobowerewolf-hub/releases/download/3.0.0/module.json)  

Only the GM can see and use the **Show Image** button.

## Installation
- **Manifest URL (recommended):**  
  [module.json](https://github.com/RichardFontoura/show-image/releases/download/4.0.0/module.json)  
- **ZIP download:**  
  [show-image.zip](https://github.com/RichardFontoura/show-image/releases/download/4.0.0/show-image.zip)  

Extract into your Foundry VTT modules folder and ensure the Hub module is installed and enabled.

## How It Works
- Registers a **Show Image** button in the Hub (visible only to GM).  
- Clicking it opens a simple interface where the GM can:  
  - Paste or drop image links  
  - Send images privately to a specific player  
  - Send images to all players in the scene  

## Features
- Private or group image sharing  
- Support for URL, copy/paste, and drag-and-drop  
- Simple, direct UI  

## Localization
Available in **English (en)** and **Portuguese (pt-BR)**.  
Translation contributions are welcome in the `languages/` folder.

## Development
- Built with Node.js + NPM  
- Commands:  
  - `npm run build` → build into `dist/`  
  - `npm run build:zip` → build and package for release  

## Troubleshooting
- If the button doesn’t appear, check you’re logged in as GM and the Hub is active  
- If images don’t show, confirm the link is accessible and not blocked by extensions  

## License & Credits
- Author: [lobowarewolf](https://www.patreon.com/lobowarewolf)  
- License: ISC  
