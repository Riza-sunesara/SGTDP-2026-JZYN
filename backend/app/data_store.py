import json
from typing import Any, Dict, List

from .config import AED_DATA_PATH, SCENARIOS_PATH

_aed_records: List[Dict[str, Any]] = []
_known_locations: List[Dict[str, Any]] = []


def load_data() -> None:
    """Call once at FastAPI startup — every request reuses this in-memory
    data instead of re-reading disk each time."""
    global _aed_records, _known_locations

    with open(AED_DATA_PATH, "r", encoding="utf-8") as f:
        _aed_records = json.load(f)

    with open(SCENARIOS_PATH, "r", encoding="utf-8") as f:
        _known_locations = json.load(f)


def get_aed_records() -> List[Dict[str, Any]]:
    return _aed_records


def get_known_locations() -> List[Dict[str, Any]]:
    return _known_locations