"""
Central configuration for AED Insight.

Ranking and distance constants are tunable assumptions.
They should be sanity-checked against evaluation results before finalizing.
"""

from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
APP_DATA_DIR = BASE_DIR / "data"
REPO_ROOT = BASE_DIR.parents[1]
REPO_DATA_DIR = REPO_ROOT / "data"

AED_DATA_PATH = APP_DATA_DIR / "aed_parsed_backend.json"
SCENARIOS_PATH = APP_DATA_DIR / "cached_scenarios.json"
if not AED_DATA_PATH.exists():
    AED_DATA_PATH = REPO_DATA_DIR / "processed" / "aed_parsed.geojson"
if not SCENARIOS_PATH.exists():
    SCENARIOS_PATH = REPO_DATA_DIR / "cached_scenarios.json"


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