import BaseRenderer from '../BaseRenderer';

const StandardDocument = {
  id: 'StandardDocument',
  name: 'Standard Document',
  category: 'Document',
  previewImage: null,

  styles: `
    .document-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      font-family: var(--font-family, Arial, sans-serif);
      color: var(--text-color, #333);
      line-height: 1.6;
    }
    .header {
      margin-bottom: 40px;
      border-bottom: 2px solid var(--primary-color, #000);
      padding-bottom: 20px;
    }
    .header h1 {
      margin: 0 0 10px 0;
      color: var(--primary-color, #000);
    }
    .contact-info {
      font-size: 0.9em;
      color: var(--text-secondary, #666);
    }
    .content {
      white-space: pre-wrap;
      font-size: var(--font-size-base, 11pt);
    }
  `,

  renderer: (resumeData, customization) => {
    // We expect the document content to be passed in some field,
    // since TemplateEngine expects resumeData.
    // For documents, we can pass a fake resumeData object containing { isDocument: true, profile: {...}, content: "..." }

    if (resumeData && resumeData.isDocument) {
      return `
        <div class="document-container">
          <div class="header">
            <h1>${BaseRenderer.escapeHtml(resumeData.profile?.firstName || '')} ${BaseRenderer.escapeHtml(resumeData.profile?.lastName || '')}</h1>
            <div class="contact-info">
              ${resumeData.profile?.email ? `<span>${BaseRenderer.escapeHtml(resumeData.profile.email)}</span>` : ''}
              ${resumeData.profile?.phone ? ` | <span>${BaseRenderer.escapeHtml(resumeData.profile.phone)}</span>` : ''}
            </div>
          </div>
          <div class="content">
            ${BaseRenderer.escapeHtml(resumeData.content || '')}
          </div>
        </div>
      `;
    }

    return `<div class="document-container"><div class="content">Invalid document data provided.</div></div>`;
  }
};

export default StandardDocument;
