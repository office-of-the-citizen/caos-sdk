/**
 * caos-sdk — ParticipationClient contract tests.
 *
 * Verifies each ParticipationClient method calls the correct endpoint,
 * validates responses via Zod schemas, and wraps errors to CaosError.
 *
 * Uses vitest: import { describe, it, expect, vi } from 'vitest'
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ParticipationClient } from '../client.js';
import {
  ParticipationCaseSchema,
  ParticipationTimelineSchema,
  QuestionSchema,
  FOIRequestSchema,
  DemandInfoSchema,
  TransparencyProfileSchema,
  WatchResultSchema,
  SubscriptionResultSchema,
  ModuleHealthSchema,
} from '../contracts.js';

function mockAxios() {
  return {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  } as any;
}

describe('ParticipationClient — endpoint contracts', () => {
  let http: ReturnType<typeof mockAxios>;
  let client: ParticipationClient;

  beforeEach(() => {
    http = mockAxios();
    client = new ParticipationClient(http);
  });

  // === Module Health ===

  it('getModuleHealth calls GET /api/v1/participation/health', async () => {
    const mockData = {
      module: '05_participation',
      status: 'healthy',
      version: '1.0.0',
      engine_status: 'operational',
      capabilities: ['foi', 'questions', 'watches'],
    };
    http.get.mockResolvedValue({ data: { data: mockData } });

    const result = await client.getModuleHealth();

    expect(http.get).toHaveBeenCalledWith('/api/v1/participation/health');
    expect(ModuleHealthSchema.parse(result)).toEqual(mockData);
  });

  // === Questions ===

  it('createQuestion calls POST /api/v1/participation with QUESTION type', async () => {
    const mockResponse = {
      participation_id: 'q-001',
      question_text: 'What is the budget?',
      resolution_state: 'OPEN',
      demand_count: 1,
      created_at: '2026-07-01T12:00:00.000Z',
    };
    http.post.mockResolvedValue({ data: { data: mockResponse } });

    const result = await client.createQuestion({
      question_text: 'What is the budget?',
      subject_ref: 'subj:budget',
    });

    expect(http.post).toHaveBeenCalledWith('/api/v1/participation', {
      participation_type: 'QUESTION',
      question_text: 'What is the budget?',
      subject_ref: 'subj:budget',
    });
    expect(QuestionSchema.parse(result)).toEqual(mockResponse);
  });

  // === FOI Requests ===

  it('createFOIRequest calls POST /api/v1/services/foi/request', async () => {
    const mockResponse = {
      participation_id: 'foi-001',
      institution_id: 'inst:001',
      institution_name: 'Ministry of Finance',
      question_text: 'Budget breakdown',
      record_description: 'Annual budget 2026',
      lifecycle_state: 'FILED',
      delivery_state: null,
      clock_state: null,
      response_state: null,
      outcome: null,
      created_at: '2026-07-01T12:00:00.000Z',
      filed_at: '2026-07-01T12:00:00.000Z',
    };
    http.post.mockResolvedValue({ data: { data: mockResponse } });

    const params = {
      institution_id: 'inst:001',
      question_text: 'Budget breakdown',
      record_description: 'Annual budget 2026',
    };
    const result = await client.createFOIRequest(params);

    expect(http.post).toHaveBeenCalledWith('/api/v1/services/foi/request', params);
    expect(FOIRequestSchema.parse(result)).toEqual(mockResponse);
  });

  // === Contributions ===

  it('submitContribution calls POST /api/v1/participation with CONTRIBUTION type', async () => {
    const mockResponse = {
      participation_id: 'c-001',
      participation_type: 'CONTRIBUTION',
      lifecycle_state: 'COMPOSED',
      service_ref: null,
      channel: 'WEB',
      created_at: '2026-07-01T12:00:00.000Z',
      filed_at: null,
      closed_at: null,
      outcome: null,
      priority: 'STANDARD',
    };
    http.post.mockResolvedValue({ data: { data: mockResponse } });

    const result = await client.submitContribution({
      description: 'Community health data',
      artifact_refs: ['art:001'],
    });

    expect(http.post).toHaveBeenCalledWith('/api/v1/participation', {
      participation_type: 'CONTRIBUTION',
      description: 'Community health data',
      artifact_refs: ['art:001'],
    });
    expect(ParticipationCaseSchema.parse(result)).toEqual(mockResponse);
  });

  // === Corrections ===

  it('submitCorrection calls POST /api/v1/participation with CORRECTION type', async () => {
    const mockResponse = {
      participation_id: 'corr-001',
      participation_type: 'CORRECTION',
      lifecycle_state: 'COMPOSED',
      service_ref: null,
      channel: 'WEB',
      created_at: '2026-07-01T12:00:00.000Z',
      filed_at: null,
      closed_at: null,
      outcome: null,
      priority: 'STANDARD',
    };
    http.post.mockResolvedValue({ data: { data: mockResponse } });

    const params = {
      target_assertion_ref: 'assert:001',
      correction_value: '42%',
      evidence_description: 'Survey data from 2025',
    };
    const result = await client.submitCorrection(params);

    expect(http.post).toHaveBeenCalledWith('/api/v1/participation', {
      participation_type: 'CORRECTION',
      ...params,
    });
    expect(ParticipationCaseSchema.parse(result)).toEqual(mockResponse);
  });

  // === Challenges ===

  it('submitChallenge calls POST /api/v1/participation with CHALLENGE type', async () => {
    const mockResponse = {
      participation_id: 'ch-001',
      participation_type: 'CHALLENGE',
      lifecycle_state: 'COMPOSED',
      service_ref: null,
      channel: 'WEB',
      created_at: '2026-07-01T12:00:00.000Z',
      filed_at: null,
      closed_at: null,
      outcome: null,
      priority: 'STANDARD',
    };
    http.post.mockResolvedValue({ data: { data: mockResponse } });

    const params = {
      challenged_assertion_ref: 'assert:002',
      challenge_basis: 'Contradictory evidence',
      supporting_evidence: ['ev:001'],
    };
    const result = await client.submitChallenge(params);

    expect(http.post).toHaveBeenCalledWith('/api/v1/participation', {
      participation_type: 'CHALLENGE',
      ...params,
    });
    expect(ParticipationCaseSchema.parse(result)).toEqual(mockResponse);
  });

  // === Case Management ===

  it('getCase calls GET /api/v1/participation/:id', async () => {
    const mockResponse = {
      participation_id: 'case-001',
      participation_type: 'QUESTION',
      lifecycle_state: 'RESPONDED',
      service_ref: null,
      channel: 'WEB',
      created_at: '2026-07-01T12:00:00.000Z',
      filed_at: null,
      closed_at: null,
      outcome: null,
      priority: 'STANDARD',
    };
    http.get.mockResolvedValue({ data: { data: mockResponse } });

    const result = await client.getCase('case-001');

    expect(http.get).toHaveBeenCalledWith('/api/v1/participation/case-001');
    expect(ParticipationCaseSchema.parse(result)).toEqual(mockResponse);
  });

  it('getCaseTimeline calls GET /api/v1/participation/:id/timeline', async () => {
    const mockResponse = {
      participation_id: 'case-001',
      events: [
        {
          from_state: 'COMPOSED',
          to_state: 'IDENTIFIED',
          trigger: 'identity_gate_passed',
          timestamp: '2026-07-01T12:01:00.000Z',
          actor: 'system',
        },
      ],
    };
    http.get.mockResolvedValue({ data: { data: mockResponse } });

    const result = await client.getCaseTimeline('case-001');

    expect(http.get).toHaveBeenCalledWith('/api/v1/participation/case-001/timeline');
    expect(ParticipationTimelineSchema.parse(result)).toEqual(mockResponse);
  });

  // === Demand ===

  it('getDemand calls GET /api/v1/participation/demand/:subjectRef', async () => {
    const mockResponse = {
      subject_ref: 'subj:budget',
      demand_count: 42,
      latest_question_at: '2026-07-15T10:00:00.000Z',
    };
    http.get.mockResolvedValue({ data: { data: mockResponse } });

    const result = await client.getDemand('subj:budget');

    expect(http.get).toHaveBeenCalledWith('/api/v1/participation/demand/subj%3Abudget');
    expect(DemandInfoSchema.parse(result)).toEqual(mockResponse);
  });

  // === Transparency ===

  it('getTransparencyProfile calls GET /api/v1/participation/profile/:institutionId', async () => {
    const mockResponse = {
      institution_id: 'inst:001',
      institution_name: 'Ministry of Finance',
      total_requests: 100,
      responded: 80,
      refused: 10,
      silence: 10,
      response_rate: 0.8,
      median_response_days: 5,
    };
    http.get.mockResolvedValue({ data: { data: mockResponse } });

    const result = await client.getTransparencyProfile('inst:001');

    expect(http.get).toHaveBeenCalledWith('/api/v1/participation/profile/inst:001');
    expect(TransparencyProfileSchema.parse(result)).toEqual(mockResponse);
  });

  // === Watches ===

  it('watchObject calls POST /api/v1/participation/watch', async () => {
    const mockResponse = {
      watch_id: 'watch-001',
      watched_crn: 'caos:s2:subject:budget',
      active: true,
      created_at: '2026-07-01T12:00:00.000Z',
    };
    http.post.mockResolvedValue({ data: { data: mockResponse } });

    const result = await client.watchObject({
      crn: 'caos:s2:subject:budget',
      scope: 'SUBJECT',
    });

    expect(http.post).toHaveBeenCalledWith('/api/v1/participation/watch', {
      crn: 'caos:s2:subject:budget',
      scope: 'SUBJECT',
    });
    expect(WatchResultSchema.parse(result)).toEqual(mockResponse);
  });

  it('removeWatch calls DELETE /api/v1/participation/watch/:id', async () => {
    http.delete.mockResolvedValue({ data: {} });

    await client.removeWatch('watch-001');

    expect(http.delete).toHaveBeenCalledWith('/api/v1/participation/watch/watch-001');
  });

  // === Subscriptions ===

  it('subscribe calls POST /api/v1/participation/subscribe', async () => {
    const mockResponse = {
      subscription_id: 'sub-001',
      channel: 'EMAIL',
      frequency: 'DAILY_DIGEST',
      active: true,
      created_at: '2026-07-01T12:00:00.000Z',
    };
    http.post.mockResolvedValue({ data: { data: mockResponse } });

    const result = await client.subscribe({
      channel: 'EMAIL',
      frequency: 'DAILY_DIGEST',
    });

    expect(http.post).toHaveBeenCalledWith('/api/v1/participation/subscribe', {
      channel: 'EMAIL',
      frequency: 'DAILY_DIGEST',
    });
    expect(SubscriptionResultSchema.parse(result)).toEqual(mockResponse);
  });

  it('unsubscribe calls DELETE /api/v1/participation/subscribe/:id', async () => {
    http.delete.mockResolvedValue({ data: {} });

    await client.unsubscribe('sub-001');

    expect(http.delete).toHaveBeenCalledWith('/api/v1/participation/subscribe/sub-001');
  });

  // === Institution Following ===

  it('followInstitution delegates to watchObject with institution CRN', async () => {
    const mockResponse = {
      watch_id: 'watch-002',
      watched_crn: 'caos:s2:institution:inst:001',
      active: true,
      created_at: '2026-07-01T12:00:00.000Z',
    };
    http.post.mockResolvedValue({ data: { data: mockResponse } });

    const result = await client.followInstitution('inst:001');

    expect(http.post).toHaveBeenCalledWith('/api/v1/participation/watch', {
      crn: 'caos:s2:institution:inst:001',
      scope: 'INSTITUTION',
    });
    expect(WatchResultSchema.parse(result)).toEqual(mockResponse);
  });
});

describe('ParticipationClient — error handling', () => {
  let http: ReturnType<typeof mockAxios>;
  let client: ParticipationClient;

  beforeEach(() => {
    http = mockAxios();
    client = new ParticipationClient(http);
  });

  it('propagates HTTP errors from axios', async () => {
    const error = new Error('Request failed with status code 404');
    (error as any).response = { status: 404, data: { error: 'Not found' } };
    http.get.mockRejectedValue(error);

    await expect(client.getCase('nonexistent')).rejects.toThrow('Request failed');
  });

  it('propagates network errors', async () => {
    http.get.mockRejectedValue(new Error('Network Error'));

    await expect(client.getModuleHealth()).rejects.toThrow('Network Error');
  });
});
