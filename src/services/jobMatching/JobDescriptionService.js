import ErrorHandler from '../ErrorHandler';
import JobDescriptionRepository from '../../repositories/JobDescriptionRepository';
import JobDescriptionParser from './JobDescriptionParser';
import { createJobDescription } from '../../models/factories';

class JobDescriptionService {
  async getAllJobDescriptions() {
    try {
      return await JobDescriptionRepository.getAllJobDescriptions();
    } catch (error) {
      ErrorHandler.logError(error, { context: 'JobDescriptionService.getAllJobDescriptions' });
      throw error;
    }
  }

  async getJobDescriptionById(id) {
    try {
      return await JobDescriptionRepository.getJobDescriptionById(id);
    } catch (error) {
      ErrorHandler.logError(error, { context: 'JobDescriptionService.getJobDescriptionById' });
      throw error;
    }
  }

  /**
   * Processes raw text (e.g. from Paste or OCR) into a structured Job Description
   * and saves it to the database.
   */
  async importJobDescription(rawText, metadata = {}) {
    try {
      // 1. Parse the text
      const parsedData = JobDescriptionParser.parse(rawText);

      // 2. Merge with any provided metadata (e.g., from user input)
      const mergedData = {
        ...parsedData,
        ...metadata,
      };

      // 3. Create the model
      const jobDescription = createJobDescription(mergedData);

      // 4. Save to DB
      await JobDescriptionRepository.createJobDescription(jobDescription);

      return jobDescription;
    } catch (error) {
      ErrorHandler.logError(error, { context: 'JobDescriptionService.importJobDescription' });
      throw error;
    }
  }

  async updateJobDescription(id, data) {
    try {
      await JobDescriptionRepository.updateJobDescription(id, data);
      return await this.getJobDescriptionById(id);
    } catch (error) {
      ErrorHandler.logError(error, { context: 'JobDescriptionService.updateJobDescription' });
      throw error;
    }
  }

  async deleteJobDescription(id) {
    try {
      await JobDescriptionRepository.deleteJobDescription(id);
    } catch (error) {
      ErrorHandler.logError(error, { context: 'JobDescriptionService.deleteJobDescription' });
      throw error;
    }
  }
}

export default new JobDescriptionService();
