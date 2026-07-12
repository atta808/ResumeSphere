import useSection from './useSection';
import {
  educationRepository,
  experienceRepository,
  projectsRepository,
  skillsRepository,
  languagesRepository,
  certificatesRepository,
  awardsRepository,
} from '../repositories/SectionRepositories';

export const useEducation = () => useSection(educationRepository);
export const useExperience = () => useSection(experienceRepository);
export const useProjects = () => useSection(projectsRepository);
export const useSkills = () => useSection(skillsRepository);
export const useLanguages = () => useSection(languagesRepository);
export const useCertificates = () => useSection(certificatesRepository);
export const useAwards = () => useSection(awardsRepository);
