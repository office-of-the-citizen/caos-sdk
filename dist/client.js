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
}
