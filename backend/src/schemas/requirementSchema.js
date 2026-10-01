import { z } from 'zod';

export const sourceLocationSchema = z.object({
  evidenceId: z.string().min(1),
  page: z.number().int().positive().optional(),
  timestamp: z.string().min(1).optional(),
  sheet: z.string().min(1).optional(),
  row: z.number().int().positive().optional(),
  column: z.union([z.string().min(1), z.number().int().positive()]).optional(),
  imageReference: z.string().min(1).optional(),
});

export const extractedRequirementSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  type: z.enum(['FUNCTIONAL', 'NON_FUNCTIONAL', 'BUSINESS_RULE', 'DATA', 'INTERFACE', 'SECURITY']),
  priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
  confidence: z.number().min(0).max(1),
  sourceEvidenceIds: z.array(z.string().min(1)).min(1),
  sourceLocations: z.array(sourceLocationSchema).min(1),
});

export const extractionResponseSchema = z.object({
  requirements: z.array(extractedRequirementSchema),
});

export const extractionResponseJsonSchema = {
  type: 'OBJECT',
  properties: {
    requirements: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING' },
          description: { type: 'STRING' },
          type: { type: 'STRING', enum: ['FUNCTIONAL', 'NON_FUNCTIONAL', 'BUSINESS_RULE', 'DATA', 'INTERFACE', 'SECURITY'] },
          priority: { type: 'STRING', enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] },
          confidence: { type: 'NUMBER' },
          sourceEvidenceIds: { type: 'ARRAY', items: { type: 'STRING' } },
          sourceLocations: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                evidenceId: { type: 'STRING' },
                page: { type: 'INTEGER' },
                timestamp: { type: 'STRING' },
                sheet: { type: 'STRING' },
                row: { type: 'INTEGER' },
                column: { type: 'STRING' },
                imageReference: { type: 'STRING' },
              },
              required: ['evidenceId'],
            },
          },
        },
        required: ['title', 'description', 'type', 'priority', 'confidence', 'sourceEvidenceIds', 'sourceLocations'],
      },
    },
  },
  required: ['requirements'],
};

export function validateEvidenceReferences(requirements, evidenceId) {
  for (const requirement of requirements) {
    if (requirement.sourceEvidenceIds.length === 0 || requirement.sourceEvidenceIds.some(sourceId => sourceId !== evidenceId)) {
      throw new Error('An extracted requirement does not reference its source evidence.');
    }
    if (requirement.sourceLocations.some(location => location.evidenceId !== evidenceId)) {
      throw new Error('An extracted requirement references a different evidence source location.');
    }
  }
  return requirements;
}