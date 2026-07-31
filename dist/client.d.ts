import { DecisionItem, ResolvedElement, AnswerEnvelope } from './types.js';
import { PublicRecord, NavigationIndex, SearchResponse } from './contracts.js';
import { ParticipationClient } from './participation/client.js';
import { type RuntimeIdentity } from './identity.js';
export declare class CaosClient {
    private http;
    private _participation;
    constructor(baseURL: string, options?: {
        sessionToken?: string;
        apiKey?: string;
    });
    /** Constitutional Participation — governed civic interaction surface */
    get participation(): ParticipationClient;
    getPublicRecord(slug: string): Promise<PublicRecord>;
    getPublicNavigation(): Promise<NavigationIndex>;
    searchPublicRecords(q: string, options?: {
        limit?: number;
        recordType?: string;
    }): Promise<SearchResponse>;
    /**
     * Resolve any identifier (CAOS Identifier, external code, slug) to its
     * CAOS Identifier via the Identity Service crosswalk.
     */
    resolve(id: string): Promise<{
        input: string;
        crn: string;
        stratum: string | null;
        kind: string | null;
        level: number | null;
        method: string;
        matched_external_id: string | null;
    }>;
    /**
     * Resolve a CAOS Identifier to its governed element — the full data, visibility class,
     * and ledger watermark. Calls the /resolve/:crn gateway endpoint.
     *
     * This is distinct from resolve(id) which performs identity resolution
     * (any identifier → CAOS Identifier). resolveCRN performs element resolution
     * (CAOS Identifier → governed element).
     */
    resolveCRN(crn: string): Promise<ResolvedElement>;
    /**
     * Ask a typed question (GET, public surface) and receive governed answer envelopes.
     * The seven answer shapes (KI-7) ensure every response explains itself.
     */
    askPublic(subject: string, predicate?: string): Promise<import('./types.js').AskResponse>;
    /**
     * Submit a typed question (POST) and receive a single governed AnswerEnvelope.
     * This is the primary read surface of the Knowledge Index (KI-7).
     * The seven answer shapes ensure every response explains itself.
     */
    ask(question: {
        predicate_id: string;
        subjects: string[];
        frame?: Record<string, string>;
        as_of?: string;
        as_believed_at?: string;
    }): Promise<AnswerEnvelope>;
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
    /**
     * Execution state from Module 04 — the single execution authority.
     * Runs, schedules, and per-process health in one call.
     */
    getControlExecution(): Promise<any>;
    getControlSources(): Promise<any>;
    getControlKi(params?: {
        predicate?: string;
        status?: string;
        limit?: number;
    }): Promise<any>;
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
    getEnginePlans(params?: {
        method?: string;
        eligible?: string;
        limit?: number;
    }): Promise<any>;
    /**
     * Canonical single-file upload — starts SourceAdmissionWorkflow.
     * The extraction decision is part of the workflow input.
     */
    uploadSource(file: {
        filename: string;
        bytes: Uint8Array;
        media_type?: string;
    }, opts: {
        auto_extract: boolean;
    }): Promise<{
        artifact_hash: string;
        workflow_id: string;
        mode: string;
        duplicate: boolean;
        admission_decision: string;
        auto_extract: boolean;
        status_href: string;
    }>;
    /**
     * Canonical batch upload — starts BatchAdmissionWorkflow.
     * Extraction is always automatic for batches.
     */
    batchUploadSources(files: Array<{
        filename: string;
        bytes: Uint8Array;
        media_type?: string;
    }>, batchName: string): Promise<{
        workflow_id: string;
        batch_name: string;
        total_documents: number;
        mode: string;
        status_href: string;
        signal_href: string;
    }>;
    /**
     * Query canonical admission workflow status via Temporal query.
     */
    getAdmissionWorkflowStatus(workflowId: string): Promise<{
        workflow_id: string;
        phase: string;
        artifact_hash: string | null;
        admission_status: string | null;
        extraction_status: string | null;
        error: string | null;
        interpretation_workflow_id: string | null;
        execution: {
            status: string;
            run_id: string;
        } | null;
    }>;
    /**
     * Read the full admission journey — the 14-stage constitutional checkpoint
     * record. Each stage has a lifecycle (NOT_STARTED, RUNNING, COMPLETED,
     * SKIPPED, FAILED, WAITING) and timing data.
     */
    getAdmissionJourney(workflowId: string): Promise<{
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
    }>;
    /**
     * Query batch workflow status via Temporal query.
     */
    getBatchWorkflowStatus(workflowId: string): Promise<{
        workflow_id: string;
        phase: string;
        batch_name: string;
        total: number;
        processed: number;
        completed: number;
        /** Documents actually admitted to the corpus. */
        admitted: number;
        /** Completed with a non-ADMITTED decision — awaiting review in the Workroom. */
        held: number;
        failed: number;
        stopped: number;
        current_index: number;
        recent_results: Array<{
            index: number;
            filename: string;
            /** Workflow outcome: COMPLETED | FAILED | STOPPED | SKIPPED. */
            status: string;
            /** Constitutional decision: ADMITTED | QUARANTINED | REJECTED, or null. */
            admission_status: string | null;
            extraction_started: boolean;
            error: string | null;
        }>;
        execution: {
            status: string;
            run_id: string;
        } | null;
    }>;
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
    retryAdmission(workflowId: string, artifactHash: string, opts?: {
        alreadyAdmitted?: boolean;
        autoExtract?: boolean;
    }): Promise<{
        workflow_id: string;
        retry_of?: string;
        artifact_hash?: string;
        auto_extract?: boolean;
        resumed_at?: 'admission' | 'extraction';
        duplicate?: boolean;
        status_href?: string;
    }>;
    /**
     * Send a signal to a batch workflow (pause/resume/stop).
     */
    signalBatchWorkflow(workflowId: string, signal: 'pause' | 'resume' | 'stop'): Promise<{
        ok: boolean;
        workflow_id: string;
        signal: string;
    }>;
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
    /** Replace session token on an existing client (browser cookie refresh). */
    withSession(sessionToken: string | undefined): CaosClient;
    getRuntimeIdentity(): Promise<RuntimeIdentity>;
}
//# sourceMappingURL=client.d.ts.map