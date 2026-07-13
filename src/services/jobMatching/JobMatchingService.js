import ErrorHandler from '../ErrorHandler';
import JobMatchRepository from '../../repositories/JobMatchRepository';
import JobDescriptionService from './JobDescriptionService';
import JobMatchingEngine from './JobMatchingEngine';
import ResumeService from '../resume/ResumeService';
import ProfileService from '../profile/ProfileService';
import { createJobMatch } from '../../models/factories';

class JobMatchingService {
  /**
   * Main entry point for performing a job match.
   * Handles caching logic and invokes the engine.
   */
  async performMatch(resumeId, jobDescriptionId) {
    try {
      // 1. Fetch dependencies
      const resume = await ResumeService.getResumeById(resumeId);
      if (!resume) throw new Error('Resume not found');

      const profile = await ProfileService.getFullProfile(resume.profileId);
      if (!profile) throw new Error('Profile not found');

      const jobDescription = await JobDescriptionService.getJobDescriptionById(jobDescriptionId);
      if (!jobDescription) throw new Error('Job Description not found');

      // 2. Check Cache
      const latestMatch = await JobMatchRepository.getLatestMatch(resumeId, jobDescriptionId);

      if (latestMatch) {
        const resumeUpdated = new Date(resume.updatedAt).getTime();
        const jobUpdated = new Date(jobDescription.updatedAt).getTime();
        const matchCreated = new Date(latestMatch.createdAt).getTime();

        // If neither the resume nor the job description has changed since the match was created, return cached.
        if (resumeUpdated < matchCreated && jobUpdated < matchCreated) {
          return latestMatch;
        }
      }

      // 3. Run Analysis
      const analysisResult = await JobMatchingEngine.runAnalysis(resume, profile, jobDescription);

      // 4. Create Match Record
      const matchData = {
        ...analysisResult,
        resumeId,
        jobDescriptionId,
      };

      const jobMatch = createJobMatch(matchData);

      // 5. Save to Database
      await JobMatchRepository.createJobMatch(jobMatch);

      return jobMatch;

    } catch (error) {
      ErrorHandler.logError(error, { context: 'JobMatchingService.performMatch' });
      throw error;
    }
  }

  async getMatchHistoryByResume(resumeId) {
    try {
      return await JobMatchRepository.getJobMatchesByResumeId(resumeId);
    } catch (error) {
       ErrorHandler.logError(error, { context: 'JobMatchingService.getMatchHistoryByResume' });
       throw error;
    }
  }

  async getMatchById(id) {
    try {
      return await JobMatchRepository.getJobMatchById(id);
    } catch (error) {
       ErrorHandler.logError(error, { context: 'JobMatchingService.getMatchById' });
       throw error;
    }
  }
}

export default new JobMatchingService();
