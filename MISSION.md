# MISSION

**Core Goal:**
Develop a Company Finance & Revenue Sharing CRM (Shohoj Ledger) to manage income, expenses, reserve balances, member loans, due balances, and monthly settlements. The system ensures that only paid/partial income is included in settlement, and shares are calculated properly between the CEO, Developers, and Company (reserve balance).

**Current Status:**
- **Last major feature added:** Completed Phase 1 (Project Scaffolding & Core Architecture), including Next.js 15 initialization, Postgres database setup, Better Auth configuration, and establishing the Premium Dark UI Foundation.
- **Next Phase:** Phase 2 (Core Financial Operations - Income & Expenses). Prisma schema is defined with models for User, Project, Income, Expense, FundTransaction, ReserveTransaction, MemberLoan, Advance, and Settlement.

**Goal Pivots:**
N/A (Initial Setup)

**Production Roadmap:**

- [x] Define Prisma schema and database models
- [ ] Implement backend API routes for CRUD operations
- [ ] Build the UI for Dashboard and core modules (Income, Expenses, Loans, Settlement)
- [x] Setup authentication (Better Auth)
- [ ] Implement Monthly Settlement Logic
- [ ] Deploy to production via Coolify
