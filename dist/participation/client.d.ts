/**
 * ParticipationClient — Constitutional Participation SDK surface.
 *
 * Presents stable civic-language methods. Never exposes engine internals.
 * The SDK should feel stable even if engine internals evolve.
 */
import { AxiosInstance } from 'axios';
import type { ParticipationCase, ParticipationTimeline, Question, FOIRequest, DemandInfo, TransparencyProfile, WatchResult, SubscriptionResult, CreateQuestionParams, CreateFOIRequestParams, SubmitContributionParams, SubmitCorrectionParams, SubmitChallengeParams, WatchObjectParams, SubscribeParams, ParticipationQueueResponse, AssignCaseParams, EscalateCaseParams, RespondToCaseParams, CloseCaseParams, CaseActionResult } from './types.js';
import type { ModuleHealth } from './contracts.js';
export declare class ParticipationClient {
    private readonly http;
    constructor(http: AxiosInstance);
    /** Check the operational status of the participation module. */
    getModuleHealth(): Promise<ModuleHealth>;
    createQuestion(params: CreateQuestionParams): Promise<Question>;
    createFOIRequest(params: CreateFOIRequestParams): Promise<FOIRequest>;
    submitContribution(params: SubmitContributionParams): Promise<ParticipationCase>;
    submitCorrection(params: SubmitCorrectionParams): Promise<ParticipationCase>;
    submitChallenge(params: SubmitChallengeParams): Promise<ParticipationCase>;
    getCase(participationId: string): Promise<ParticipationCase>;
    getCaseTimeline(participationId: string): Promise<ParticipationTimeline>;
    getDemand(subjectRef: string): Promise<DemandInfo>;
    getTransparencyProfile(institutionId: string): Promise<TransparencyProfile>;
    watchObject(params: WatchObjectParams): Promise<WatchResult>;
    removeWatch(watchId: string): Promise<void>;
    subscribe(params: SubscribeParams): Promise<SubscriptionResult>;
    unsubscribe(subscriptionId: string): Promise<void>;
    followInstitution(institutionId: string): Promise<WatchResult>;
    /**
     * Get the participation queue with cases and stats.
     * Used by Control Room to display the participation dashboard.
     */
    getQueue(options?: {
        type?: string;
        state?: string;
        service?: string;
        priority?: string;
    }): Promise<ParticipationQueueResponse>;
    /**
     * Assign a case to an actor.
     */
    assignCase(participationId: string, params: AssignCaseParams): Promise<CaseActionResult>;
    /**
     * Escalate a case along an escalation path.
     */
    escalateCase(participationId: string, params: EscalateCaseParams): Promise<CaseActionResult>;
    /**
     * Record a response to a participation case.
     */
    respondToCase(participationId: string, params: RespondToCaseParams): Promise<CaseActionResult>;
    /**
     * Close a participation case with a reason.
     */
    closeCase(participationId: string, params: CloseCaseParams): Promise<CaseActionResult>;
}
//# sourceMappingURL=client.d.ts.map