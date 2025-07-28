export const MODULE_ID = "show-image";

Handlebars.registerHelper("math", function (lvalue, operator, rvalue) {
  lvalue = parseFloat(lvalue);
  rvalue = parseFloat(rvalue);

  return {
    "+": lvalue + rvalue,
    "-": lvalue - rvalue,
    "*": lvalue * rvalue,
    "/": lvalue / rvalue,
    "%": lvalue % rvalue,
  }[operator];
});

export class HandlebarsApplication extends foundry.applications.api.HandlebarsApplicationMixin(
  foundry.applications.api.ApplicationV2
) {
  static get defaultOptions() {
    return {
      classes: ["show-image-app"],
      resizable: true,
      minimizable: false,
      width: 600,
      height: "auto",
    };
  }
}

let _filePickerClass = null;
export const FilePickerClass = () => {
  if (_filePickerClass !== null) {
    return _filePickerClass;
  }

  if (typeof game === "undefined" || !game.version) {
    console.warn(
      "FilePickerClass: game object not available yet, using fallback"
    );
    return FilePicker;
  }

  const version = game.version || game.data?.version;
  const majorVersion = parseInt(version.split(".")[0]);

  if (majorVersion >= 13) {
    _filePickerClass =
      foundry.applications.apps.FilePicker?.implementation ||
      foundry.applications.apps.FilePicker;
  } else {
    _filePickerClass = FilePicker;
  }

  return _filePickerClass;
};

export const { DialogV2 } = foundry.applications.api;

export const { duplicate } = foundry.utils;

let _contextMenuClass = null;
export const ContextMenuClass = () => {
  if (_contextMenuClass !== null) {
    return _contextMenuClass;
  }

  if (typeof game === "undefined" || !game.version) {
    console.warn(
      "ContextMenuClass: game object not available yet, using fallback"
    );
    return ContextMenu;
  }

  const version = game.version || game.data?.version;
  const majorVersion = parseInt(version.split(".")[0]);

  if (majorVersion >= 13) {
    _contextMenuClass =
      foundry.applications.ux.ContextMenu?.implementation ||
      foundry.applications.ux.ContextMenu;
  } else {
    _contextMenuClass = ContextMenu;
  }

  return _contextMenuClass;
};
