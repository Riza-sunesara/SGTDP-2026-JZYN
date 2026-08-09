# AED Insight — AED Discovery & Routing Simulation Tool

> Prototype for planning and simulation only-not for emergency use. In an emergency in Singapore, call 995 immediately and follow SCDF instructions. Use official SCDF/myResponder channels. Do not delay emergency action to use this prototype.

Built for Sofstica AI Hackathon 2026 - **Track: AED Accessibility, Lane 1 (Discovery & Routing)**

---

## 1. Problem & User Definition

**Intended user:** Community emergency-preparedness planners, facility/registry managers, researchers, and educators - **not** a person mid-emergency.

**The decision they need to make:** Given a test location, date, and time, which public-access AEDs in the SCDF registry would realistically be reachable - accounting for both walking distance and whether the AED would actually be open at that moment?

**What the prototype does NOT do:**
- Does not confirm live AED availability
- Does not provide emergency/medical instructions
- Does not connect to 995, SCDF, or myResponder
- Is not a substitute for calling 995 in a real emergency

**Success criteria:** Outperform the required straight-line-nearest baseline on false-accessible rate (does the recommendation account for closed AEDs?) across synthetic test scenarios, while maintaining low response latency and only recommending confirmed-feasible AEDs.

**Result achieved:** Across 10 synthetic scenarios, baseline produced a false-accessible recommendation in 30% of cases (3/10 scenarios); the system's top-3 recall was 100% feasible with p95 latency of 0.323ms (500 timed samples). Full results in `/docs/evaluation_plan.md`.

---

## 2. Method Card

**Architecture overview:**
Frontend (Lovable/React) → FastAPI backend *(in progress)* → ranking engine (Python, developed and validated in Colab) reading from a precomputed/cached data layer: parsed AED registry + cached scenario-candidate distances. No live external API calls at query time.

**Input features used:**
- OPERATING_HOURS (parsed into structured per-day schedules)
- LATITUDE / LONGITUDE (used for straight-line distance; walking distance derived from this)
- BUILDING_NAME, AED_LOCATION_DESCRIPTION (display fallback chain)
- AED_LOCATION_FLOOR_LEVEL, HOUSE_NUMBER (display only, "unknown" where missing)

**Core logic / models:**
- **Operating-hours parser** (rule-based/regex, not ML): matches a consistent `Day-range Time-range;` grammar found across 99.86% of the dataset. Expands day ranges (e.g., "Mon - Fri") into individual days, handles explicit "Closed" segments, and separately classifies any appended `Remarks:` clause by risk type (midnight-rollover / mid-day-gap / conditional-access - see `/docs/data_manifest.md` for full breakdown and reasoning).
- **Distance ranking:** straight-line (geopy/geodesic) distance adjusted by a 1.35× urban pedestrian detour factor to estimate walking distance, since live routing-API access (OneMap) was blocked during development (reCAPTCHA scoring issue) - documented, disclosed approximation, not silent.
- **Scoring:** weighted combination of normalized distance score and hours-accessibility score (`weights = {"distance": 0.5, "hours": 0.5}`), computed only over AEDs already confirmed feasible for the queried day/time.
- **Confidence/abstention:** AEDs are excluded from ranking entirely (not ranked-but-penalized) when: hours are missing (`status: "unknown"`), hours are ambiguous/unschedulable (`status: "ambiguous"` - mid-day gaps, conditional access), or the parsed schedule shows the AED closed at the queried day/time. This directly implements the brief's "safely abstain when accessibility cannot be established."

**Assumptions:**
- Cross-midnight session rollovers (55 rows, 0.6% of dataset) are not modeled - the system may under-report accessibility for very-late-night queries at these specific AEDs, but will never over-claim accessibility (safe-direction error only).
- Walking distance is a detour-factor estimate, not true street-network routing.
- Candidate pool per scenario is capped at the 10 nearest AEDs by straight-line distance before hours-filtering is applied.

**Human-approval / abstention points:**
The system never asserts an AED is "currently open" - only "in registry, hours parsed with [high/medium] confidence, plausibly open at queried time based on stated hours as of the dataset's February 2020 snapshot." Mid-day-gap and conditional-access AEDs are always excluded rather than guessed at.

---

## 3. Baseline & Evaluation Report

**Required baseline:** Nearest AEDs by straight-line (haversine) distance, no hours filtering - `baseline_nearest()`.

**Test set:** 10 synthetic (location, day-of-week, time) scenarios spanning dense/sparse coverage areas and day/night/weekday/weekend variety - see `/data/cached_scenarios.json`. Full methodology, per-scenario results, and limitations in `/docs/evaluation_plan.md`.

**Nominated primary metric:** Top-3 feasible-AED recall (directly measures the core product question and maps cleanly to the required baseline).

**Metrics reported (100 scenario-candidate pairs, 500 timed calls for latency):**
| Metric | Baseline | Our system |
|---|---|---|
| Top-3 feasible-AED recall | Not applicable - no hours-awareness | **100%** |
| False-accessible rate | **30%** (3/10 scenarios) | 0% (excluded before ranking) |
| p95 response latency | N/A (not ranked) | **0.323 ms** (median 0.199 ms) |
| Avg top-pick distance | 81.0 m (straight-line) | 110.8 m (walking-adjusted) |

**Failure case (baseline, documented honestly):** Scenario S02 (Toa Payoh HDB Hub, Sunday 23:00) - baseline recommended 2 of its top-3 AEDs at locations confirmed closed at that time; the system's top-3 excluded both. Similar baseline failures occurred in scenarios S04 and S08. Full per-scenario detail in `/docs/evaluation_plan.md`.

**Known limitation (our system, documented honestly):** 62 rows (0.6% of dataset) required special Remarks-clause handling; 7 of those are conservatively marked ambiguous rather than parsed, meaning the system will occasionally abstain on an AED that a more sophisticated parser could have confidently included.

---

## 4. Data & Reproducibility Package

See `/docs/data_manifest.md` for full source, license, checksum, and version details.

**Data pipeline (Colab, completed):** `/notebooks/Hackathon.ipynb` — parses the raw AED dataset, builds the cached scenario data, runs the ranking engine and baseline, and produces the evaluation results referenced above. Key outputs: `/data/processed/aed_parsed.geojson`, `/backend/app/data/aed_parsed_backend.json`, `/data/cached_scenarios.json`, `/evaluation/evaluation_results.json`.

**Live deployment:**
- Frontend: https://aed-insight.vercel.app
- Backend API: https://sgtdp-backend.fastapicloud.dev

**Local setup instructions:**
```bash
# backend
cd backend
pip install -r requirements.txt
fastapi dev app/main.py

# frontend
cd frontend
npm install
npm run dev
```

**Backend deployment notes (for reproducibility):**
- Deployed via FastAPI Cloud (`fastapi deploy`), using `requirements.txt` (includes `fastapi[standard]`) and a `.python_version` file at the `backend/` root to pin the Python version.
- `backend/app/data/` contains a local copy of `aed_parsed_backend.json` and `cached_scenarios.json` — this makes the backend self-contained for deployment, independent of the repo's top-level `/data/` folder (which remains the canonical, checksummed source per `data_manifest.md`).
- CORS (`main.py`) is configured to allow the deployed frontend origin; local development origins (`localhost:5173`) remain enabled for local testing.

**Dataset checksums:** see `/docs/data_manifest.md` (raw file + processed file SHA-256 recorded there).

---

## 5. Safety & Privacy Statement

- ✅ Uses only historical/synthetic test scenarios (no real incident data)
- ✅ No live integration with 995, SCDF, or myResponder
- ✅ No diagnosis, treatment, or CPR instructions provided
- ✅ Never labels an AED as "currently available" - only "in registry, plausibly open based on stated hours"
- ✅ Safety banner displayed on every screen
- ✅ No names, contact details, or precise personal location history collected
- ✅ No credentials/API keys committed to this repository

---

## 6. What We'd Improve With More Time
[Fill in during/after build]