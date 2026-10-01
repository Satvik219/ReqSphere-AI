import { projects } from '../mocks/projects'; import { requirements } from '../mocks/requirements'; import { evidence } from '../mocks/evidence'; import { conflicts,gaps,changes } from '../mocks/conflicts';
import { apiClient, useMockData } from '../api/client'; import { endpoints } from '../api/endpoints';
const pause=v=>new Promise(r=>setTimeout(()=>r(v),350)); const id='healthcare';
export const projectService={list:()=>useMockData?pause(projects):apiClient(endpoints.projects),get:projectId=>useMockData?pause(projects.find(x=>x.id===projectId)??projects[0]):apiClient(`${endpoints.projects}/${projectId}`)};
export const requirementService={list:()=>useMockData?pause(requirements):apiClient(endpoints.requirements(id))};
export const evidenceService={list:()=>useMockData?pause(evidence):apiClient(endpoints.evidence(id))};
export const intelligenceService={conflicts:()=>useMockData?pause(conflicts):apiClient(endpoints.conflicts(id)),gaps:()=>useMockData?pause(gaps):apiClient(endpoints.gaps(id)),changes:()=>useMockData?pause(changes):apiClient(endpoints.changes(id))};
