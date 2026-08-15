# PDM Build Roadmap

This is the order a real architect would build this system in — each milestone is something
you can actually run and demo, not just a design doc. Milestone 1 is fully built (see `/backend`
and `/frontend`). Milestones 2+ are scoped here so you know what's coming and why it's sequenced
this way.

**Why this order, generally:** you can't build workflow/events on entities that don't exist yet;
you can't secure endpoints that aren't stable yet; you can't deploy to Kubernetes something that
hasn't been proven in Docker Compose first. Each milestone's foundation has to be solid before the
next one is worth building on top of it.

---

## Milestone 1 — Core Entities (DONE — this delivery)

| Area | What's included |
|---|---|
| **Folder structure** | Standard layered Spring Boot (`controller/service/repository/entity/dto/mapper/exception/config`) + feature-sliced React (`features/<entity>/`) |
| **Database** | Flyway-versioned schema: `organization`, `organization_location`, `practitioner`, `practitioner_role` |
| **Entities** | Practitioner, Organization, OrganizationLocation, PractitionerRole (the attachment relationship) |
| **REST APIs** | Full CRUD + terminate/reinstate for Practitioner and Organization; create/list for OrganizationLocation; assign/list/end for PractitionerRole |
| **UI** | List (MUI DataGrid) + Create/Edit forms (React Hook Form) + Detail pages for Practitioner and Organization; the "attach to location" dialog |
| **Auth** | Stateless-JWT-ready security skeleton, currently `permitAll()` — explicitly flagged as a placeholder |
| **Deployment** | Multi-stage Dockerfiles (backend + frontend), docker-compose for local stack including Postgres/Redis/Kafka (present, unused) |
| **Testing** | Unit test (business rule: NPI uniqueness) + MockMvc integration test (full HTTP → DB round trip on H2) |
| **CI/CD** | GitHub Actions: backend build+test, frontend build+test, Docker image build (no push/deploy yet) |

---

## Milestone 2 — Auth, RBAC, and the Remaining Practitioner Fields

**Why now:** Milestone 1 proved the core entity shape works end-to-end. Before adding more
entities, lock down who can do what — every milestone after this one should be built against
real auth, not `permitAll()`.

- **Database:** add `users`, `roles`, `user_roles` tables (Flyway `V2__...`)
- **Entities:** `AppUser`, `Role` (e.g. `PD_ASSOCIATE`, `PD_ADMIN`, `READ_ONLY`)
- **Backend:** `AuthController` (`POST /api/v1/auth/login` issuing JWT), `JwtAuthFilter`, method-level `@PreAuthorize` on sensitive actions (only `PD_ADMIN` can `/terminate`)
- **Also folded in here:** the rest of the Practitioner entity from the transcript — Specialty, Clinical Interest, Academic, Communication, Language, Telecom, Correspondence Address, License, External Identifier — as child tables (`practitioner_specialty`, `practitioner_license`, etc.), each with its own repository/service, surfaced as tabs on the existing `PractitionerDetailPage`
- **UI:** Login page, protected routes (redirect to login if no token), role-aware buttons (hide Terminate for non-admins)
- **Testing:** security-focused tests — unauthenticated requests get 401, wrong-role requests get 403
- **Deployment:** no change yet — still Docker Compose

## Milestone 3 — Credentialing, Attestation, Workflow Tickets, and Kafka Events

**Why now:** this is where Provider Service Manager's "workflow ticket" concept and Kafka
actually earn their place — once Terminate/Reinstate/Create are real, guarded actions, tracking
their async outcome and notifying other systems becomes necessary, not premature.

- **Entities:** `Credentialing`, `Attestation`, `DisciplinaryAction`, `ProcessingActionStatus`, `WorkflowTicket`
- **Backend:** Kafka producer publishes `PractitionerCreated`, `PractitionerTerminated`, `PractitionerReinstated`, `CredentialingStatusChanged` events; a consumer group updates `WorkflowTicket` status; dead-letter topic for failed processing
- **UI:** Credentialing tab on Practitioner detail; a "Workflow Tickets" screen (mirrors Provider Service Manager's failures tab from the transcript)
- **Testing:** embedded Kafka (`spring-kafka-test`) integration tests for the produce/consume cycle
- **Deployment:** still Compose, but now Kafka is load-bearing, not decorative

## Milestone 4 — Organization/Network Entities, Search, and Redis Caching

**Why now:** Provider Network, Benefit Network, Tax Entity, and Grouping need Organization and
Practitioner to already be stable and real (they reference them) — building them earlier would
mean building against a moving target.

- **Entities:** `ProviderNetwork`, `TaxEntity`, `Grouping` (Benefit Network stays a relationship/lookup, per the transcript, not its own table)
- **Backend:** Postgres full-text search (`tsvector`) or a dedicated search endpoint across NPI/name/specialty/tax ID; `@Cacheable` on hot read paths (practitioner lookup by NPI) backed by Redis
- **UI:** global search bar, Provider Network management screens
- **Testing:** cache-hit/miss tests, search relevance tests
- **Deployment:** still Compose

## Milestone 5 — Distribution/Reporting Modules + Kubernetes

**Why now:** by now there's a real, secured, event-driven system worth actually deploying to a
cluster rather than a docker-compose demo — this is the natural point to introduce Kubernetes.

- **Backend:** Provider Reporting Manager (ingestion stats, error reports) and Provider Distribution Manager (extract generation for downstream consumers) as new Spring Boot modules or separate services, depending on how the microservice-split conversation goes
- **Deployment:** Kubernetes manifests (Deployment, Service, Ingress, ConfigMap/Secret, HPA), readiness/liveness probes wired to the Actuator endpoints already present from Milestone 1, Helm chart or Kustomize overlays for per-environment config
- **CI/CD:** GitHub Actions grows a real deploy stage — build → push to registry → `kubectl apply` / `helm upgrade` against a staging cluster

## Milestone 6 — Hardening: Full Microservice Split, Observability, HIPAA-Grade Security

- Split into services if warranted (Practitioner Service, Organization Service, Credentialing Service, Notification Service) communicating over Kafka + REST
- Centralized logging/tracing (e.g. OpenTelemetry), audit log entity for every field change (not just create/terminate)
- Encryption at rest for PHI-adjacent fields, HIPAA access-logging requirements
- Load testing, chaos testing on the Kafka consumer paths

---

**A practical note:** you don't have to build every milestone before using the system. Milestone 1,
as delivered, is a real, working, testable application for Practitioner/Organization/Location/Role.
The roadmap above is here so each future addition has an obvious place to land instead of being
bolted on wherever's convenient.
