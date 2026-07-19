import axios, { AxiosInstance } from 'axios';
import { DecisionItem, AdmissionDecisionOutcome } from './types.js';
import { PublicRecord, NavigationIndex } from './contracts.js';

export class CaosClient {
  private http: AxiosInstance;

  constructor(baseURL: string, options?: { sessionToken?: string; apiKey?: string }) {
    const headers: Record<string, string> = {};
    if (options?.apiKey) {
      headers['x-ute-api-key'] = options.apiKey;
    }
    if (options?.sessionToken) {
      headers['Cookie'] = `caos_session=${options.sessionToken}`;
      headers['x-caos-session'] = options.sessionToken;
    }

    this.http = axios.create({
      baseURL,
      headers,
      withCredentials: true,
    });
  }

  // 1. Public records
  async getPublicRecord(slug: string): Promise<PublicRecord> {
    const res = await this.http.get<{ data: PublicRecord }>(`/api/v1/public/records/lga/${slug}`);
    return res.data.data;
  }

  async getPublicNavigation(): Promise<NavigationIndex> {
    const res = await this.http.get<{ data: NavigationIndex }>('/api/v1/public/navigation/lga');
    return res.data.data;
  }

  async searchPublicRecords(q: string): Promise<{ query: string; results: any[] }> {
    const res = await this.http.get<{ data: { query: string; results: any[] } }>('/api/v1/public/search', {
      params: { q },
    });
    return res.data.data;
  }

  // 2. Auth
  async login(apiKey: string): Promise<{ session_id: string; principal_id: string; expires_at: string }> {
    const res = await this.http.post<{ session_id: string; principal_id: string; expires_at: string }>(
      '/api/ops/auth/login',
      { api_key: apiKey }
    );
    return res.data;
  }

  async logout(): Promise<{ ok: boolean }> {
    const res = await this.http.post<{ ok: boolean }>('/api/ops/auth/logout');
    return res.data;
  }

  async me(): Promise<{ actor: any; operational_state: any }> {
    const res = await this.http.get<{ actor: any; operational_state: any }>('/api/ops/auth/me');
    return res.data;
  }

  // 3. Workroom
  async listDecisionItems(status = 'OPEN', kind?: string): Promise<{ items: DecisionItem[]; open_count: number }> {
    const res = await this.http.get<{ items: DecisionItem[]; open_count: number }>('/api/ops/workroom/items', {
      params: { status, kind },
    });
    return res.data;
  }

  async getDecisionItem(id: number): Promise<DecisionItem> {
    const res = await this.http.get<DecisionItem>(`/api/ops/workroom/items/${id}`);
    return res.data;
  }

  async resolveDecisionItem(id: number, decision: 'APPROVED' | 'REJECTED', note?: string): Promise<any> {
    const res = await this.http.post<any>(`/api/ops/workroom/items/${id}/resolve`, { decision, note });
    return res.data;
  }

  // 4. Control Room Dashboards
  async getControlHealth(): Promise<any> {
    const res = await this.http.get<any>('/api/ops/control/health');
    return res.data;
  }

  async getControlHealthLayers(): Promise<any> {
    const res = await this.http.get<any>('/api/ops/control/health-layers');
    return res.data;
  }

  async getControlWorkers(): Promise<any> {
    const res = await this.http.get<any>('/api/ops/control/workers');
    return res.data;
  }

  async issueWorkerCommand(service_id: string, command: string, reason: string): Promise<any> {
    const res = await this.http.post<any>('/api/ops/control/workers', { service_id, command, reason });
    return res.data;
  }

  async getControlPolicy(): Promise<any> {
    const res = await this.http.get<any>('/api/ops/control/policy');
    return res.data;
  }

  async updateControlPolicy(settings: any, reason: string): Promise<any> {
    const res = await this.http.patch<any>('/api/ops/control/policy', { settings, reason });
    return res.data;
  }

  async getControlFailures(options?: {
    id?: string;
    engine?: string;
    owner?: string;
    failure_class?: string;
    severity?: string;
    status?: string;
    human_required?: string;
    limit?: number;
  }): Promise<any> {
    const res = await this.http.get<any>('/api/ops/control/failures', { params: options });
    return res.data;
  }

  async getControlGovernanceReviews(): Promise<any> {
    const res = await this.http.get<any>('/api/ops/control/governance-reviews');
    return res.data;
  }

  async recordGovernanceReviewDecision(object_id: string, decision: 'RETAIN' | 'REPLACE' | 'RETIRE', reason: string): Promise<any> {
    const res = await this.http.post<any>('/api/ops/control/governance-reviews', { object_id, decision, reason });
    return res.data;
  }

  async syncSourceLibrary(reason: string, dry_run = true): Promise<any> {
    const res = await this.http.post<any>('/api/ops/control/admission/sync', { reason, dry_run });
    return res.data;
  }
}
