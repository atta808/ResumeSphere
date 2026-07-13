import BaseRepository from './BaseRepository';

class JobMatchRepository extends BaseRepository {
  constructor() {
    super('job_matches');
  }

  // Method to get a specific job match
  async getJobMatchById(id) {
    return this.findById(id);
  }

  // Method to get all job matches for a given resume
  async getJobMatchesByResumeId(resumeId) {
    return this.findByCondition('resumeId = ?', [resumeId]);
  }

  // Method to get the latest match for a specific resume and job description
  async getLatestMatch(resumeId, jobDescriptionId) {
    return this.findOneByCondition(
      'resumeId = ? AND jobDescriptionId = ? ORDER BY createdAt DESC',
      [resumeId, jobDescriptionId]
    );
  }

  // Method to create a new job match
  async createJobMatch(data) {
    return this.create(data);
  }

  // Method to update an existing job match
  async updateJobMatch(id, data) {
    return this.update(id, data);
  }

  // Method to delete a job match
  async deleteJobMatch(id) {
    return this.delete(id);
  }

  // Method to delete all matches for a given resume
  async deleteMatchesByResumeId(resumeId) {
    return this.deleteByCondition('resumeId = ?', [resumeId]);
  }
}

export default new JobMatchRepository();
