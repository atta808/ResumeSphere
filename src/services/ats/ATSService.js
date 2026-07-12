import ProviderRegistry from './ProviderRegistry';
import ATSHistoryRepository from '../../repositories/ATSHistoryRepository';
import ResumeService from '../resume/ResumeService';
import LocalATSProvider from './LocalATSProvider';

// Register the default local provider
ProviderRegistry.registerProvider('LocalATSProvider', LocalATSProvider, true);

class ATSService {
  static async analyzeResume(resumeId, providerName = null) {
    try {
        // Fetch full resume data including profile
        const resume = await ResumeService.getResumeById(resumeId);
        if (!resume) throw new Error('Resume not found');

        // 1. Check Cache
        const latestHistory = await ATSHistoryRepository.getLatestForResume(resumeId);

        if (latestHistory) {
            const resumeUpdatedAt = new Date(resume.updatedAt).getTime();
            const historyCreatedAt = new Date(latestHistory.createdAt).getTime();

            // If resume hasn't changed since last scan, return cached result
            if (resumeUpdatedAt <= historyCreatedAt && latestHistory.reportData) {
                console.log('Returning cached ATS report');
                return JSON.parse(latestHistory.reportData);
            }
        }

        // 2. Not cached or resume updated, run new analysis
        const provider = ProviderRegistry.getProvider(providerName);
        const report = await provider.analyze(resume);

        // 3. Store new history
        await ATSHistoryRepository.createHistory(resumeId, report);

        return report;
    } catch (error) {
        console.error('Error analyzing resume:', error);
        throw error;
    }
  }
}

export default ATSService;
