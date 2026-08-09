# Data Manifest

## Primary source

- **Dataset:** SCDF Public Access AEDs
- **Publisher:** Singapore Civil Defence Force (SCDF), via data.gov.sg
- **Underlying data date:** February 2020 (historical registry snapshot, not a live feed)
- **File used:** `data/raw/PublicAccessAEDs.geojson` (untouched original download)
- **SHA-256 checksum (raw file):** _e2ef793ffd0fd2dbe99ffdcfb21b38154c81fd0685d1f0fcc5b75a6d57205c02_
- **SHA-256 checksum (processed file):** _d88b165d5e22f4ed3d4a69f67f4db31e5c5e5bd5345f42408792ede1d50b8783_
- **License/usage:** Contains information from SCDF Public Access AEDs accessed on
  8 August 2026 from data.gov.sg which is made available under the terms of the
  Singapore Open Data Licence version 1.0 https://data.gov.sg/open-data-licence*
  - Free for personal or commercial use, per the licence terms. Used here strictly
  as a historical planning/simulation snapshot, per the challenge brief's boundary -
  not treated as a live or authoritative source of current AED status, and not used
  in any way that suggests official SCDF endorsement of this prototype.

## Derived files and their roles

| File | Produced by | Purpose | Used by live backend? |
|---|---|---|---|
| `data/processed/aed_parsed.geojson` | Notebook, cell 13 | Official checksummed reproducibility artifact - full parsed dataset in GeoJSON | No |
| `backend/app/data/aed_parsed_backend.json` | Notebook, added export cell | Plain-JSON export of the same parsed data, with `parsed_hours` preserved as a real nested object rather than a stringified GeoJSON property | **Yes** - this is what the FastAPI backend loads at startup |
| `data/cached_scenarios.json` | Notebook, cell 15 | 20 curated synthetic test locations (name, lat/lng, day, time) used as the bounded, documented set of valid location inputs | Yes - backend validates incoming `location` against this list |
| `data/cached_routes.json` | Notebook, cell 16 | Precomputed candidate-AED distances for each of the 20 scenarios, used to build and sanity-check the evaluation report | No - evaluation-only. Live backend recomputes distances fresh via `get_candidates()` against the full dataset, not from this cache |
| `evaluation/evaluation_results.json` | Notebook, cells 25/27 | Metrics and per-scenario results comparing the ranking system against the baseline | No - reporting artifact, referenced in `evaluation_plan.md` and the README |

**Why two parsed exports exist (`aed_parsed.geojson` vs `aed_parsed_backend.json`):**
GeoJSON export via `geopandas`/`fiona` does not reliably preserve nested dict columns
(`parsed_hours`) as real JSON - it can silently stringify them. Rather than write
string-parsing logic to recover a nested structure that should never have been
flattened, a second, backend-facing export was added that writes plain JSON directly,
keeping `parsed_hours` as a real object. Both files are derived from the same parsed
`gdf` in the same notebook run - they are not independent sources of truth, and are
regenerated together whenever the notebook is re-run.

## Transformations applied (summary - full logic in `notebooks/Hackathon.ipynb`)

1. **Operating-hours parsing** (`parse_operating_hours`) - the raw `OPERATING_HOURS`
   text field is parsed into a structured per-day schedule, with a `confidence` level
   (`high`/`medium`/`low`/`none`) and `status` (`parsed`/`ambiguous`/`unknown`).
   Remarks text is classified into risk categories (`mid_day_gap`,
   `conditional_access`, `midnight_rollover`, `other_remark`) and any remark type
   describing an unmodelable condition (mid-day gap, fully conditional access)
   downgrades the row to `ambiguous`/`low` confidence rather than being ignored.
2. **Distance estimation** - walking distance is *not* from a routing API. It is
   estimated as `straight_line_distance_m × 1.35` (a commonly cited pedestrian
   detour-factor multiplier), applied uniformly. This is an approximation, not a real
   route, and is labeled as such (`walking_distance_method:
   detour_factor_estimate_1.35x`) in every cached record.
3. **Candidate selection** - for a given origin point, the 10 nearest AEDs by
   straight-line distance are taken as candidates before ranking (`N_CANDIDATES = 10`
   in the notebook, `CANDIDATE_POOL_SIZE` in the backend - kept in sync manually).

## Supplemental data

- **Geopy `geodesic` distance calculation** - open-source library, used for
  straight-line distance only; not a live network service.
- No other external, live, or third-party datasets are used. No population, footfall,
  or demand data is incorporated in this MVP.

## What this data explicitly does not support

Per the SCDF dataset's own limitations and the challenge brief: this data does not
confirm live AED presence, battery/maintenance status, real-time closures, or
current operational readiness. All outputs are historical-data-informed planning
estimates, not live availability claims. See `docs/safety_banner_text.md` for the
exact user-facing disclaimer required on every screen.