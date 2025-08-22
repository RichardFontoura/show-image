import { HandlebarsApplication, i18nLocalize as l, FilePicker } from "@helpers";

import type { DeepPartial } from "fvtt-types/utils";
import type { DefaultOptions, HandlebarsTemplatePart, Context, AppV2RenderOptions, } from "app/core/types/forms.types";

export class ShowImageForm extends HandlebarsApplication {
  private clickHandler?: (e: Event) => void;
  private keydownHandler?: (e: KeyboardEvent) => void;
  private pasteHandler?: (e: ClipboardEvent) => void;
  private dragOverHandler?: (e: DragEvent) => void;
  private dropHandler?: (e: DragEvent) => void;

  imageUrl: string[] = [];

  static get DEFAULT_OPTIONS(): DefaultOptions {
    return {
      classes: ["show-image"],
      tag: "div",
      window: {
        frame: true,
        positioned: true,
        title: l("show-image"),
        icon: "fa-solid fa-image",
        controls: [],
        minimizable: true,
        resizable: false,
        contentTag: "section",
        contentClasses: [],
      },
      actions: {},
      form: {
        handler: undefined,
        submitOnChange: false,
        closeOnSubmit: false,
      },
      position: {
        width: "auto",
        height: "auto",
      },
    };
  }

  static get PARTS(): Record<string, HandlebarsTemplatePart> {
    return {
      content: {
        template: "modules/show-image/templates/app/show-image.form.hbs",
        scrollable: [],
        classes: [],
      },
    };
  }

  async _prepareContext(
    options: DeepPartial<AppV2RenderOptions> & { isFirstRender: boolean }
  ): Promise<Context> {
    const baseContext = await super._prepareContext(options);
    const users =
      (game as Game).users?.contents.map((user) => ({
        id: user.id,
        name: user.name,
      })) || [];

    return {
      ...baseContext,
      users: users,
      imageUrl: this.imageUrl,
    };
  }

  async _onRender(
    context: DeepPartial<Context>,
    options: DeepPartial<AppV2RenderOptions>
  ): Promise<void> {
    await super._onRender?.(context, options);
    const root = this.element as HTMLElement | null;
    if (!root) return;

    if (this.clickHandler) root.removeEventListener("click", this.clickHandler);
    if (this.keydownHandler)
      root.removeEventListener("keydown", this.keydownHandler);
    if (this.pasteHandler) root.removeEventListener("paste", this.pasteHandler);
    if (this.dragOverHandler)
      root.removeEventListener("dragover", this.dragOverHandler);
    if (this.dropHandler) root.removeEventListener("drop", this.dropHandler);

    this.clickHandler = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest("#btn-add-image")) {
        this._onAddImage(e as MouseEvent);
        return;
      }
      if (target.closest("#btn-show-image")) {
        this._onShowImage(e as MouseEvent);
        return;
      }
      if (target.closest("#btn-show-all")) {
        this._onShowAll(e as MouseEvent);
        return;
      }
      const removeBtn = target.closest(
        ".btn-remove-image"
      ) as HTMLElement | null;
      if (removeBtn) {
        this._onRemoveImage(removeBtn);
        return;
      }
      const filePickerBtn = target.closest(
        ".file-picker"
      ) as HTMLElement | null;
      if (filePickerBtn) {
        this._onFilePickerBtnClick();
        return;
      }
    };

    this.keydownHandler = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("#image-url")) {
        this._onImageUrlKeydown(e as KeyboardEvent);
      }
    };

    this.pasteHandler = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("#image-url")) {
        this._onImageUrlPaste(e as ClipboardEvent);
      }
    };

    this.dragOverHandler = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("#image-url")) {
        this._onImageUrlDragOver(e as DragEvent);
      }
    };

    this.dropHandler = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("#image-url")) {
        this._onImageUrlDrop(e as DragEvent);
      }
    };

    root.addEventListener("click", this.clickHandler);
    root.addEventListener("keydown", this.keydownHandler);
    root.addEventListener("paste", this.pasteHandler);
    root.addEventListener("dragover", this.dragOverHandler);
    root.addEventListener("drop", this.dropHandler);
  }

  private _onAddImage(_event: MouseEvent | KeyboardEvent): void {
    const input = this.element?.querySelector<HTMLInputElement>("#image-url");
    const link = input?.value.trim() ?? "";
    if (!link) {
      ui?.notifications?.error(l("image-link-error"));
      return;
    }
    this.imageUrl.push(link);
    if (input) input.value = "";
    void this.render();
  }

  private _onImageUrlKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      this._onAddImage(event);
    }
  }

  private _onImageUrlPaste(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData;
    if (!clipboardData) return;
    const items = clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.includes("image")) {
        const blob = item.getAsFile();
        if (!blob) continue;
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result;
          if (typeof dataUrl === "string") {
            this.imageUrl.push(dataUrl);
            void this.render();
          }
        };
        reader.readAsDataURL(blob);
        event.preventDefault();
        break;
      }
    }
  }

  private _onImageUrlDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  private _onImageUrlDrop(event: DragEvent): void {
    event.preventDefault();
    const dt = event.dataTransfer;
    if (dt?.files?.length) {
      const file = dt.files[0];
      if (file.type.includes("image")) {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result;
          if (typeof dataUrl === "string") {
            this.imageUrl.push(dataUrl);
            void this.render();
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }

  private _onRemoveImage(buttonEl: HTMLElement): void {
    const indexStr = buttonEl.dataset?.index;
    const index = indexStr ? parseInt(indexStr, 10) : NaN;
    if (Number.isFinite(index)) {
      this.imageUrl.splice(index, 1);
      void this.render();
    }
  }

  private _onFilePickerBtnClick(): void {
    new FilePicker({
      type: "imagevideo",
      callback: (path) => {
        this.imageUrl.push(path);
        void this.render();
      },
    }).browse();
  }

  private _onShowImage(_event: MouseEvent): void {
    const selectedUserEl =
      this.element?.querySelector<HTMLSelectElement>("#user-select");
    const selectedUserId = selectedUserEl?.value;

    if (this.imageUrl.length === 0) {
      ui?.notifications?.error(l("no-image-to-send"));
      return;
    }

    const imagesHtml = this.imageUrl
      .map(
        (link, idx) => `
        <div>
          <strong>${l("image")} ${idx + 1}:</strong><br>
          <img src="${link}" style="max-width:100%; height:auto;">
        </div>`
      )
      .join("");

    void (ChatMessage as any).create({
      content: imagesHtml,
      whisper: selectedUserId ? [selectedUserId] : [],
    });
  }

  private _onShowAll(_event: MouseEvent): void {
    if (this.imageUrl.length === 0) {
      ui?.notifications?.error(l("no-image-to-send"));
      return;
    }

    this.imageUrl.forEach((link) => {
      const ImagePopoutCtor = (foundry as any)?.applications?.apps?.ImagePopout;
      if (!ImagePopoutCtor) {
        console.warn("[show-image] ImagePopout not available.");
        return;
      }
      const popout = new ImagePopoutCtor({
        src: link,
        window: {
          title: l("image"),
        },
        shareable: true,
      });
      popout.render(true);
      popout.shareImage?.();
    });
  }
}
