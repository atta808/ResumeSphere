export class PortfolioThemeEngine {
  constructor() {
    this.themes = {
      light: {
        background: '#ffffff',
        text: '#1a1a1a',
        surface: '#f5f5f5',
        border: '#e0e0e0',
      },
      dark: {
        background: '#121212',
        text: '#ffffff',
        surface: '#1e1e1e',
        border: '#333333',
      }
    };
    this.fonts = {
      sans: "'Inter', sans-serif",
      serif: "'Merriweather', serif",
      mono: "'Fira Code', monospace"
    };
  }

  getThemeOptions() {
    return Object.keys(this.themes);
  }

  getFontOptions() {
    return Object.keys(this.fonts);
  }

  buildCSSVariables(settings) {
    const themeMode = settings?.theme || 'light';
    const baseTheme = this.themes[themeMode] || this.themes.light;

    const primaryColor = settings?.primaryColor || '#007AFF';
    const accentColor = settings?.accentColor || '#5AC8FA';
    const typography = settings?.typography || 'sans';
    const fontFamily = this.fonts[typography] || this.fonts.sans;

    return `
      :root {
        --bg-color: ${baseTheme.background};
        --text-color: ${baseTheme.text};
        --surface-color: ${baseTheme.surface};
        --border-color: ${baseTheme.border};
        --primary-color: ${primaryColor};
        --accent-color: ${accentColor};
        --font-family: ${fontFamily};
      }
    `;
  }
}
