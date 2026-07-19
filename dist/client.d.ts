import { DecisionItem } from './types.js';
import { PublicRecord, NavigationIndex } from './contracts.js';
export declare class CaosClient {
    private http;
    constructor(baseURL: string, options?: {
        sessionToken?: string;
        apiKey?: string;
    });
    getPublicRecord(slug: string): Promise<PublicRecord>;
    getPublicNavigation(): Promise<NavigationIndex>;
    searchPublicRecords(q: string): Promise<{
        query: string;
        results: any[];
    }>;
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
}
