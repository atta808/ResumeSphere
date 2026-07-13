import BaseRepository from './BaseRepository';

class JobDescriptionRepository extends BaseRepository {
  constructor() {
    super('job_descriptions');
  }

  // Method to get all job descriptions
  async getAllJobDescriptions() {
    return this.findAll();
  }

  // Method to get a specific job description
  async getJobDescriptionById(id) {
    return this.findById(id);
  }

  // Method to create a new job description
  async createJobDescription(data) {
    return this.create(data);
  }

  // Method to update an existing job description
  async updateJobDescription(id, data) {
    return this.update(id, data);
  }

  // Method to delete a job description
  async deleteJobDescription(id) {
    return this.delete(id);
  }
}

export default new JobDescriptionRepository();
