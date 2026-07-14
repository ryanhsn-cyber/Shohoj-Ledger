# MISSION

**Core Goal:**
Develop a Company Finance & Revenue Sharing CRM (Shohoj Ledger) to manage income, expenses, reserve balances, member loans, due balances, and monthly settlements. The system ensures that only paid/partial income is included in settlement, and shares are calculated properly between the CEO, Developers, and Company (reserve balance).

**Current Status:**

- **Last major feature added:** Completed Phase 3 (Funds, Reserves & Advances), establishing APIs and UIs for company capital injections, reserve balance tracking, member loans (with 6-month overdue logic), and member salary advances.
- **Next Phase:** Phase 4 (Monthly Settlement Engine), focusing on the core math engine to calculate net distributions based on paid/partial income, approved expenses, and active advances.

**Goal Pivots:**
N/A (Initial Setup)

**Production Roadmap:**

- [x] Define Prisma schema and database models
- [ ] Implement backend API routes for CRUD operations
- [ ] Build the UI for Dashboard and core modules (Income, Expenses, Loans, Settlement)
- [x] Setup authentication (Better Auth)
- [ ] Implement Monthly Settlement Logic
- [ ] Deploy to production via Coolify
