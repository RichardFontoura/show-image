export class HandlebarsApplication extends foundry.applications.api.HandlebarsApplicationMixin(
  foundry.applications.api.ApplicationV2
) {}

export const MODULE_ID = "show-image";

export const FilePicker = foundry.applications.apps.FilePicker.implementation;

export function i18nLocalize(key: string, fallback: string = ""): string {
  return (game as Game).i18n?.localize(`${MODULE_ID}.${key}`) ?? fallback;
}

export function i18nLocalizeFormat(
  key: string,
  format: Record<string, string>,
  fallback: string = ""
): string {
  return (game as Game).i18n?.format(`${MODULE_ID}.${key}`, format) ?? fallback;
}

export function getModule(_module: string = MODULE_ID) {
  const module = (game as Game).modules?.get(_module);
  if (!module) {
    throw new Error(`Module ${_module} not found`);
  }
  return module;
}

export function registerHandlebarsHelpers() {
  try {
    const hb = (globalThis as any).Handlebars;
    if (!hb) {
      console.warn(`[${MODULE_ID}] Handlebars not found to register helpers.`);
      return;
    }

    if (!hb.helpers?.math) {
      hb.registerHelper("math", function (lvalue: unknown, operator: string, rvalue: unknown) {
        const left = Number(lvalue);
        const right = Number(rvalue);

        switch (operator as "+" | "-" | "*" | "/" | "%") {
          case "+": return left + right;
          case "-": return left - right;
          case "*": return left * right;
          case "/": return left / right;
          case "%": return left % right;
          default:
            console.warn(`[${MODULE_ID}] Invalid operator for math helper:`, operator);
            return NaN;
        }
      });
    }
  } catch (err) {
    console.error(`[${MODULE_ID}] Failed to register Handlebars helpers:`, err);
  }
}
