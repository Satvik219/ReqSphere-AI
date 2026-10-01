import { describe, expect, it } from 'vitest';
import { parseAndValidateRequirementResponse } from './requirementAgent.js';

const validRequirement = {
  title: 'Appointment cancellation window',
  description: 'Patients may cancel up to two hours before an appointment.',
  type: 'BUSINESS_RULE',
  priority: 'HIGH',
  confidence: 0.94,
  sourceEvidenceIds: ['evidence-123'],
  sourceLocations: [{ evidenceId: 'evidence-123', page: 4 }],
};

describe('requirement extraction validation', () => {
  it('accepts structured requirements with matching evidence references', () => {
    const result = parseAndValidateRequirementResponse(
      JSON.stringify({ requirements: [validRequirement] }),
      'evidence-123',
    );

    expect(result).toEqual([validRequirement]);
  });

  it('rejects malformed JSON', () => {
    expect(() => parseAndValidateRequirementResponse('{invalid', 'evidence-123'))
      .toThrow(SyntaxError);
  });

  it('rejects data that does not match the Zod schema', () => {
    expect(() => parseAndValidateRequirementResponse(
      JSON.stringify({ requirements: [{ ...validRequirement, confidence: 1.4 }] }),
      'evidence-123',
    )).toThrow();
  });

  it('rejects citations to evidence other than the submitted source', () => {
    const requirement = {
      ...validRequirement,
      sourceEvidenceIds: ['evidence-123', 'evidence-456'],
    };
    expect(() => parseAndValidateRequirementResponse(
      JSON.stringify({ requirements: [requirement] }),
      'evidence-123',
    )).toThrow(/source evidence/i);
  });
});