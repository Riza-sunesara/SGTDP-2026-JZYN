from typing import List, Optional

from .config import CANDIDATES_RETURNED, CONFIDENCE_TO_SCORE, LONG_DISTANCE_THRESHOLD_M, LOW_CONFIDENCE_THRESHOLD


def _accessibility_text(candidate: dict) -> Optional[str]:
    return candidate.get("AED_LOCATION_DESCRIPTION") or None


def _accessibility_factor(candidate: dict) -> float:
    has_building = bool(candidate.get("BUILDING_NAME"))
    has_description = bool(candidate.get("AED_LOCATION_DESCRIPTION"))
    has_floor = bool(candidate.get("AED_LOCATION_FLOOR_LEVEL"))
    completeness = sum([has_building, has_description, has_floor]) / 3
    return round(completeness * 100, 1)


def _location_confidence(candidate: dict) -> float:
    confidence = candidate.get("parsed_hours", {}).get("confidence", "none")
    return CONFIDENCE_TO_SCORE.get(confidence, 10)


def _operating_hours_status(candidate: dict) -> str:
    if candidate.get("is_feasible"):
        return "match"
    status = candidate.get("parsed_hours", {}).get("status")
    if status in ("unknown", "ambiguous"):
        return "uncertain"
    return "no-match"


def _to_aed_candidate(candidate: dict) -> dict:
    return {
        "id": candidate["AED_ID"],
        "name": candidate.get("BUILDING_NAME") or candidate["AED_ID"],
        "point": {"lat": candidate["LATITUDE"], "lng": candidate["LONGITUDE"]},
        "distanceMeters": candidate["walking_distance_m"],
        "operatingHours": _operating_hours_status(candidate),
        "accessibility": _accessibility_text(candidate),
        "floor": candidate.get("AED_LOCATION_FLOOR_LEVEL") or None,
        "overallScore": round(candidate.get("overall_score", 0) * 100, 1),
        "factors": {
            "distance": round(candidate.get("distance_score", 0) * 100, 1),
            "operatingHours": round(candidate.get("hours_score", 0) * 100, 1),
            "accessibility": _accessibility_factor(candidate),
            "locationConfidence": _location_confidence(candidate),
        },
    }


def _explanation_for_recommendation(recommendation: dict, baseline_top1: Optional[dict], day_of_week: str, time_str: str) -> List[str]:
    lines = []
    hours_phrase = (
        f"its historical operating-hours information matches the requested time ({day_of_week} {time_str})"
        if recommendation["operatingHours"] == "match"
        else "its historical operating-hours information could not be confirmed for the requested time"
    )
    lines.append(
        f"{recommendation['name']} ranks highest because {hours_phrase}, with an overall qualifying "
        f"score of {recommendation['overallScore']}%."
    )
    lines.append(
        f"It is an estimated {recommendation['distanceMeters']} m walking distance from the requested "
        f"location, with a location-confidence factor of {recommendation['factors']['locationConfidence']}% "
        f"based on the historical dataset."
    )
    if baseline_top1 is not None:
        lines.append(
            f"A simple nearest-distance baseline would instead pick "
            f"{baseline_top1.get('BUILDING_NAME') or baseline_top1['AED_ID']} "
            f"(straight-line distance: {baseline_top1['straight_line_distance_m']} m), which does not "
            f"account for operating hours or accessibility."
        )
    return lines


def build_scenario_result(scenario_input: dict, user_point: dict, ranked: List[dict], infeasible: List[dict], baseline_top3: List[dict]) -> dict:
    warnings: List[str] = []

    best = ranked[0]
    recommendation = _to_aed_candidate(best)
    route = [user_point, recommendation["point"]]

    if recommendation["distanceMeters"] > LONG_DISTANCE_THRESHOLD_M:
        warnings.append("long-distance")
    if recommendation["factors"]["locationConfidence"] < LOW_CONFIDENCE_THRESHOLD:
        warnings.append("low-confidence")

    top_candidates = ranked[:CANDIDATES_RETURNED]
    candidates_out = [_to_aed_candidate(c) for c in top_candidates]
    if any(c["operatingHours"] == "uncertain" for c in candidates_out):
        warnings.append("ambiguous-hours")

    baseline = None
    if baseline_top3:
        b1 = baseline_top3[0]
        baseline = {
            "decisionSupport": {
                "label": recommendation["name"],
                "scoreLabel": f"Score: {recommendation['overallScore']}%",
            },
            "distanceBaseline": {
                "label": b1.get("BUILDING_NAME") or b1["AED_ID"],
                "distanceLabel": f"Distance: {b1['straight_line_distance_m']} m",
            },
        }

    explanation_facts = _explanation_for_recommendation(
        recommendation, baseline_top3[0] if baseline_top3 else None,
        scenario_input["dayOfWeek"], scenario_input["time"],
    )

    return {
        "input": scenario_input,
        "userPoint": user_point,
        "recommendation": recommendation,
        "candidates": candidates_out,
        "route": route,
        "baseline": baseline,
        "explanationFacts": explanation_facts,
        "warnings": warnings,
    }


def build_all_closed_result(scenario_input: dict, user_point: dict, infeasible: List[dict]) -> dict:
    """Every candidate was closed/ambiguous at this day+time — a real,
    informative result (mirrors the mock's 'closed' scenario), not an error."""
    candidates_out = [_to_aed_candidate(c) for c in infeasible[:CANDIDATES_RETURNED]]
    return {
        "input": scenario_input,
        "userPoint": user_point,
        "recommendation": None,
        "candidates": candidates_out,
        "route": None,
        "baseline": None,
        "explanationFacts": [
            "No feasible candidates for this scenario, so no recommendation is shown."
        ],
        "warnings": ["all-candidates-closed"],
    }