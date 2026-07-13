import { generateUUID } from '../utils/helpers';

/**
 * Creates a master Career Profile
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim();
};

export const createProfile = (data = {}) => {
  const now = new Date().toISOString();
  return {
    id: data.id || generateUUID(),

    // Personal Information
    fullName: sanitizeString(data.fullName),
    professionalTitle: sanitizeString(data.professionalTitle),
    email: sanitizeString(data.email).toLowerCase(),
    phone: sanitizeString(data.phone),
    country: sanitizeString(data.country),
    city: sanitizeString(data.city),
    address: sanitizeString(data.address),
    website: sanitizeString(data.website),
    linkedIn: sanitizeString(data.linkedIn),
    gitHub: sanitizeString(data.gitHub),
    portfolio: sanitizeString(data.portfolio),
    dateOfBirth: data.dateOfBirth || null,
    nationality: sanitizeString(data.nationality),
    profilePhoto: sanitizeString(data.profilePhoto) || null,

    // Professional Summary
    summary: sanitizeString(data.summary),

    // Meta
    createdAt: data.createdAt || now,
    updatedAt: now,
    deletedAt: data.deletedAt || null,
  };
};

export const createJobDescription = (data = {}) => {
  const now = new Date().toISOString();
  return {
    id: data.id || generateUUID(),
    companyName: sanitizeString(data.companyName),
    jobTitle: sanitizeString(data.jobTitle),
    location: sanitizeString(data.location),
    employmentType: sanitizeString(data.employmentType),
    salary: sanitizeString(data.salary),
    experienceRequired: sanitizeString(data.experienceRequired),
    educationRequired: sanitizeString(data.educationRequired),
    requiredSkills: sanitizeString(data.requiredSkills),
    preferredSkills: sanitizeString(data.preferredSkills),
    responsibilities: sanitizeString(data.responsibilities),
    qualifications: sanitizeString(data.qualifications),
    certifications: sanitizeString(data.certifications),
    languages: sanitizeString(data.languages),
    benefits: sanitizeString(data.benefits),
    originalText: sanitizeString(data.originalText),
    parsedVersion: sanitizeString(data.parsedVersion),
    createdAt: data.createdAt || now,
    updatedAt: now,
  };
};

export const createJobMatch = (data = {}) => {
  const now = new Date().toISOString();
  return {
    id: data.id || generateUUID(),
    resumeId: data.resumeId || null,
    jobDescriptionId: data.jobDescriptionId || null,
    overallScore: data.overallScore || 0,
    skillsScore: data.skillsScore || 0,
    experienceScore: data.experienceScore || 0,
    educationScore: data.educationScore || 0,
    keywordScore: data.keywordScore || 0,
    responsibilityScore: data.responsibilityScore || 0,
    certificationScore: data.certificationScore || 0,
    languageScore: data.languageScore || 0,
    matchedItems: sanitizeString(data.matchedItems),
    missingItems: sanitizeString(data.missingItems),
    extraItems: sanitizeString(data.extraItems),
    recommendations: sanitizeString(data.recommendations),
    processingTime: data.processingTime || 0,
    provider: sanitizeString(data.provider),
    algorithmVersion: sanitizeString(data.algorithmVersion) || '1.0',
    createdAt: data.createdAt || now,
    updatedAt: now,
  };
};

export const createResume = (data = {}) => {
  const now = new Date().toISOString();
  return {
    id: data.id || generateUUID(),
    profileId: data.profileId || null,
    resumeName: sanitizeString(data.resumeName) || 'Untitled Resume',
    templateId: data.templateId || 'default',
    isArchived: data.isArchived ? 1 : 0,
    targetJobTitle: sanitizeString(data.targetJobTitle),
    companyName: sanitizeString(data.companyName),
    resumeVersion: data.resumeVersion || 1,
    atsScore: data.atsScore || 0,
    language: sanitizeString(data.language) || 'en',
    lastExportedAt: data.lastExportedAt || null,
    createdAt: data.createdAt || now,
    updatedAt: now,
    deletedAt: data.deletedAt || null,
  };
};

export const createEducation = (data = {}) => {
  const now = new Date().toISOString();
  return {
    id: data.id || generateUUID(),
    profileId: data.profileId || null,
    institution: sanitizeString(data.institution),
    degree: sanitizeString(data.degree),
    fieldOfStudy: sanitizeString(data.fieldOfStudy),
    startDate: data.startDate || null,
    endDate: data.endDate || null,
    isCurrent: data.isCurrent || false,
    score: sanitizeString(data.score),
    description: sanitizeString(data.description),
    order: data.order !== undefined ? data.order : 0,
    isVisible: data.isVisible !== undefined ? data.isVisible : true,
    createdAt: data.createdAt || now,
    updatedAt: now,
    deletedAt: data.deletedAt || null,
  };
};

export const createExperience = (data = {}) => {
  const now = new Date().toISOString();
  return {
    id: data.id || generateUUID(),
    profileId: data.profileId || null,
    company: sanitizeString(data.company),
    position: sanitizeString(data.position),
    location: sanitizeString(data.location),
    employmentType: sanitizeString(data.employmentType),
    startDate: data.startDate || null,
    endDate: data.endDate || null,
    isCurrent: data.isCurrent || false,
    description: sanitizeString(data.description),
    order: data.order !== undefined ? data.order : 0,
    isVisible: data.isVisible !== undefined ? data.isVisible : true,
    createdAt: data.createdAt || now,
    updatedAt: now,
    deletedAt: data.deletedAt || null,
  };
};

export const createProject = (data = {}) => {
  const now = new Date().toISOString();
  return {
    id: data.id || generateUUID(),
    profileId: data.profileId || null,
    name: sanitizeString(data.name),
    role: sanitizeString(data.role),
    url: sanitizeString(data.url),
    startDate: data.startDate || null,
    endDate: data.endDate || null,
    isCurrent: data.isCurrent || false,
    description: sanitizeString(data.description),
    technologies: Array.isArray(data.technologies) ? data.technologies : [], // usually stringified for DB storage depending on schema
    order: data.order !== undefined ? data.order : 0,
    isVisible: data.isVisible !== undefined ? data.isVisible : true,
    createdAt: data.createdAt || now,
    updatedAt: now,
    deletedAt: data.deletedAt || null,
  };
};

export const createSkill = (data = {}) => {
  const now = new Date().toISOString();
  return {
    id: data.id || generateUUID(),
    profileId: data.profileId || null,
    name: sanitizeString(data.name),
    category: sanitizeString(data.category), // e.g. technical, soft
    level: sanitizeString(data.level), // e.g. beginner, intermediate, expert
    order: data.order !== undefined ? data.order : 0,
    isVisible: data.isVisible !== undefined ? data.isVisible : true,
    createdAt: data.createdAt || now,
    updatedAt: now,
    deletedAt: data.deletedAt || null,
  };
};

export const createLanguage = (data = {}) => {
  const now = new Date().toISOString();
  return {
    id: data.id || generateUUID(),
    profileId: data.profileId || null,
    name: sanitizeString(data.name),
    proficiency: sanitizeString(data.proficiency),
    order: data.order !== undefined ? data.order : 0,
    isVisible: data.isVisible !== undefined ? data.isVisible : true,
    createdAt: data.createdAt || now,
    updatedAt: now,
    deletedAt: data.deletedAt || null,
  };
};

export const createCertificate = (data = {}) => {
  const now = new Date().toISOString();
  return {
    id: data.id || generateUUID(),
    profileId: data.profileId || null,
    name: sanitizeString(data.name),
    issuer: sanitizeString(data.issuer),
    issueDate: data.issueDate || null,
    expirationDate: data.expirationDate || null,
    credentialId: sanitizeString(data.credentialId),
    credentialUrl: sanitizeString(data.credentialUrl),
    order: data.order !== undefined ? data.order : 0,
    isVisible: data.isVisible !== undefined ? data.isVisible : true,
    createdAt: data.createdAt || now,
    updatedAt: now,
    deletedAt: data.deletedAt || null,
  };
};

export const createAward = (data = {}) => {
  const now = new Date().toISOString();
  return {
    id: data.id || generateUUID(),
    profileId: data.profileId || null,
    title: sanitizeString(data.title),
    issuer: sanitizeString(data.issuer),
    date: data.date || null,
    description: sanitizeString(data.description),
    order: data.order !== undefined ? data.order : 0,
    isVisible: data.isVisible !== undefined ? data.isVisible : true,
    createdAt: data.createdAt || now,
    updatedAt: now,
    deletedAt: data.deletedAt || null,
  };
};

export const createReference = (data = {}) => {
  const now = new Date().toISOString();
  return {
    id: data.id || generateUUID(),
    profileId: data.profileId || null,
    name: sanitizeString(data.name),
    company: sanitizeString(data.company),
    position: sanitizeString(data.position),
    email: sanitizeString(data.email).toLowerCase(),
    phone: sanitizeString(data.phone),
    description: sanitizeString(data.description),
    order: data.order !== undefined ? data.order : 0,
    isVisible: data.isVisible !== undefined ? data.isVisible : true,
    createdAt: data.createdAt || now,
    updatedAt: now,
    deletedAt: data.deletedAt || null,
  };
};

export const createCustomSection = (data = {}) => {
  const now = new Date().toISOString();
  return {
    id: data.id || generateUUID(),
    profileId: data.profileId || null,
    title: sanitizeString(data.title),
    content: sanitizeString(data.content),
    order: data.order !== undefined ? data.order : 0,
    isVisible: data.isVisible !== undefined ? data.isVisible : true,
    createdAt: data.createdAt || now,
    updatedAt: now,
    deletedAt: data.deletedAt || null,
  };
};
