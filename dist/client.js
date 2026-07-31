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
    // 3b/3c. Extraction policy + Knowledge Workroom — DELETED (2026-07-31).
    //
    // getExtractionPolicy/setExtractionPolicy drove a stored per-source policy
    // that decided extraction behind the operator's back. triggerExtraction,
    // scheduleExtraction, batchExtraction and rerunExtraction drove a second,
    // non-Temporal extraction orchestrator.
    //
    // There is now exactly one rule: a single upload extracts if the operator
    // asked it to (`uploadSource({ auto_extract })`); a batch always extracts.
    // Nothing else decides. Retry a failed document with retryAdmission().
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
    // getControlAdmission(), admitSources(), admitSourcesStream() — DELETED
    // (2026-07-31). They drove POST /api/ops/control/admission, an admission
    // path that ran outside Temporal with its own NDJSON progress protocol.
    // The route and all three methods had zero callers. Upload through
    // uploadSource() / batchUploadSources().
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
     * Read the full admission journey — the 14-stage constitutional checkpoint
     * record. Each stage has a lifecycle (NOT_STARTED, RUNNING, COMPLETED,
     * SKIPPED, FAILED, WAITING) and timing data.
     */
    async getAdmissionJourney(workflowId) {
        const res = await this.http.get(`/api/v2/sources/admissions/${encodeURIComponent(workflowId)}/journey`);
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
     * Retry a failed admission from the Workroom.
     *
     * Resubmits the document into the canonical SourceAdmissionWorkflow. Set
     * `alreadyAdmitted` when the document reached custody and only extraction
     * failed — the workflow then resumes at extraction instead of re-admitting.
     *
     * `autoExtract` should be the choice recorded on the Workroom item, so the
     * retry repeats the original request rather than inventing a new one.
     */
    async retryAdmission(workflowId, artifactHash, opts) {
        const res = await this.http.post(`/api/v2/sources/admissions/${encodeURIComponent(workflowId)}/retry`, {
            artifact_hash: artifactHash,
            already_admitted: opts?.alreadyAdmitted === true,
            // Omitted rather than defaulted, so the gateway's own default applies
            // when the item predates retry-context recording.
            ...(opts?.autoExtract === undefined ? {} : { auto_extract: opts.autoExtract }),
        });
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
    // uploadSourceV1() — DELETED (2026-07-31). Use uploadSource() which starts
    // SourceAdmissionWorkflow via POST /api/v2/sources/upload.
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
