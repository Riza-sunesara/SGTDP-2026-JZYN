from typing import List, Optional

from .data_store import get_known_locations


def _normalize(text: str) -> str:
    return text.strip().lower()


def find_known_location(location_text: str) -> Optional[dict]:
    target = _normalize(location_text)
    for loc in get_known_locations():
        if _normalize(loc["location_name"]) == target:
            return loc
    return None


def list_known_location_names() -> List[str]:
    return [loc["location_name"] for loc in get_known_locations()]