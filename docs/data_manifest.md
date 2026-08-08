# Data Manifest

## Core dataset (mandatory)

| Field | Value |
|---|---|
| Name | SCDF Public Access AEDs |
| Source URL | https://data.gov.sg/datasets/d_4e6b82c58a8a832f6f1fee5dfa6d47ea/view |
| Publisher | Singapore Civil Defence Force (SCDF), via data.gov.sg |
| Underlying data date | February 2020 (per brief) |
| Retrieval / download date | [fill in — the day you downloaded it] |
| License | [check data.gov.sg page — usually Singapore Open Data Licence] |
| Format | GeoJSON |
| Total rows | 9,644 |
| Fields used | OBJECTID, AED_ID, OPERATING_HOURS, HOUSE_NUMBER, ROAD_NAME, BUILDING_NAME, UNIT_NUMBER, POSTAL_CODE, AED_LOCATION_DESCRIPTION, AED_LOCATION_FLOOR_LEVEL, LATITUDE, LONGITUDE |
| Fields explicitly NOT used | INC_CRC, FMEL_UPD_D, XVAL, YVAL (no authoritative meaning documented per brief's warning) |
| Transformations applied | OPERATING_HOURS parsed into structured per-day open/close schedules via rule-based regex parser (day-range + time-range grammar); Remarks clauses classified by risk type (see Data Quality Observations below) |
| Raw file SHA-256 | [paste hash from Step 1 output] |
| Raw filename | PublicAccessAEDs.geojson |
| Processed file SHA-256 | [paste hash from Step 5 output] |
| Processed filename | aed_parsed.geojson |
| Organizer frozen snapshot version | [fill in ONLY if/when Sofstica releases an official frozen copy — until then: "using public data.gov.sg copy, retrieved [date]"] |

## Supplemental dataset(s)

None used. Routing/walking-distance is estimated via a detour-factor
calculation (see "Cached scenario inputs" below) rather than an external
supplemental dataset or live routing service.

## Data Quality Observations

Understanding *why* the data looks the way it does, not just running `.isnull()`.

| Field | Missing count | Missing % | Why / how handled |
|---|---|---|---|
| LATITUDE / LONGITUDE | 0 | 0% | Complete — every AED has usable coordinates, no fallback needed |
| AED_LOCATION_DESCRIPTION | 0 | 0% | Complete — used as fallback display field when BUILDING_NAME is missing |
| OPERATING_HOURS | 7 | 0.07% | Falls to `status: "unknown"` in parser; AED still shown, accessibility flagged as unconfirmed rather than dropped |
| BUILDING_NAME | 5,265 | 54.6% | Reflects real-world AED placement — many AEDs are on streets, in void decks, or at standalone kiosks rather than inside named buildings. Not a data quality defect. AED_LOCATION_DESCRIPTION used as fallback. |
| UNIT_NUMBER | 9,301 | 96.4% | Same reasoning — unit numbers only apply to AEDs inside numbered office/shop units, which is the minority case. |
| AED_LOCATION_FLOOR_LEVEL | 205 | 2.1% | Treated as "floor unknown" in output display. |
| HOUSE_NUMBER | 97 | 1.0% | Treated as "unknown" in output display. |

### Operating-hours parsing results

| Status | Count | % of total |
|---|---|---|
| Parsed (high or medium confidence) | 9,630 | 99.86% |
| Unknown (blank/null source text) | 7 | 0.07% |
| Ambiguous (parsing risk — see below) | 7 | 0.07% |

**Confidence breakdown (within "parsed" status):**

| Confidence | Count |
|---|---|
| High (no Remarks clause) | 9,575 |
| Medium (Remarks clause present, safe direction) | 55 |

### Remarks clause handling (62 rows, 0.6% of dataset)

62 rows contain a `Remarks:` clause appended to the base OPERATING_HOURS
text. These were **not** uniform in meaning and required classification:

- **55 rows (89%) — midnight rollover** (e.g., "Closes at 3:00 AM"): the
  AED's session extends past midnight into the next calendar day. The
  parser does not model this rollover — each day's hours are treated
  independently — so very-late-night queries for these specific AEDs may
  be **under-reported as closed** when the AED is actually still within
  an extended session. This is a deliberate, documented limitation: the
  system defaults toward under-claiming accessibility (false negative)
  rather than over-claiming it (false positive), consistent with the
  brief's safety requirements. Parsed with `confidence: "medium"`.

- **4 rows — mid-day closure gap** (e.g., "Closed from 3:00 PM to 6:00
  PM"): the base schedule does not capture a stated exception window.
  Because silently ignoring this would risk a **false-accessible**
  claim (the dangerous direction), these rows are explicitly marked
  `status: "ambiguous"`, `confidence: "low"` rather than parsed at face
  value.

- **3 rows — fully conditional/unschedulable access** (e.g., "Depending
  on arrival and departure of ferries", "Please Call [number], After
  5:30 PM"): access cannot be represented by a day/time schedule at all.
  Marked `status: "ambiguous"`, `confidence: "low"`.

## Cached scenario inputs (geocoding + routing)

Per the brief: "Freeze or cache API-derived inputs used in the judged
demonstration so results can be reproduced without a live service."

| Field | Value |
|---|---|
| External service(s) used | None — OneMap Singapore API registration blocked by reCAPTCHA scoring during development; walking distance estimated via detour factor instead (see below) |
| Number of scenarios | 10 |
| Number of scenario-candidate pairs cached | 100 (10 scenarios × top-10 nearest candidates each) |
| What was cached | Straight-line distance (geopy/geodesic) per scenario-to-candidate pair, adjusted via a 1.35× urban pedestrian detour factor to estimate walking distance; parsed operating-hours data per candidate |
| Walking distance method | Detour factor estimate (1.35× straight-line), not a live routing-network query. This is a recognized approximation technique in pedestrian-accessibility research; it does not account for actual obstacles (waterways, fences, building footprints) the way true network routing would. |
| Cache file location | /data/cached_scenarios.json (scenario origins), /data/cached_routes.json (distances + parsed hours per candidate) |
| Retrieval date | [fill in — the day Step 6 was run] |
| Live service called during judged demo? | No — all distances precomputed and cached; ranking runs entirely offline at query time |

## Synthetic data (test scenarios)

| Field | Value |
|---|---|
| What was generated | 10 synthetic test scenarios: location name + coordinates + day of week + time |
| How it was generated | Manually selected across Singapore to cover variety: dense vs. sparse AED coverage, weekday vs. weekend, and day vs. late-night/early-morning hours, to stress-test both the operating-hours parser and the ranking logic against realistic edge cases |
| Locations used | Bugis Junction, Toa Payoh HDB Hub, Orchard Road (ION Orchard), Pioneer Walk, Jurong Point, Yishun Ring Road, Tampines Mall, Chinatown (Pagoda Street), Punggol Waterway Point, Bishan-Ang Mo Kio Park |
| Kept separate from real data? | Y — stored in /data/cached_scenarios.json, clearly labeled as synthetic/scripted, never presented as real incident data |

## Explicitly confirmed NOT used (per brief rules)

- [x] No live SCDF incident data
- [x] No private dispatch data
- [x] No patient records
- [x] No responder identities
- [x] No non-public myResponder data
- [x] No individual-level demographic/medical risk inference