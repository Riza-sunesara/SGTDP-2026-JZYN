"""
Central configuration for AED Insight.

Ranking and distance constants are tunable assumptions.
They should be sanity-checked against evaluation results before finalizing.
"""

from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

AED_DATA_PATH = DATA_DIR / "aed_parsed_backend.json"
SCENARIOS_PATH = DATA_DIR / "cached_scenarios.json"

# Fail loudly at import time if the bundled data is missing, rather than
# deep inside load_data() with a less obvious traceback. Since these files
# are committed inside backend/app/data/, this should only ever fire if a
# deployment genuinely didn't include them (e.g. an overly broad
# .gitignore/.fastapicloudignore excluding the data folder).
if not AED_DATA_PATH.exists():
    raise RuntimeError(f"Missing bundled data file: {AED_DATA_PATH}")
if not SCENARIOS_PATH.exists():
    raise RuntimeError(f"Missing bundled data file: {SCENARIOS_PATH}")


# Recommendation ranking weights.
# Distance and operating-hours confidence contribute equally.
RANK_WEIGHTS = {
    "distance": 0.5,
    "hours": 0.5,
}


# Number of nearby AEDs considered before viability/ranking.
CANDIDATE_POOL_SIZE = 10

# Number of ranked AED recommendations returned to the frontend.
CANDIDATES_RETURNED = 3


# Must match the value used to build cached_routes.json.
DETOUR_FACTOR = 1.35

# Walking distance at which the distance score reaches its minimum.
MAX_DISTANCE_SCORE_CAP_M = 1000

# Distance above which a long-distance warning is generated.
LONG_DISTANCE_THRESHOLD_M = 1200

# Location-confidence score below which a warning is generated.
LOW_CONFIDENCE_THRESHOLD = 50


# Operating-hours confidence converted to a 0-100 score.
CONFIDENCE_TO_SCORE = {
    "high": 95,
    "medium": 70,
    "low": 40,
    "none": 10,
}