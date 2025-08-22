export type AppV2RenderContext =
  foundry.applications.api.ApplicationV2.RenderContext;

export type AppV2RenderOptions =
  foundry.applications.api.ApplicationV2.RenderOptions;

export type HandlebarsTemplatePart =
  foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart;

export type DefaultOptions =
  foundry.applications.api.ApplicationV2.DefaultOptions;

export type Context = AppV2RenderContext & {
  users: {
    id: string;
    name: string;
  }[];
  imageUrl: string[];
};
