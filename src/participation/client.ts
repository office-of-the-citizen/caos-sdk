/**
 * ParticipationClient — Constitutional Participation SDK surface.
 *
 * Presents stable civic-language methods. Never exposes engine internals.
 * The SDK should feel stable even if engine internals evolve.
 */
import { AxiosInstance } from 'axios';
import type {
  ParticipationCase,
  ParticipationTimeline,
  Question,
  FOIRequest,
  DemandInfo,
  TransparencyProfile,
  WatchResult,
  SubscriptionResult,
  CreateQuestionParams,
  CreateFOIRequestParams,
  SubmitContributionParams,
  SubmitCorrectionParams,
  SubmitChallengeParams,
  WatchObjectParams,
  SubscribeParams,
  ParticipationQueueResponse,
  AssignCaseParams,
  EscalateCaseParams,
  RespondToCaseParams,
  CloseCaseParams,
  CaseActionResult,
} from './types.js';
import type { ModuleHealth } from './contracts.js';

export class ParticipationClient {
  constructor(private readonly http: AxiosInstance) {}

  // === Module Health ===

  /** Check the operational status of the participation module. */
  async getModuleHealth(): Promise<ModuleHealth> {
    const res = await this.http.get<{ data: ModuleHealth }>(
      '/api/v1/participation/health'
    );
    return res.data.data;
  }

  // === Questions ===

  async createQuestion(params: CreateQuestionParams): Promise<Question> {
    const res = await this.http.post<{ data: Question }>('/api/v1/participation', {
      participation_type: 'QUESTION',
      ...params,
    });
    return res.data.data;
  }

  // === FOI Requests ===

  async createFOIRequest(params: CreateFOIRequestParams): Promise<FOIRequest> {
    const res = await this.http.post<{ data: FOIRequest }>('/api/v1/services/foi/request', params);
    return res.data.data;
  }

  // === Contributions ===

  async submitContribution(params: SubmitContributionParams): Promise<ParticipationCase> {
    const res = await this.http.post<{ data: ParticipationCase }>('/api/v1/participation', {
      participation_type: 'CONTRIBUTION',
      ...params,
    });
    return res.data.data;
  }

  // === Corrections ===

  async submitCorrection(params: SubmitCorrectionParams): Promise<ParticipationCase> {
    const res = await this.http.post<{ data: ParticipationCase }>('/api/v1/participation', {
      participation_type: 'CORRECTION',
      ...params,
    });
    return res.data.data;
  }

  // === Challenges ===

  async submitChallenge(params: SubmitChallengeParams): Promise<ParticipationCase> {
    const res = await this.http.post<{ data: ParticipationCase }>('/api/v1/participation', {
      participation_type: 'CHALLENGE',
      ...params,
    });
    return res.data.data;
  }

  // === Case Management ===

  async getCase(participationId: string): Promise<ParticipationCase> {
    const res = await this.http.get<{ data: ParticipationCase }>(
      `/api/v1/participation/${participationId}`
    );
    return res.data.data;
  }

  async getCaseTimeline(participationId: string): Promise<ParticipationTimeline> {
    const res = await this.http.get<{ data: ParticipationTimeline }>(
      `/api/v1/participation/${participationId}/timeline`
    );
    return res.data.data;
  }

  // === Demand ===

  async getDemand(subjectRef: string): Promise<DemandInfo> {
    const res = await this.http.get<{ data: DemandInfo }>(
      `/api/v1/participation/demand/${encodeURIComponent(subjectRef)}`
    );
    return res.data.data;
  }

  // === Transparency ===

  async getTransparencyProfile(institutionId: string): Promise<TransparencyProfile> {
    const res = await this.http.get<{ data: TransparencyProfile }>(
      `/api/v1/participation/profile/${institutionId}`
    );
    return res.data.data;
  }

  // === Watches ===

  async watchObject(params: WatchObjectParams): Promise<WatchResult> {
    const res = await this.http.post<{ data: WatchResult }>('/api/v1/participation/watch', params);
    return res.data.data;
  }

  async removeWatch(watchId: string): Promise<void> {
    await this.http.delete(`/api/v1/participation/watch/${watchId}`);
  }

  // === Subscriptions ===

  async subscribe(params: SubscribeParams): Promise<SubscriptionResult> {
    const res = await this.http.post<{ data: SubscriptionResult }>(
      '/api/v1/participation/subscribe',
      params
    );
    return res.data.data;
  }

  async unsubscribe(subscriptionId: string): Promise<void> {
    await this.http.delete(`/api/v1/participation/subscribe/${subscriptionId}`);
  }

  // === Institution Following (convenience) ===

  async followInstitution(institutionId: string): Promise<WatchResult> {
    return this.watchObject({
      crn: `caos:s2:institution:${institutionId}`,
      scope: 'INSTITUTION',
    });
  }

  // ── Participation Ops (Control Room dashboard) ────────────────────────────

  /**
   * Get the participation queue with cases and stats.
   * Used by Control Room to display the participation dashboard.
   */
  async getQueue(options?: {
    type?: string;
    state?: string;
    service?: string;
    priority?: string;
  }): Promise<ParticipationQueueResponse> {
    const res = await this.http.get<{ data: ParticipationQueueResponse }>(
      '/api/ops/control/participation',
      { params: options }
    );
    return res.data.data;
  }

  /**
   * Assign a case to an actor.
   */
  async assignCase(
    participationId: string,
    params: AssignCaseParams
  ): Promise<CaseActionResult> {
    const res = await this.http.post<{ data: CaseActionResult }>(
      `/api/v1/participation/${participationId}/assign`,
      params
    );
    return res.data.data;
  }

  /**
   * Escalate a case along an escalation path.
   */
  async escalateCase(
    participationId: string,
    params: EscalateCaseParams
  ): Promise<CaseActionResult> {
    const res = await this.http.post<{ data: CaseActionResult }>(
      `/api/v1/participation/${participationId}/escalate`,
      params
    );
    return res.data.data;
  }

  /**
   * Record a response to a participation case.
   */
  async respondToCase(
    participationId: string,
    params: RespondToCaseParams
  ): Promise<CaseActionResult> {
    const res = await this.http.post<{ data: CaseActionResult }>(
      `/api/v1/participation/${participationId}/respond`,
      params
    );
    return res.data.data;
  }

  /**
   * Close a participation case with a reason.
   */
  async closeCase(
    participationId: string,
    params: CloseCaseParams
  ): Promise<CaseActionResult> {
    const res = await this.http.post<{ data: CaseActionResult }>(
      `/api/v1/participation/${participationId}/close`,
      params
    );
    return res.data.data;
  }
}
