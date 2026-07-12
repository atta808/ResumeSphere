import BaseAIProvider from './BaseAIProvider';
import { AI_CONFIG } from '../../config/ai';
import ENV from '../../config/env';

class DeepSeekProvider extends BaseAIProvider {
  constructor() {
    super();
    this.config = AI_CONFIG.deepseek;
  }

  async initialize() {
    if (!ENV.DEEPSEEK_API_KEY) {
      throw new Error('DeepSeek API key is missing. Check your environment variables.');
    }
  }

  /**
   * Generates a chat completion
   * Supports exponential backoff and timeout
   */
  async generateCompletion(prompt, systemMessage = null, abortSignal = null) {
    let attempt = 0;
    while (attempt < this.config.retryCount) {
      try {
        return await this._makeRequest(prompt, systemMessage, abortSignal);
      } catch (error) {
        if (error.name === 'AbortError') {
          throw new Error('Request cancelled by user.');
        }

        attempt++;
        if (attempt >= this.config.retryCount) {
          throw new Error(\`DeepSeek API Error: \${error.message}\`);
        }

        // Exponential backoff
        const delay = this.config.baseRetryDelayMs * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  async _makeRequest(prompt, systemMessage, abortSignal) {
    const messages = [];
    if (systemMessage) {
      messages.push({ role: 'system', content: systemMessage });
    }
    messages.push({ role: 'user', content: prompt });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    // Merge provided abort signal with timeout
    if (abortSignal) {
      abortSignal.addEventListener('abort', () => controller.abort());
    }

    try {
      const response = await fetch(\`\${this.config.baseUrl}/chat/completions\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${ENV.DEEPSEEK_API_KEY}\`,
        },
        body: JSON.stringify({
          model: this.config.defaultModel,
          messages,
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || \`HTTP error! status: \${response.status}\`);
      }

      const data = await response.json();

      return {
        content: data.choices?.[0]?.message?.content || '',
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0,
        },
        model: data.model || this.config.defaultModel,
        provider: 'DEEPSEEK',
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // --- BaseAIProvider implementations ---

  async generateResume(prompt) {
    return this.generateCompletion(prompt);
  }

  async analyzeResume(profileContext) {
    return this.generateCompletion('Analyze this resume data: ' + JSON.stringify(profileContext));
  }

  async improveSection(sectionContent) {
    return this.generateCompletion(\`Improve this section: \${sectionContent}\`);
  }
}

export default DeepSeekProvider;
