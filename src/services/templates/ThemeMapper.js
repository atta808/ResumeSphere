class ThemeMapper {
  static getCSSVariables(theme, customization = {}) {
    const primaryColor = customization.primaryColor || theme.primary;
    const accentColor = customization.accentColor || theme.accent || primaryColor;
    const backgroundColor = customization.backgroundColor || '#ffffff';
    const textColor = customization.textColor || '#333333';

    // Convert to CSS string
    return `
      :root {
        --primary-color: ${primaryColor};
        --accent-color: ${accentColor};
        --background-color: ${backgroundColor};
        --text-color: ${textColor};
        --font-family: ${customization.fontFamily || 'Inter, sans-serif'};
        --font-size-base: ${customization.fontSize || 12}pt;
        --spacing-base: ${customization.spacing || '1em'};
      }
    `;
  }
}

export default ThemeMapper;
