# CAOS SDK

The official SDK for communicating with the CAOS (Constitutional Artificial Operating System).

## Purpose

This repository provides the public contract between CAOS and external clients.

It contains the APIs, clients, authentication, shared types, and interfaces required to build applications on top of CAOS.

## Scope

This repository may contain:

- API clients
- Authentication clients
- Projection clients
- Operator clients
- Shared types
- Public interfaces

This repository MUST NOT contain:

- Kernel code
- Engine implementations
- Runtime code
- Business logic
- Database access
- Constitutional decision-making

## Design Principle

Applications communicate with CAOS exclusively through this SDK.

The SDK exposes public contracts, not implementation.
