import ProfileRepository from '../../repositories/ProfileRepository';
import {
  educationRepository,
  experienceRepository,
  projectsRepository,
  skillsRepository,
  languagesRepository,
  certificatesRepository,
  awardsRepository,
  referencesRepository,
  customSectionsRepository
} from '../../repositories/SectionRepositories';

class ProfileService {
  /**
   * Fetch a full career profile including all related sections
   * @param {string} profileId
   */
  static async getFullProfile(profileId) {
    const profile = await ProfileRepository.findById(profileId);
    if (!profile) return null;

    const [
      education,
      experience,
      projects,
      skills,
      languages,
      certificates,
      awards,
      references,
      customSections
    ] = await Promise.all([
      educationRepository.findAll(profileId),
      experienceRepository.findAll(profileId),
      projectsRepository.findAll(profileId),
      skillsRepository.findAll(profileId),
      languagesRepository.findAll(profileId),
      certificatesRepository.findAll(profileId),
      awardsRepository.findAll(profileId),
      referencesRepository.findAll(profileId),
      customSectionsRepository.findAll(profileId)
    ]);

    return {
      ...profile,
      education,
      experience,
      projects,
      skills,
      languages,
      certificates,
      awards,
      references,
      customSections
    };
  }

  static async saveProfile(profileData) {
    // Determine if insert or update
    const existing = await ProfileRepository.findById(profileData.id);
    if (existing) {
      profileData.updatedAt = new Date().toISOString();
      return await ProfileRepository.update(profileData.id, profileData);
    } else {
      return await ProfileRepository.create(profileData);
    }
  }

  static async deleteProfile(profileId) {
    // Soft delete the main profile
    await ProfileRepository.delete(profileId, true);
    // Note: depending on business logic, we could soft delete child sections as well,
    // or let them be ignored by querying based on parent profile deletion status.
  }
}

export default ProfileService;
