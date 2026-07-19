# AGENTS.md
## CAOS SDK
### Official Software Development Kit for the Constitutional Artificial Operating System

This document governs the behavior of all AI agents and automated contributors operating within the **caos-sdk** repository.

These rules are constitutional requirements, not implementation suggestions.

Agents SHALL comply with these rules before performing any analysis, planning, implementation, or modification.

---

## Constitutional Principle

The CAOS SDK is the official public contract between CAOS and external clients.

It is **not** the operating system.

It is **not** an application.

It is **not** a second implementation of CAOS.

Its purpose is to expose stable, versioned public interfaces that allow external software to communicate with the constitutional operating system.

The SDK exposes constitutional capabilities.

It does not implement them.

---

## Agent Responsibilities

Every agent operating inside this repository SHALL:

- preserve stable public contracts
- protect repository boundaries
- maintain backwards compatibility whenever possible
- avoid leaking implementation details
- keep the SDK lightweight
- ensure the SDK accurately represents CAOS public behavior

Convenience SHALL NEVER override architectural boundaries.

---

## Repository Awareness

Before beginning any task, the agent SHALL determine:

1. The repository currently being modified.
2. The constitutional purpose of that repository.
3. Whether the requested work belongs inside this repository.
4. Whether the requested work belongs in another repository instead.

Repository awareness is mandatory.

---

## Repository Identity

Current repository:

**caos-sdk**

Purpose:

The official SDK for communicating with the Constitutional Artificial Operating System.

Constitutional responsibilities include:

- API clients
- Authentication clients
- Projection clients
- Operator clients
- Shared types
- Public interfaces
- Request models
- Response models
- Versioned contracts
- SDK utilities supporting public APIs

Nothing outside these responsibilities shall be implemented here.

---

## Constitutional Boundary

Repository boundaries are constitutional boundaries.

The SDK exists between the operating system and external applications.

It SHALL NEVER become either.

---

## Ecosystem

```
Office of the Citizen
│
├── caos
│   Constitutional Operating System
│
├── caos-sdk
│   Public contracts and SDK
│
├── control-room
│   Operator application
│
└── citizen
    Public-facing applications
```

The SDK is the bridge.

It is not the platform.

It is not the client.

---

## Repository Responsibilities

### The SDK owns

- HTTP clients
- API clients
- Authentication clients
- Projection clients
- Operator clients
- Shared request models
- Shared response models
- Public interfaces
- Public TypeScript types
- API version compatibility
- Developer ergonomics

---

### The SDK MUST NOT contain

- Kernel code
- Engine implementations
- Runtime services
- Workers
- Registries
- Database access
- Constitutional logic
- Verification logic
- Evidence processing
- Compilation logic
- Projection generation
- Business workflows

Those belong inside CAOS.

---

## Cross Repository Rule

Agents SHALL optimize only for the repository they are currently operating in.

Agents SHALL NOT modify another repository unless explicitly instructed.

If a task requires changes in another repository, the agent SHALL:

1. Complete all SDK work.
2. Clearly document the required changes.
3. Identify the owning repository.
4. Stop and await authorization.

Cross-repository implementation SHALL NEVER occur implicitly.

---

## Public Contract First

The SDK exists to expose stable public contracts.

It SHALL NEVER expose:

- internal architecture
- engine internals
- database models
- runtime implementation
- repository structure

Clients interact with contracts.

They never depend on implementation.

---

## No Constitutional Logic

The SDK SHALL NEVER make constitutional decisions.

It SHALL NEVER:

- verify evidence
- compile truth
- evaluate authority
- determine verification status
- generate projections
- enforce governance rules

Those responsibilities belong exclusively to CAOS.

The SDK forwards requests.

CAOS makes decisions.

---

## Stable Interfaces

Public interfaces should prioritize:

- clarity
- consistency
- backwards compatibility
- discoverability
- simplicity

Breaking changes should be rare and intentional.

---

## Versioning

Agents SHALL preserve compatibility whenever reasonably possible.

When breaking changes are necessary, they SHALL:

- document the change
- identify affected consumers
- recommend migration guidance
- update versioning appropriately

---

## Dependency Rule

Applications SHALL communicate with CAOS through this SDK.

The SDK communicates with public CAOS APIs.

The SDK SHALL NEVER depend on CAOS internals.

---

## Design Philosophy

Prefer:

- stable contracts
- explicit APIs
- shared types
- minimal abstractions
- predictable behavior
- lightweight implementation

Avoid:

- duplicated business logic
- hidden behavior
- convenience wrappers that obscure APIs
- implementation leakage
- unnecessary abstractions

---

## Existing Architecture

Before implementing significant work, review:

- README.md
- Public API specifications
- Shared architectural documentation
- Versioning strategy

Agents SHALL strengthen the SDK rather than turning it into another application or another operating system.

---

## Documentation

Whenever public contracts change, agents SHALL update documentation alongside implementation.

The SDK documentation is part of the public contract.

---

## Implementation Standard

Every implementation should be:

- lightweight
- predictable
- well typed
- well documented
- backwards compatible
- easy to consume

The SDK should make CAOS easier to use without hiding how CAOS works.

---

## Final Rule

The SDK is a constitutional contract.

It exists to connect applications to CAOS.

It SHALL NEVER become an implementation of CAOS itself.
