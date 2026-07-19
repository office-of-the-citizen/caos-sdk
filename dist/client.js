import axios from 'axios';
export class CaosClient {
    http;
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
    async searchPublicRecords(q) {
        const res = await this.http.get('/api/v1/public/search', {
            params: { q },
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
    async getControlSources() {
        const res = await this.http.get('/api/ops/control/sources');
        return res.data;
    }
    async getControlEvents(q, limit) {
        const res = await this.http.get('/api/ops/control/events', { params: { q, limit } });
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
    // 6. Engine 06 compiler surfaces
    async getEnginePlans(params) {
        const res = await this.http.get('/api/ops/control/engine/plans', { params });
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
    async uploadSource(input) {
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
