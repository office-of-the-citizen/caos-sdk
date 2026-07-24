export class ParticipationClient {
    http;
    constructor(http) {
        this.http = http;
    }
    // === Module Health ===
    /** Check the operational status of the participation module. */
    async getModuleHealth() {
        const res = await this.http.get('/api/v1/participation/health');
        return res.data.data;
    }
    // === Questions ===
    async createQuestion(params) {
        const res = await this.http.post('/api/v1/participation', {
            participation_type: 'QUESTION',
            ...params,
        });
        return res.data.data;
    }
    // === FOI Requests ===
    async createFOIRequest(params) {
        const res = await this.http.post('/api/v1/services/foi/request', params);
        return res.data.data;
    }
    // === Contributions ===
    async submitContribution(params) {
        const res = await this.http.post('/api/v1/participation', {
            participation_type: 'CONTRIBUTION',
            ...params,
        });
        return res.data.data;
    }
    // === Corrections ===
    async submitCorrection(params) {
        const res = await this.http.post('/api/v1/participation', {
            participation_type: 'CORRECTION',
            ...params,
        });
        return res.data.data;
    }
    // === Challenges ===
    async submitChallenge(params) {
        const res = await this.http.post('/api/v1/participation', {
            participation_type: 'CHALLENGE',
            ...params,
        });
        return res.data.data;
    }
    // === Case Management ===
    async getCase(participationId) {
        const res = await this.http.get(`/api/v1/participation/${participationId}`);
        return res.data.data;
    }
    async getCaseTimeline(participationId) {
        const res = await this.http.get(`/api/v1/participation/${participationId}/timeline`);
        return res.data.data;
    }
    // === Demand ===
    async getDemand(subjectRef) {
        const res = await this.http.get(`/api/v1/participation/demand/${encodeURIComponent(subjectRef)}`);
        return res.data.data;
    }
    // === Transparency ===
    async getTransparencyProfile(institutionId) {
        const res = await this.http.get(`/api/v1/participation/profile/${institutionId}`);
        return res.data.data;
    }
    // === Watches ===
    async watchObject(params) {
        const res = await this.http.post('/api/v1/participation/watch', params);
        return res.data.data;
    }
    async removeWatch(watchId) {
        await this.http.delete(`/api/v1/participation/watch/${watchId}`);
    }
    // === Subscriptions ===
    async subscribe(params) {
        const res = await this.http.post('/api/v1/participation/subscribe', params);
        return res.data.data;
    }
    async unsubscribe(subscriptionId) {
        await this.http.delete(`/api/v1/participation/subscribe/${subscriptionId}`);
    }
    // === Institution Following (convenience) ===
    async followInstitution(institutionId) {
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
    async getQueue(options) {
        const res = await this.http.get('/api/ops/control/participation', { params: options });
        return res.data.data;
    }
    /**
     * Assign a case to an actor.
     */
    async assignCase(participationId, params) {
        const res = await this.http.post(`/api/v1/participation/${participationId}/assign`, params);
        return res.data.data;
    }
    /**
     * Escalate a case along an escalation path.
     */
    async escalateCase(participationId, params) {
        const res = await this.http.post(`/api/v1/participation/${participationId}/escalate`, params);
        return res.data.data;
    }
    /**
     * Record a response to a participation case.
     */
    async respondToCase(participationId, params) {
        const res = await this.http.post(`/api/v1/participation/${participationId}/respond`, params);
        return res.data.data;
    }
    /**
     * Close a participation case with a reason.
     */
    async closeCase(participationId, params) {
        const res = await this.http.post(`/api/v1/participation/${participationId}/close`, params);
        return res.data.data;
    }
}
