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

  async getControlSources(): Promise<any> {
    const res = await this.http.get<any>('/api/ops/control/sources');
    return res.data;
  }

  async getControlEvents(q?: string, limit?: number): Promise<any> {
    const res = await this.http.get<any>('/api/ops/control/events', { params: { q, limit } });
    return res.data;
  }

  async getControlAi(view?: string, providerId?: string): Promise<any> {
    const res = await this.http.get<any>('/api/ops/control/ai', { params: { view, provider_id: providerId } });
    return res.data;
  }

  async updateControlAi(body: any): Promise<any> {
    const res = await this.http.patch<any>('/api/ops/control/ai', body);
    return res.data;
  }

  // 5. Operational commands
  async getOpsCommandCatalogue(): Promise<any> {
    const res = await this.http.get<any>('/api/ops/control/commands');
    return res.data;
  }

  async issueOpsCommand(body: {
    kind: string;
    reason?: string;
    dry_run?: boolean;
    failure_id?: string;
    params?: Record<string, unknown>;
  }): Promise<any> {
    const res = await this.http.post<any>('/api/ops/control/commands', body, {
      validateStatus: (s) => s < 500,
    });
    if (res.status >= 400 && res.data?.error) {
      const err = new Error(res.data.error) as Error & { status?: number; data?: unknown };
      err.status = res.status;
      err.data = res.data;
      throw err;
    }
    return res.data;
  }

  async getControlAdmission(): Promise<any> {
    const res = await this.http.get<any>('/api/ops/control/admission');
    return res.data;
  }

  /**
   * Operator admit. Prefer FormData in browsers (files field).
   * dry_run returns JSON; live admit may return NDJSON text for progress.
   */
  async admitSources(
    input: FormData | { reason: string; files: Array<{ filename: string; bytes_base64: string; declared_mime_type?: string | null }> },
    options?: { dry_run?: boolean }
  ): Promise<any> {
    const dry_run = Boolean(options?.dry_run);
    const res = await this.http.post<any>('/api/ops/control/admission', input, {
      params: dry_run ? { dry_run: '1' } : undefined,
      headers: input instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
      validateStatus: (s) => s < 500,
      // Live admit streams NDJSON; axios buffers the full body as text/json.
      responseType: dry_run ? 'json' : 'text',
      transformResponse: dry_run
        ? undefined
        : [(data) => data],
    });
    if (res.status >= 400) {
      const payload = typeof res.data === 'string' ? safeJson(res.data) : res.data;
      const err = new Error(payload?.error || `admit failed (${res.status})`) as Error & {
        status?: number;
        data?: unknown;
      };
      err.status = res.status;
      err.data = payload;
      throw err;
    }
    if (dry_run) return res.data;
    return parseNdjsonAdmit(typeof res.data === 'string' ? res.data : String(res.data ?? ''));
  }

  // 6. Engine 06 compiler surfaces
  async getEnginePlans(params?: { method?: string; eligible?: string; limit?: number }): Promise<any> {
    const res = await this.http.get<any>('/api/ops/control/engine/plans', { params });
    return res.data;
  }

  async getEngineExecutions(params?: { plan?: string; status?: string; limit?: number }): Promise<any> {
    const res = await this.http.get<any>('/api/ops/control/engine/executions', { params });
    return res.data;
  }

  async getEngineStaleness(params: { since?: string; node?: string }): Promise<any> {
    const res = await this.http.get<any>('/api/ops/control/engine/staleness', { params });
    return res.data;
  }

  async getEngineReviewQueue(params?: { status?: string; kind?: string; limit?: number }): Promise<any> {
    const res = await this.http.get<any>('/api/ops/control/engine/review', { params });
    return res.data;
  }

  async resolveEngineReview(id: number, action: 'SUPERSEDE' | 'COEXIST' | 'DISMISS', note?: string): Promise<any> {
    const res = await this.http.post<any>('/api/ops/control/engine/review', { id, action, note });
    return res.data;
  }

  // 7. Ledger wrappers
  async getLedger(limit = 200): Promise<any> {
    const res = await this.http.get<any>('/api/engine-02/ledger', { params: { limit } });
    return res.data;
  }

  async verifyLedger(): Promise<any> {
    const res = await this.http.post<any>('/api/engine-02/verify');
    return res.data;
  }

  async detectTampering(): Promise<any> {
    const res = await this.http.post<any>('/api/engine-02/detect-tampering');
    return res.data;
  }

  async getLedgerEvent(ledger_id: string): Promise<any> {
    const res = await this.http.post<any>('/api/engine-02/get-event', { ledger_id });
    return res.data;
  }

  async replayLedger(): Promise<any> {
    const res = await this.http.post<any>('/api/engine-02/replay');
    return res.data;
  }

  async recordLedgerEvent(body: {
    event_name: string;
    payload?: unknown;
    object_id?: string;
    cause?: string;
  }): Promise<any> {
    const res = await this.http.post<any>('/api/engine-02/record-event', body);
    return res.data;
  }

  // 8. Governed claims / pathway B
  async getGovernedClaim(claimId: string): Promise<any> {
    const res = await this.http.get<any>(`/api/v1/governed/claims/${encodeURIComponent(claimId)}`);
    return res.data;
  }

  async uploadSource(input: FormData | { filename: string; bytes_base64: string; media_type?: string }): Promise<any> {
    const res = await this.http.post<any>('/api/v1/sources/upload', input, {
      headers: input instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
      validateStatus: (s) => s < 500,
    });
    if (res.status >= 400) {
      const err = new Error(res.data?.error || `upload failed (${res.status})`) as Error & {
        status?: number;
        data?: unknown;
      };
      err.status = res.status;
      err.data = res.data;
      throw err;
    }
    return res.data;
  }

  /** Replace session token on an existing client (browser cookie refresh). */
  withSession(sessionToken: string | undefined): CaosClient {
    const baseURL = this.http.defaults.baseURL || '';
    const apiKey = this.http.defaults.headers.common?.['x-ute-api-key'] as string | undefined;
    return new CaosClient(baseURL, { sessionToken, apiKey });
  }
}

function safeJson(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    return { error: text };
  }
}

function parseNdjsonAdmit(text: string): any {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  let final: any = null;
  const progress: any[] = [];
  for (const line of lines) {
    try {
      const obj = JSON.parse(line);
      if (obj?.type === 'final') final = obj.result ?? obj;
      else if (obj?.type === 'error') {
        const err = new Error(obj.error || 'admit failed') as Error & { data?: unknown };
        err.data = obj;
        throw err;
      } else progress.push(obj);
    } catch (e) {
      if (e instanceof Error && (e as any).data) throw e;
    }
  }
  return final ?? { progress, raw: text };
}
