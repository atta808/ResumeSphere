import BaseRepository from './BaseRepository';

class EducationRepository extends BaseRepository {
  constructor() {
    super('education');
  }
}

class ExperienceRepository extends BaseRepository {
  constructor() {
    super('experience');
  }
}

class ProjectsRepository extends BaseRepository {
  constructor() {
    super('projects');
  }
}

class SkillsRepository extends BaseRepository {
  constructor() {
    super('skills');
  }
}

class LanguagesRepository extends BaseRepository {
  constructor() {
    super('languages');
  }
}

class CertificatesRepository extends BaseRepository {
  constructor() {
    super('certificates');
  }
}

class AwardsRepository extends BaseRepository {
  constructor() {
    super('awards');
  }
}

class ReferencesRepository extends BaseRepository {
  constructor() {
    super('references_table');
  }
}

class CustomSectionsRepository extends BaseRepository {
  constructor() {
    super('custom_sections');
  }
}

export const educationRepository = new EducationRepository();
export const experienceRepository = new ExperienceRepository();
export const projectsRepository = new ProjectsRepository();
export const skillsRepository = new SkillsRepository();
export const languagesRepository = new LanguagesRepository();
export const certificatesRepository = new CertificatesRepository();
export const awardsRepository = new AwardsRepository();
export const referencesRepository = new ReferencesRepository();
export const customSectionsRepository = new CustomSectionsRepository();
