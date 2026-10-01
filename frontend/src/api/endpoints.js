export const endpoints = {
  projects: '/projects',
  requirements: projectId => `/projects/${projectId}/requirements`,
  evidence: projectId => `/projects/${projectId}/evidence`,
  gapAnswer: gapId => `/gaps/${gapId}/answer`,
  gapConvert: gapId => `/gaps/${gapId}/convert-to-requirement`,
  gapDismiss: gapId => `/gaps/${gapId}/dismiss`,
  conflicts: projectId => `/projects/${projectId}/conflicts`,
  gaps: projectId => `/projects/${projectId}/gaps`,
  risks: projectId => `/projects/${projectId}/risks`,
  dependencies: projectId => `/projects/${projectId}/dependencies`,
  brd: projectId => `/projects/${projectId}/brd`,
  changes: projectId => `/projects/${projectId}/changes`,
};
