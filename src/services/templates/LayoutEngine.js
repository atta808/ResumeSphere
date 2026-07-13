class LayoutEngine {
  static getPageStyles(customization = {}) {
    const layout = customization.layout || 'A4';
    const margin = customization.margin || '20mm';

    // Base layout settings for page sizes
    const pageDimensions = {
      'A4': '210mm 297mm',
      'Letter': '8.5in 11in'
    };

    const dimension = pageDimensions[layout] || pageDimensions['A4'];

    return `
      @page {
        size: ${dimension};
        margin: ${margin};
      }

      body {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      .page-break {
        page-break-before: always;
      }
    `;
  }
}

export default LayoutEngine;
