export interface AppSettings {
  navPos?: 'side' | 'top';
  theme?: 'light' | 'dark';
  dir?: 'ltr' | 'rtl';
  showHeader?: boolean;
  headerPos?: 'fixed' | 'static' | 'above';
  showUserPanel?: boolean;
  sidenavOpened?: boolean;
  sidenavCollapsed?: boolean;
  language?: string;
}

export const defaults: AppSettings = {
  navPos: 'side',
  theme: 'light',
  dir: 'ltr',
  showHeader: true,
  headerPos: 'fixed',
  showUserPanel: false, //TODO: Disabled by LRUIZ
  sidenavOpened: true,
  sidenavCollapsed: false,
  language: 'es-ES',
};

