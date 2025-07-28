import { HandlebarsApplication } from "./utils/utils.js";

export class ShowImageApp extends HandlebarsApplication {
  static get APP_ID() {
    return "show-image-app";
  }

  constructor() {
    super();
    this.imageLinks = [];
  }

  get title() {
    return game.i18n.localize("show_image");
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: this.APP_ID,
      classes: [this.APP_ID, "show-image-dialog"],
      template: "modules/show-image/templates/show-image.hbs",
      resizable: true,
      minimizable: false,
      width: 600,
      height: "auto",
    });
  }

  static get PARTS() {
    return {
      content: {
        template: this.defaultOptions.template,
        scrollable: [],
        classes: ["form-content"],
      },
    };
  }

  async _prepareContext() {
    const users = game.users.contents.map((user) => ({
      id: user.id,
      name: user.name,
    }));

    return {
      users: users,
      images: this.imageLinks,
    };
  }

  async _onRender(context, options) {
    await super._onRender?.(context, options);
    const html = this.element;

    html
      .querySelector("#btn-add-image")
      ?.addEventListener("click", this._onAddImage.bind(this));
    html
      .querySelector("#image-url")
      ?.addEventListener("keydown", this._onImageUrlKeydown.bind(this));
    html
      .querySelector("#image-url")
      ?.addEventListener("paste", this._onImageUrlPaste.bind(this));
    html
      .querySelector("#image-url")
      ?.addEventListener("dragover", this._onImageUrlDragOver.bind(this));
    html
      .querySelector("#image-url")
      ?.addEventListener("drop", this._onImageUrlDrop.bind(this));
    html
      .querySelector("#btn-show-image")
      ?.addEventListener("click", this._onShowImage.bind(this));
    html
      .querySelector("#btn-show-all")
      ?.addEventListener("click", this._onShowAll.bind(this));

    html.querySelectorAll(".btn-remove-image").forEach((btn) => {
      btn.addEventListener("click", this._onRemoveImage.bind(this));
    });
  }

  _onAddImage(event) {
    const input = this.element.querySelector("#image-url");
    const link = input.value.trim();
    if (!link) {
      ui.notifications.error(game.i18n.localize("image_link_error"));
      return;
    }
    this.imageLinks.push(link);
    input.value = "";
    this.render();
  }

  _onImageUrlKeydown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      this._onAddImage(event);
      return false;
    }
  }

  _onImageUrlPaste(event) {
    const clipboardData = (event.originalEvent || event).clipboardData;
    if (!clipboardData) return;
    const items = clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        const blob = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          this.imageLinks.push(dataUrl);
          this.render();
        };
        reader.readAsDataURL(blob);
        event.preventDefault();
        return false;
      }
    }
  }

  _onImageUrlDragOver(event) {
    event.preventDefault();
  }

  _onImageUrlDrop(event) {
    event.preventDefault();
    const dt = event.dataTransfer;
    if (dt && dt.files && dt.files.length) {
      const file = dt.files[0];
      if (file.type.indexOf("image") !== -1) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          this.imageLinks.push(dataUrl);
          this.render();
        };
        reader.readAsDataURL(file);
      }
    }
  }

  _onRemoveImage(event) {
    const index = parseInt(event.target.dataset.index);
    this.imageLinks.splice(index, 1);
    this.render();
  }

  _onShowImage(event) {
    const selectedUserId = this.element.querySelector("#user-select").value;
    if (this.imageLinks.length === 0) {
      ui.notifications.error(game.i18n.localize("no_image_to_send"));
      return;
    }
    const imagesHtml = this.imageLinks
      .map(
        (link, idx) =>
          `<div>
          <strong>${game.i18n.localize("image")} ${idx + 1}:</strong><br>
          <img src="${link}" style="max-width:100%; height:auto;">
        </div>`
      )
      .join("");
    ChatMessage.create({
      content: imagesHtml,
      whisper: [selectedUserId],
    });
  }

  _onShowAll(event) {
    if (this.imageLinks.length === 0) {
      ui.notifications.error(game.i18n.localize("no_image_to_send"));
      return;
    }
    this.imageLinks.forEach((link) => {
      const popout = new foundry.applications.apps.ImagePopout({
        src: link,
        window: {
          title: game.i18n.localize("image")
        },
        shareable: true
      });
      popout.render(true);
      popout.shareImage();
    });
  }
}
