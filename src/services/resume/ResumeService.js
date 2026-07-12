import ResumeRepository from '../../repositories/ResumeRepository';
import ProfileRepository from '../../repositories/ProfileRepository';
import { createResume, createProfile } from '../../models/factories';

class ResumeService {
  /**
   * Initialize a master profile if it doesn't exist, and return it.
   */
  static async getOrCreateMasterProfile() {
    let profiles = await ProfileRepository.findAll();
    if (profiles.length === 0) {
      const newProfile = createProfile({ fullName: 'My Master Profile' });
      await ProfileRepository.create(newProfile);
      return newProfile;
    }
    return profiles[0]; // For now, use the first one as master
  }

  static async getActiveResumes() {
    return await ResumeRepository.findAllActive();
  }

  static async getArchivedResumes() {
    return await ResumeRepository.findAllArchived();
  }

  static async getResumeById(id) {
    return await ResumeRepository.findById(id);
  }

  static async createResume(resumeData) {
    // Ensure we have a profile to link to
    let profileId = resumeData.profileId;
    if (!profileId) {
      const masterProfile = await this.getOrCreateMasterProfile();
      profileId = masterProfile.id;
    }

    const newResume = createResume({ ...resumeData, profileId });
    return await ResumeRepository.create(newResume);
  }

  static async updateResume(id, updateData) {
    updateData.updatedAt = new Date().toISOString();
    return await ResumeRepository.update(id, updateData);
  }

  static async duplicateResume(id, newName) {
    const existing = await ResumeRepository.findById(id);
    if (!existing) throw new Error('Resume not found');

    const duplicateData = {
      ...existing,
      id: undefined, // Let factory generate new ID
      resumeName: newName || `${existing.resumeName} (Copy)`,
      createdAt: undefined,
      updatedAt: undefined,
      isArchived: 0
    };

    const newResume = createResume(duplicateData);
    return await ResumeRepository.create(newResume);
  }

  static async toggleArchiveResume(id, isArchived) {
    return await ResumeRepository.toggleArchive(id, isArchived);
  }

  static async deleteResume(id) {
    return await ResumeRepository.delete(id, true); // Soft delete
  }

  static async searchResumes(query) {
      return await ResumeRepository.search(query);
  }
}

export default ResumeService;
