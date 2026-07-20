import { DecisionItem } from './types.js';
import { PublicRecord, NavigationIndex, SearchResponse } from './contracts.js';
export declare class CaosClient {
    private http;
    constructor(baseURL: string, options?: {
        sessionToken?: string;
        apiKey?: string;
    });
    getPublicRecord(slug: string): Promise<PublicRecord>;
    getPublicNavigation(): Promise<NavigationIndex>;
    searchPublicRecords(q: string, options?: {
        limit?: number;
        recordType?: string;
    }): Promise<SearchResponse>;
    login(apiKey: string): Promise<{
        session_id: string;
        principal_id: string;
        expires_at: string;
    }>;
    logout(): Promise<{
        ok: boolean;
    }>;
    me(): Promise<{
        actor: any;
        operational_state: any;
    }>;
    listDecisionItems(status?: string, kind?: string): Promise<{
        items: DecisionItem[];
        open_count: number;
    }>;
    getDecisionItem(id: number): Promise<DecisionItem>;
    resolveDecisionItem(id: number, decision: 'APPROVED' | 'REJECTED', note?: string): Promise<any>;
    getControlHealth(): Promise<any>;
    getControlHealthLayers(): Promise<any>;
    getControlWorkers(): Promise<any>;
    issueWorkerCommand(service_id: string, command: string, reason: string): Promise<any>;
    getControlPolicy(): Promise<any>;
    updateControlPolicy(settings: any, reason: string): Promise<any>;
    getControlFailures(options?: {
        id?: string;
        engine?: string;
        owner?: string;
        failure_class?: string;
        severity?: string;
        status?: string;
        human_required?: string;
        limit?: number;
    }): Promise<any>;
    getControlGovernanceReviews(): Promise<any>;
    recordGovernanceReviewDecision(object_id: string, decision: 'RETAIN' | 'REPLACE' | 'RETIRE', reason: string): Promise<any>;
    syncSourceLibrary(reason: string, dry_run?: boolean): Promise<any>;
    getControlSources(): Promise<any>;
    getControlEvents(options?: {
        q?: string;
        limit?: number;
        offset?: number;
        event_name?: string;
        engine?: string;
    }): Promise<any>;
    getControlAi(view?: string, providerId?: string): Promise<any>;
    updateControlAi(body: any): Promise<any>;
    getOpsCommandCatalogue(): Promise<any>;
    issueOpsCommand(body: {
        kind: string;
        reason?: string;
        dry_run?: boolean;
        failure_id?: string;
        params?: Record<string, unknown>;
    }): Promise<any>;
    getControlAdmission(): Promise<any>;
    /**
     * Operator admit. Prefer FormData in browsers (files field).
     * dry_run returns JSON; live admit may return NDJSON text for progress.
     */
    admitSources(input: FormData | {
        reason: string;
        files: Array<{
            filename: string;
            bytes_base64: string;
            declared_mime_type?: string | null;
        }>;
    }, options?: {
        dry_run?: boolean;
    }): Promise<any>;
    /**
     * Live operator admit with progressive NDJSON delivery (browser only).
     * Each parsed line is handed to onLine as it arrives so surfaces can render
     * per-file stage progress. Uses fetch because axios buffers streams.
     */
    admitSourcesStream(input: FormData, onLine: (line: unknown) => void): Promise<void>;
    getEnginePlans(params?: {
        method?: string;
        eligible?: string;
        limit?: number;
    }): Promise<any>;
    getEngineExecutions(params?: {
        plan?: string;
        status?: string;
        limit?: number;
    }): Promise<any>;
    getEngineStaleness(params: {
        since?: string;
        node?: string;
    }): Promise<any>;
    getEngineReviewQueue(params?: {
        status?: string;
        kind?: string;
        limit?: number;
    }): Promise<any>;
    resolveEngineReview(id: number, action: 'SUPERSEDE' | 'COEXIST' | 'DISMISS', note?: string): Promise<any>;
    getLedger(limit?: number): Promise<any>;
    verifyLedger(): Promise<any>;
    detectTampering(): Promise<any>;
    getLedgerEvent(ledger_id: string): Promise<any>;
    replayLedger(): Promise<any>;
    recordLedgerEvent(body: {
        event_name: string;
        payload?: unknown;
        object_id?: string;
        cause?: string;
    }): Promise<any>;
    getGovernedClaim(claimId: string): Promise<any>;
    uploadSource(input: FormData | {
        filename: string;
        bytes_base64: string;
        media_type?: string;
    }): Promise<any>;
    /** Replace session token on an existing client (browser cookie refresh). */
    withSession(sessionToken: string | undefined): CaosClient;
}
