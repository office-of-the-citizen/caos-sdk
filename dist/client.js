import axios from 'axios';
import { CaosError } from './types.js';
import { ParticipationClient } from './participation/client.js';
import { CAOS_SDK_VERSION, CAOS_REQUIRED_GATEWAY, semverSatisfies, } from './identity.js';
/**
 * Normalize any transport failure into a CaosError. Understands both the
 * public envelope ({ error: { code, message } }) and the ops surfaces'
 * flat shapes ({ error: string, detail?: string }).
 */
function toCaosError(error) {
    if (error instanceof CaosError)
        return error;
    const anyErr = error;
    const status = anyErr.response?.status;
    const data = anyErr.response?.data;
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
    http;
    _participation = null;
    constructor(baseURL, options) {
        const headers = {};
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
        this.http.interceptors.response.use((r) => r, (error) => Promise.reject(toCaosError(error)));
    }
    /** Constitutional Participation — governed civic interaction surface */
    get participation() {
        if (!this._participation) {
            this._participation = new ParticipationClient(this.http);
        }
        return this._participation;
    }
    // 1. Public records
    async getPublicRecord(slug) {
        const res = await this.http.get(`/api/v1/public/records/lga/${slug}`);
        return res.data.data;
    }
    async getPublicNavigation() {
        const res = await this.http.get('/api/v1/public/navigation/lga');
        return res.data.data;
    }
    async searchPublicRecords(q, options) {
        const res = await this.http.get('/api/v1/public/search', {
            params: { q, limit: options?.limit, record_type: options?.recordType },
        });
        return res.data.data;
    }
    /**
     * Resolve any identifier (CAOS Identifier, external code, slug) to its
     * CAOS Identifier via the Identity Service crosswalk.
     */
    async resolve(id) {
        const res = await this.http.get('/api/v1/public/resolve', {
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
    async resolveCRN(crn) {
        const res = await this.http.get(`/resolve/${encodeURIComponent(crn)}`);
        return res.data.data;
    }
    /**
     * Ask a typed question (GET, public surface) and receive governed answer envelopes.
     * The seven answer shapes (KI-7) ensure every response explains itself.
     */
    async askPublic(subject, predicate) {
        const res = await this.http.get('/api/v1/public/ask', {
            params: { subject, predicate },
        });
        return res.data.data;
    }
    /**
     * Submit a typed question (POST) and receive a single governed AnswerEnvelope.
     * This is the primary read surface of the Knowledge Index (KI-7).
     * The seven answer shapes ensure every response explains itself.
     */
    async ask(question) {
        const res = await this.http.post('/ask', {
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
    async login(apiKey) {
        const res = await this.http.post('/api/ops/auth/login', { api_key: apiKey });
        return res.data;
    }
    async logout() {
        const res = await this.http.post('/api/ops/auth/logout');
        return res.data;
    }
    async me() {
        const res = await this.http.get('/api/ops/auth/me');
        return res.data;
    }
    // 3. Workroom
    async listDecisionItems(status = 'OPEN', kind) {
        const res = await this.http.get('/api/ops/workroom/items', {
            params: { status, kind },
        });
        return res.data;
    }
    async getDecisionItem(id) {
        const res = await this.http.get(`/api/ops/workroom/items/${id}`);
        return res.data;
    }
    async resolveDecisionItem(id, decision, note) {
        const res = await this.http.post(`/api/ops/workroom/items/${id}/resolve`, { decision, note });
        return res.data;
    }
    // 3b. Extraction Policy — the Source page auto-extract toggle.
    //
    // Founder Constitutional Override §8: the policy lives on the Source page
    // only. There is no global-settings equivalent, and no global default may
    // silently override a per-source value.
    async getExtractionPolicy(libraryEntryId) {
        const res = await this.http.get(`/api/ops/control/workroom/extraction-policy/${encodeURIComponent(libraryEntryId)}`);
        return res.data;
    }
    async setExtractionPolicy(libraryEntryId, policy, setBy, reason) {
        const res = await this.http.put(`/api/ops/control/workroom/extraction-policy/${encodeURIComponent(libraryEntryId)}`, { policy, set_by: setBy, reason: reason ?? null });
        return res.data;
    }
    /**
     * Convenience over setExtractionPolicy for the two-state toggle.
     * ON_ADMISSION when enabled; MANUAL when not — MANUAL routes the admitted
     * document to the Knowledge Workroom rather than dropping it.
     */
    async setAutoExtract(libraryEntryId, enabled, setBy) {
        return this.setExtractionPolicy(libraryEntryId, enabled ? 'ON_ADMISSION' : 'MANUAL', setBy, enabled
            ? 'operator enabled automatic extraction on admission'
            : 'operator deferred extraction to the Knowledge Workroom');
    }
    // 3c. Knowledge Workroom (extraction pipeline)
    async getKnowledgeWorkroomPending() {
        const res = await this.http.get('/api/ops/control/workroom/pending');
        return res.data;
    }
    async getKnowledgeWorkroomConstructing() {
        const res = await this.http.get('/api/ops/control/workroom/constructing');
        return res.data;
    }
    async getKnowledgeWorkroomConstructed() {
        const res = await this.http.get('/api/ops/control/workroom/constructed');
        return res.data;
    }
    async triggerExtraction(admissionId, triggeredBy, extractorVersion) {
        const res = await this.http.post('/api/ops/control/workroom/extract-now', {
            admission_id: admissionId,
            triggered_by: triggeredBy,
            extractor_version: extractorVersion ?? null,
        });
        return res.data;
    }
    async scheduleExtraction(admissionId, scheduledFor, triggeredBy, extractorVersion) {
        const res = await this.http.post('/api/ops/control/workroom/schedule', {
            admission_id: admissionId,
            scheduled_for: scheduledFor,
            triggered_by: triggeredBy,
            extractor_version: extractorVersion ?? null,
        });
        return res.data;
    }
    async batchExtract(admissionIds, triggeredBy, extractorVersion, concurrency) {
        const res = await this.http.post('/api/ops/control/workroom/batch-extract', {
            admission_ids: admissionIds,
            triggered_by: triggeredBy,
            extractor_version: extractorVersion ?? null,
            concurrency: concurrency ?? 5,
        });
        return res.data;
    }
    async rerunExtraction(jobId, triggeredBy, extractorVersion, stages) {
        const res = await this.http.post('/api/ops/control/workroom/rerun', {
            job_id: jobId,
            triggered_by: triggeredBy,
            extractor_version: extractorVersion ?? null,
            stages: stages ?? undefined,
        });
        return res.data;
    }
    // 4. Control Room Dashboards
    async getControlHealth() {
        const res = await this.http.get('/api/ops/control/health');
        return res.data;
    }
    async getControlHealthLayers() {
        const res = await this.http.get('/api/ops/control/health-layers');
        return res.data;
    }
    async getControlWorkers() {
        const res = await this.http.get('/api/ops/control/workers');
        return res.data;
    }
    async issueWorkerCommand(service_id, command, reason) {
        const res = await this.http.post('/api/ops/control/workers', { service_id, command, reason });
        return res.data;
    }
    async getControlPolicy() {
        const res = await this.http.get('/api/ops/control/policy');
        return res.data;
    }
    async updateControlPolicy(settings, reason) {
        const res = await this.http.patch('/api/ops/control/policy', { settings, reason });
        return res.data;
    }
    async getControlFailures(options) {
        const res = await this.http.get('/api/ops/control/failures', { params: options });
        return res.data;
    }
    async getControlGovernanceReviews() {
        const res = await this.http.get('/api/ops/control/governance-reviews');
        return res.data;
    }
    async recordGovernanceReviewDecision(object_id, decision, reason) {
        const res = await this.http.post('/api/ops/control/governance-reviews', { object_id, decision, reason });
        return res.data;
    }
    async syncSourceLibrary(reason, dry_run = true) {
        const res = await this.http.post('/api/ops/control/admission/sync', { reason, dry_run });
        return res.data;
    }
    /**
     * Execution state from Module 04 — the single execution authority.
     * Runs, schedules, and per-process health in one call.
     */
    async getControlExecution() {
        const res = await this.http.get('/api/ops/control/execution');
        return res.data;
    }
    async getControlSources() {
        const res = await this.http.get('/api/ops/control/sources');
        return res.data;
    }
    async getControlKi(params) {
        const res = await this.http.get('/api/ops/control/ki', { params });
        return res.data;
    }
    async getControlEvents(options) {
        const res = await this.http.get('/api/ops/control/events', { params: options });
        return res.data;
    }
    async getControlAi(view, providerId) {
        const res = await this.http.get('/api/ops/control/ai', { params: { view, provider_id: providerId } });
        return res.data;
    }
    async updateControlAi(body) {
        const res = await this.http.patch('/api/ops/control/ai', body);
        return res.data;
    }
    // 5. Operational commands
    async getOpsCommandCatalogue() {
        const res = await this.http.get('/api/ops/control/commands');
        return res.data;
    }
    async issueOpsCommand(body) {
        const res = await this.http.post('/api/ops/control/commands', body, {
            validateStatus: (s) => s < 500,
        });
        if (res.status >= 400 && res.data?.error) {
            const err = new Error(res.data.error);
            err.status = res.status;
            err.data = res.data;
            throw err;
        }
        return res.data;
    }
    async getControlAdmission() {
        const res = await this.http.get('/api/ops/control/admission');
        return res.data;
    }
    /**
     * Operator admit. Prefer FormData in browsers (files field).
     * dry_run returns JSON; live admit may return NDJSON text for progress.
     */
    async admitSources(input, options) {
        const dry_run = Boolean(options?.dry_run);
        const res = await this.http.post('/api/ops/control/admission', input, {
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
            const err = new Error(payload?.error || `admit failed (${res.status})`);
            err.status = res.status;
            err.data = payload;
            throw err;
        }
        if (dry_run)
            return res.data;
        return parseNdjsonAdmit(typeof res.data === 'string' ? res.data : String(res.data ?? ''));
    }
    /**
     * Live operator admit with progressive NDJSON delivery (browser only).
     * Each parsed line is handed to onLine as it arrives so surfaces can render
     * per-file stage progress. Uses fetch because axios buffers streams.
     */
    async admitSourcesStream(input, onLine, signal) {
        const base = (this.http.defaults.baseURL || '').replace(/\/$/, '');
        const headers = new Headers();
        const h = this.http.defaults.headers;
        for (const key of ['x-ute-api-key', 'x-caos-session', 'Cookie']) {
            const value = (h?.[key] ?? h?.common?.[key]);
            if (value && key !== 'Cookie')
                headers.set(key, value);
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
                    message: data?.error || res.statusText,
                    status: res.status,
                    data,
                });
            }
            if (data)
                onLine(data);
            return;
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        for (;;) {
            const { done, value } = await reader.read();
            if (done)
                break;
            buffer += decoder.decode(value, { stream: true });
            let newlineAt;
            while ((newlineAt = buffer.indexOf('\n')) >= 0) {
                const line = buffer.slice(0, newlineAt).trim();
                buffer = buffer.slice(newlineAt + 1);
                if (!line)
                    continue;
                try {
                    onLine(JSON.parse(line));
                }
                catch {
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
    async getEnginePlans(params) {
        const res = await this.http.get('/api/ops/control/engine/plans', { params });
        return res.data;
    }
    // ── CANONICAL ADMISSION ENDPOINTS (Phase 5) ─────────────────────────────
    /**
     * Canonical single-file upload — starts SourceAdmissionWorkflow.
     * The extraction decision is part of the workflow input.
     */
    async uploadSource(file, opts) {
        const form = new FormData();
        form.append('file', new Blob([file.bytes]), file.filename);
        form.set('filename', file.filename);
        if (file.media_type)
            form.set('media_type', file.media_type);
        form.set('auto_extract', String(opts.auto_extract));
        const res = await this.http.post('/api/v2/sources/upload', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    }
    /**
     * Canonical batch upload — starts BatchAdmissionWorkflow.
     * Extraction is always automatic for batches.
     */
    async batchUploadSources(files, batchName) {
        const form = new FormData();
        for (const f of files) {
            form.append('files', new Blob([f.bytes]), f.filename);
        }
        form.set('batch_name', batchName);
        const res = await this.http.post('/api/v2/sources/batch-upload', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    }
    /**
     * Query canonical admission workflow status via Temporal query.
     */
    async getAdmissionWorkflowStatus(workflowId) {
        const res = await this.http.get(`/api/v2/sources/admissions/${encodeURIComponent(workflowId)}`);
        return res.data;
    }
    /**
     * Query batch workflow status via Temporal query.
     */
    async getBatchWorkflowStatus(workflowId) {
        const res = await this.http.get(`/api/v2/sources/batch/${encodeURIComponent(workflowId)}`);
        return res.data;
    }
    /**
     * Send a signal to a batch workflow (pause/resume/stop).
     */
    async signalBatchWorkflow(workflowId, signal) {
        const res = await this.http.post(`/api/v2/sources/batch/${encodeURIComponent(workflowId)}/signal`, { signal });
        return res.data;
    }
    async getEngineExecutions(params) {
        const res = await this.http.get('/api/ops/control/engine/executions', { params });
        return res.data;
    }
    async getEngineStaleness(params) {
        const res = await this.http.get('/api/ops/control/engine/staleness', { params });
        return res.data;
    }
    async getEngineReviewQueue(params) {
        const res = await this.http.get('/api/ops/control/engine/review', { params });
        return res.data;
    }
    async resolveEngineReview(id, action, note) {
        const res = await this.http.post('/api/ops/control/engine/review', { id, action, note });
        return res.data;
    }
    // 7. Ledger wrappers
    async getLedger(limit = 200) {
        const res = await this.http.get('/api/engine-02/ledger', { params: { limit } });
        return res.data;
    }
    async verifyLedger() {
        const res = await this.http.post('/api/engine-02/verify');
        return res.data;
    }
    async detectTampering() {
        const res = await this.http.post('/api/engine-02/detect-tampering');
        return res.data;
    }
    async getLedgerEvent(ledger_id) {
        const res = await this.http.post('/api/engine-02/get-event', { ledger_id });
        return res.data;
    }
    async replayLedger() {
        const res = await this.http.post('/api/engine-02/replay');
        return res.data;
    }
    async recordLedgerEvent(body) {
        const res = await this.http.post('/api/engine-02/record-event', body);
        return res.data;
    }
    // 8. Governed claims / pathway B
    async getGovernedClaim(claimId) {
        const res = await this.http.get(`/api/v1/governed/claims/${encodeURIComponent(claimId)}`);
        return res.data;
    }
    /**
     * @deprecated Use uploadSource() which starts SourceAdmissionWorkflow.
     * Legacy single-file upload via /api/v1/sources/upload.
     */
    async uploadSourceV1(input) {
        const res = await this.http.post('/api/v1/sources/upload', input, {
            headers: input instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
            validateStatus: (s) => s < 500,
        });
        if (res.status >= 400) {
            const err = new Error(res.data?.error || `upload failed (${res.status})`);
            err.status = res.status;
            err.data = res.data;
            throw err;
        }
        return res.data;
    }
    /** Replace session token on an existing client (browser cookie refresh). */
    withSession(sessionToken) {
        const baseURL = this.http.defaults.baseURL || '';
        const apiKey = this.http.defaults.headers.common?.['x-ute-api-key'];
        return new CaosClient(baseURL, { sessionToken, apiKey });
    }
    async getRuntimeIdentity() {
        let gatewayVersion = null;
        try {
            const res = await this.http.get('/api/version');
            gatewayVersion = res.data.gateway;
        }
        catch {
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
function safeJson(text) {
    try {
        return JSON.parse(text);
    }
    catch {
        return { error: text };
    }
}
function parseNdjsonAdmit(text) {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    let final = null;
    const progress = [];
    for (const line of lines) {
        try {
            const obj = JSON.parse(line);
            if (obj?.type === 'final')
                final = obj.result ?? obj;
            else if (obj?.type === 'error') {
                const err = new Error(obj.error || 'admit failed');
                err.data = obj;
                throw err;
            }
            else
                progress.push(obj);
        }
        catch (e) {
            if (e instanceof Error && e.data)
                throw e;
        }
    }
    return final ?? { progress, raw: text };
}
