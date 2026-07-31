import axios, { AxiosInstance } from 'axios';
import { CaosError, DecisionItem, AdmissionDecisionOutcome, ResolvedElement, AnswerEnvelope } from './types.js';
import { PublicRecord, NavigationIndex, SearchResponse } from './contracts.js';
import { ParticipationClient } from './participation/client.js';
import {
  CAOS_SDK_VERSION,
  CAOS_REQUIRED_GATEWAY,
  semverSatisfies,
  type RuntimeIdentity,
} from './identity.js';

/**
 * Normalize any transport failure into a CaosError. Understands both the
 * public envelope ({ error: { code, message } }) and the ops surfaces'
 * flat shapes ({ error: string, detail?: string }).
 */
function toCaosError(error: unknown): CaosError {
  if (error instanceof CaosError) return error;
  const anyErr = error as {
    message?: string;
    response?: { status?: number; data?: unknown };
  };
  const status = anyErr.response?.status;
  const data = anyErr.response?.data as
    | { error?: { code?: string; message?: string } | string; detail?: string }
    | undefined;
  const envelope = data && typeof data.error === 'object' ? data.error : null;
  const flat = data && typeof data.error === 'string' ? data.error : null;
  return new CaosError({
    code: envelope?.code ?? (status ? `HTTP_${status}` : 'NETWORK_ERROR'),
    message: envelope?.message ?? flat ?? anyErr.message ?? 'request failed',
    detail: data?.detail,
    status,
    data,
  });
}

export class CaosClient {
  private http: AxiosInstance;
  private _participation: ParticipationClient | null = null;

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
    this.http.interceptors.response.use(
      (r) => r,
      (error) => Promise.reject(toCaosError(error)),
    );
  }

  /** Constitutional Participation — governed civic interaction surface */
  get participation(): ParticipationClient {
    if (!this._participation) {
      this._participation = new ParticipationClient(this.http);
    }
    return this._participation;
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

  async searchPublicRecords(
    q: string,
    options?: { limit?: number; recordType?: string }
  ): Promise<SearchResponse> {
    const res = await this.http.get<{ data: SearchResponse }>('/api/v1/public/search', {
      params: { q, limit: options?.limit, record_type: options?.recordType },
    });
    return res.data.data;
  }

  /**
   * Resolve any identifier (CAOS Identifier, external code, slug) to its
   * CAOS Identifier via the Identity Service crosswalk.
   */
  async resolve(id: string): Promise<{
    input: string;
    crn: string;
    stratum: string | null;
    kind: string | null;
    level: number | null;
    method: string;
    matched_external_id: string | null;
  }> {
    const res = await this.http.get<{ data: any }>('/api/v1/public/resolve', {
      params: { id },
    });
    return res.data.data;
  }

  /**
   * Resolve a CAOS Identifier to its governed element — the full data, visibility class,
   * and ledger watermark. Calls the /resolve/:crn gateway endpoint.
   *
   * This is distinct from resolve(id) which performs identity resolution
   * (any identifier → CAOS Identifier). resolveCRN performs element resolution
   * (CAOS Identifier → governed element).
   */
  async resolveCRN(crn: string): Promise<ResolvedElement> {
    const res = await this.http.get<{ data: ResolvedElement }>(
      `/resolve/${encodeURIComponent(crn)}`,
    );
    return res.data.data;
  }

  /**
   * Ask a typed question (GET, public surface) and receive governed answer envelopes.
   * The seven answer shapes (KI-7) ensure every response explains itself.
   */
  async askPublic(subject: string, predicate?: string): Promise<import('./types.js').AskResponse> {
    const res = await this.http.get<{ data: import('./types.js').AskResponse }>('/api/v1/public/ask', {
      params: { subject, predicate },
    });
    return res.data.data;
  }

  /**
   * Submit a typed question (POST) and receive a single governed AnswerEnvelope.
   * This is the primary read surface of the Knowledge Index (KI-7).
   * The seven answer shapes ensure every response explains itself.
   */
  async ask(question: {
    predicate_id: string;
    subjects: string[];
    frame?: Record<string, string>;
    as_of?: string;
    as_believed_at?: string;
  }): Promise<AnswerEnvelope> {
    const res = await this.http.post<{ data: AnswerEnvelope }>('/ask', {
      predicate_id: question.predicate_id,
      subjects: question.subjects,
      frame: question.frame ?? {},
      clocks: {
        as_of: question.as_of,
        as_believed_at: question.as_believed_at,
      },
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

  // 3b. Extraction Policy — the Source page auto-extract toggle.
  //
  // Founder Constitutional Override §8: the policy lives on the Source page
  // only. There is no global-settings equivalent, and no global default may
  // silently override a per-source value.
  async getExtractionPolicy(libraryEntryId: string): Promise<{
    library_entry_id: string;
    extraction_policy: string;
    /** True only when an operator has actually chosen a policy for this source. */
    explicitly_set: boolean;
    auto_extract: boolean;
    descriptions: Record<string, string>;
    history: Array<Record<string, unknown>>;
  }> {
    const res = await this.http.get<any>(
      `/api/ops/control/workroom/extraction-policy/${encodeURIComponent(libraryEntryId)}`
    );
    return res.data;
  }

  async setExtractionPolicy(
    libraryEntryId: string,
    policy: string,
    setBy: string,
    reason?: string
  ): Promise<{
    library_entry_id: string;
    extraction_policy: string;
    auto_extract: boolean;
    explicitly_set: boolean;
  }> {
    const res = await this.http.put<any>(
      `/api/ops/control/workroom/extraction-policy/${encodeURIComponent(libraryEntryId)}`,
      { policy, set_by: setBy, reason: reason ?? null }
    );
    return res.data;
  }

  /**
   * Convenience over setExtractionPolicy for the two-state toggle.
   * ON_ADMISSION when enabled; MANUAL when not — MANUAL routes the admitted
   * document to the Knowledge Workroom rather than dropping it.
   */
  async setAutoExtract(
    libraryEntryId: string,
    enabled: boolean,
    setBy: string
  ): Promise<{ extraction_policy: string; auto_extract: boolean }> {
    return this.setExtractionPolicy(
      libraryEntryId,
      enabled ? 'ON_ADMISSION' : 'MANUAL',
      setBy,
      enabled
        ? 'operator enabled automatic extraction on admission'
        : 'operator deferred extraction to the Knowledge Workroom'
    );
  }

  // 3c. Knowledge Workroom (extraction pipeline)
  async getKnowledgeWorkroomPending(): Promise<{ items: any[]; count: number }> {
    const res = await this.http.get<{ items: any[]; count: number }>('/api/ops/control/workroom/pending');
    return res.data;
  }

  async getKnowledgeWorkroomConstructing(): Promise<{ items: any[]; count: number }> {
    const res = await this.http.get<{ items: any[]; count: number }>('/api/ops/control/workroom/constructing');
    return res.data;
  }

  async getKnowledgeWorkroomConstructed(): Promise<{ items: any[]; count: number }> {
    const res = await this.http.get<{ items: any[]; count: number }>('/api/ops/control/workroom/constructed');
    return res.data;
  }

  async triggerExtraction(admissionId: string, triggeredBy: string, extractorVersion?: string): Promise<any> {
    const res = await this.http.post<any>('/api/ops/control/workroom/extract-now', {
      admission_id: admissionId,
      triggered_by: triggeredBy,
      extractor_version: extractorVersion ?? null,
    });
    return res.data;
  }

  async scheduleExtraction(admissionId: string, scheduledFor: string, triggeredBy: string, extractorVersion?: string): Promise<any> {
    const res = await this.http.post<any>('/api/ops/control/workroom/schedule', {
      admission_id: admissionId,
      scheduled_for: scheduledFor,
      triggered_by: triggeredBy,
      extractor_version: extractorVersion ?? null,
    });
    return res.data;
  }

  async batchExtract(admissionIds: string[], triggeredBy: string, extractorVersion?: string, concurrency?: number): Promise<any> {
    const res = await this.http.post<any>('/api/ops/control/workroom/batch-extract', {
      admission_ids: admissionIds,
      triggered_by: triggeredBy,
      extractor_version: extractorVersion ?? null,
      concurrency: concurrency ?? 5,
    });
    return res.data;
  }

  async rerunExtraction(jobId: string, triggeredBy: string, extractorVersion?: string, stages?: string[]): Promise<any> {
    const res = await this.http.post<any>('/api/ops/control/workroom/rerun', {
      job_id: jobId,
      triggered_by: triggeredBy,
      extractor_version: extractorVersion ?? null,
      stages: stages ?? undefined,
    });
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

  /**
   * Execution state from Module 04 — the single execution authority.
   * Runs, schedules, and per-process health in one call.
   */
  async getControlExecution(): Promise<any> {
    const res = await this.http.get<any>('/api/ops/control/execution');
    return res.data;
  }

  async getControlSources(): Promise<any> {
    const res = await this.http.get<any>('/api/ops/control/sources');
    return res.data;
  }

  async getControlKi(params?: {
    predicate?: string;
    status?: string;
    limit?: number;
  }): Promise<any> {
    const res = await this.http.get<any>('/api/ops/control/ki', { params });
    return res.data;
  }

  async getControlEvents(options?: {
    q?: string;
    limit?: number;
    offset?: number;
    event_name?: string;
    engine?: string;
  }): Promise<any> {
    const res = await this.http.get<any>('/api/ops/control/events', { params: options });
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

  /**
   * Live operator admit with progressive NDJSON delivery (browser only).
   * Each parsed line is handed to onLine as it arrives so surfaces can render
   * per-file stage progress. Uses fetch because axios buffers streams.
   */
  async admitSourcesStream(
    input: FormData,
    onLine: (line: unknown) => void,
    signal?: AbortSignal,
  ): Promise<void> {
    const base = (this.http.defaults.baseURL || '').replace(/\/$/, '');
    const headers = new Headers();
    const h = this.http.defaults.headers as Record<string, unknown>;
    for (const key of ['x-ute-api-key', 'x-caos-session', 'Cookie']) {
      const value = (h?.[key] ?? (h?.common as Record<string, unknown>)?.[key]) as
        | string
        | undefined;
      if (value && key !== 'Cookie') headers.set(key, value);
    }
    const res = await fetch(`${base}/api/ops/control/admission`, {
      method: 'POST',
      body: input,
      headers,
      credentials: 'include',
      signal,
    });
    if (!res.body) {
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new CaosError({
          code: `HTTP_${res.status}`,
          message: (data as { error?: string })?.error || res.statusText,
          status: res.status,
          data,
        });
      }
      if (data) onLine(data);
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let newlineAt: number;
      while ((newlineAt = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, newlineAt).trim();
        buffer = buffer.slice(newlineAt + 1);
        if (!line) continue;
        try {
          onLine(JSON.parse(line));
        } catch {
          /* non-JSON keepalive lines are ignored */
        }
      }
    }
    if (!res.ok) {
      throw new CaosError({
        code: `HTTP_${res.status}`,
        message: res.statusText || 'admit failed',
        status: res.status,
      });
    }
  }

  // 6. Engine 06 compiler surfaces
  async getEnginePlans(params?: { method?: string; eligible?: string; limit?: number }): Promise<any> {
    const res = await this.http.get<any>('/api/ops/control/engine/plans', { params });
    return res.data;
  }

  // ── CANONICAL ADMISSION ENDPOINTS (Phase 5) ─────────────────────────────

  /**
   * Canonical single-file upload — starts SourceAdmissionWorkflow.
   * The extraction decision is part of the workflow input.
   */
  async uploadSource(
    file: { filename: string; bytes: Uint8Array; media_type?: string },
    opts: { auto_extract: boolean }
  ): Promise<{
    artifact_hash: string;
    workflow_id: string;
    mode: string;
    duplicate: boolean;
    admission_decision: string;
    auto_extract: boolean;
    status_href: string;
  }> {
    const form = new FormData();
    form.append('file', new Blob([file.bytes as unknown as BlobPart]), file.filename);
    form.set('filename', file.filename);
    if (file.media_type) form.set('media_type', file.media_type);
    form.set('auto_extract', String(opts.auto_extract));

    const res = await this.http.post<any>('/api/v2/sources/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }

  /**
   * Canonical batch upload — starts BatchAdmissionWorkflow.
   * Extraction is always automatic for batches.
   */
  async batchUploadSources(
    files: Array<{ filename: string; bytes: Uint8Array; media_type?: string }>,
    batchName: string
  ): Promise<{
    workflow_id: string;
    batch_name: string;
    total_documents: number;
    mode: string;
    status_href: string;
    signal_href: string;
  }> {
    const form = new FormData();
    for (const f of files) {
      form.append('files', new Blob([f.bytes as unknown as BlobPart]), f.filename);
    }
    form.set('batch_name', batchName);

    const res = await this.http.post<any>('/api/v2/sources/batch-upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }

  /**
   * Query canonical admission workflow status via Temporal query.
   */
  async getAdmissionWorkflowStatus(workflowId: string): Promise<{
    workflow_id: string;
    phase: string;
    artifact_hash: string | null;
    admission_status: string | null;
    extraction_status: string | null;
    error: string | null;
    interpretation_workflow_id: string | null;
    execution: { status: string; run_id: string } | null;
  }> {
    const res = await this.http.get<any>(`/api/v2/sources/admissions/${encodeURIComponent(workflowId)}`);
    return res.data;
  }

  /**
   * Read the full admission journey — the 14-stage constitutional checkpoint
   * record. Each stage has a lifecycle (NOT_STARTED, RUNNING, COMPLETED,
   * SKIPPED, FAILED, WAITING) and timing data.
   */
  async getAdmissionJourney(workflowId: string): Promise<{
    admission_id: string;
    workflow_state: string;
    created_at: string;
    updated_at: string;
    stages: Array<{
      stage: number;
      name: string;
      owner: string;
      status: string;
      started_at: string;
      completed_at: string | null;
      duration_ms: number | null;
      detail: Record<string, unknown> | null;
      error: string | null;
    }>;
    admission_status: string | null;
    artifact_hash: string | null;
    source_kind: string | null;
  }> {
    const res = await this.http.get<any>(`/api/v2/sources/admissions/${encodeURIComponent(workflowId)}/journey`);
    return res.data;
  }

  /**
   * Query batch workflow status via Temporal query.
   */
  async getBatchWorkflowStatus(workflowId: string): Promise<{
    workflow_id: string;
    phase: string;
    batch_name: string;
    total: number;
    processed: number;
    completed: number;
    failed: number;
    stopped: number;
    current_index: number;
    recent_results: Array<{
      index: number;
      filename: string;
      status: string;
      error: string | null;
    }>;
    execution: { status: string; run_id: string } | null;
  }> {
    const res = await this.http.get<any>(`/api/v2/sources/batch/${encodeURIComponent(workflowId)}`);
    return res.data;
  }

  /**
   * Send a signal to a batch workflow (pause/resume/stop).
   */
  async signalBatchWorkflow(
    workflowId: string,
    signal: 'pause' | 'resume' | 'stop'
  ): Promise<{ ok: boolean; workflow_id: string; signal: string }> {
    const res = await this.http.post<any>(
      `/api/v2/sources/batch/${encodeURIComponent(workflowId)}/signal`,
      { signal }
    );
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

  // uploadSourceV1() — DELETED (2026-07-31). Use uploadSource() which starts
  // SourceAdmissionWorkflow via POST /api/v2/sources/upload.

  /** Replace session token on an existing client (browser cookie refresh). */
  withSession(sessionToken: string | undefined): CaosClient {
    const baseURL = this.http.defaults.baseURL || '';
    const apiKey = this.http.defaults.headers.common?.['x-ute-api-key'] as string | undefined;
    return new CaosClient(baseURL, { sessionToken, apiKey });
  }

  async getRuntimeIdentity(): Promise<RuntimeIdentity> {
    let gatewayVersion: string | null = null;
    try {
      const res = await this.http.get<{ gateway: string }>('/api/version');
      gatewayVersion = res.data.gateway;
    } catch {
      /* Gateway unreachable — gatewayVersion stays null */
    }

    return {
      sdkVersion: CAOS_SDK_VERSION,
      gatewayVersion,
      compatible: gatewayVersion
        ? semverSatisfies(gatewayVersion, CAOS_REQUIRED_GATEWAY)
        : false,
    };
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
