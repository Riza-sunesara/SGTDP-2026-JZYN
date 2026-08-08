from typing import List, Tuple
from geopy.distance import geodesic

from .config import DETOUR_FACTOR, MAX_DISTANCE_SCORE_CAP_M
from .hours import compute_hours_score


def get_candidates(origin_lat: float, origin_lng: float, aed_records: List[dict], n: int) -> List[dict]:
    scored = []
    for aed in aed_records:
        dist_m = geodesic((origin_lat, origin_lng), (aed["LATITUDE"], aed["LONGITUDE"])).meters
        scored.append({**aed, "straight_line_distance_m": round(dist_m, 1)})
    scored.sort(key=lambda x: x["straight_line_distance_m"])
    return scored[:n]


def estimate_walking_distance(straight_line_distance_m: float, detour_factor: float = DETOUR_FACTOR) -> float:
    return round(straight_line_distance_m * detour_factor, 1)


def compute_distance_score(walking_distance_m: float, max_distance_m: float = MAX_DISTANCE_SCORE_CAP_M) -> float:
    capped = min(walking_distance_m, max_distance_m)
    return round(1 - (capped / max_distance_m), 3)


def rank_aeds(day_of_week: str, time_str: str, candidates: List[dict], weights: dict) -> Tuple[List[dict], List[dict]]:
    scored = []
    for c in candidates:
        hours_score, is_feasible = compute_hours_score(c["parsed_hours"], day_of_week, time_str)
        distance_score = compute_distance_score(c["walking_distance_m"])
        overall_score = weights["distance"] * distance_score + weights["hours"] * hours_score
        scored.append({
            **c,
            "distance_score": distance_score,
            "hours_score": hours_score,
            "is_feasible": is_feasible,
            "overall_score": overall_score,
        })

    feasible = [c for c in scored if c["is_feasible"]]
    infeasible = [c for c in scored if not c["is_feasible"]]
    ranked = sorted(feasible, key=lambda x: x["overall_score"], reverse=True)
    return ranked, infeasible


def baseline_nearest(candidates: List[dict], top_k: int = 3) -> List[dict]:
    return sorted(candidates, key=lambda x: x["straight_line_distance_m"])[:top_k]