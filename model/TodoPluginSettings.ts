export interface TodoPluginSettings {
  dateFormat: string;
  dateTagFormat: string;
}

export const DEFAULT_SETTINGS: TodoPluginSettings = {
  dateFormat: 'yyyy-MM-dd',
  dateTagFormat: '#%date%',
};
