from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import CANDIDATE_POOL_SIZE, RANK_WEIGHTS
from .data_store import get_aed_records, load_data
from .hours import validate_day_and_time
from .locations import find_known_location, list_known_location_names
from .ranking import (
    baseline_nearest,
    estimate_walking_distance,
    get_candidates,
    rank_aeds,
)
from .result_builder import (
    build_all_closed_result,
    build_scenario_result,
)
from .schemas import (
    ScenarioErrorResponse,
    ScenarioRequest,
    ScenarioResult,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_data()
    yield


app = FastAPI(title="AED Insight API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3001"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ScenarioAPIError(Exception):
    def __init__(
        self,
        code: str,
        title: str,
        message: str,
        suggestions=None,
    ):
        self.code = code
        self.title = title
        self.message = message
        self.suggestions = suggestions


@app.exception_handler(ScenarioAPIError)
async def scenario_error_handler(request, exc: ScenarioAPIError):
    return JSONResponse(
        status_code=422,
        content=ScenarioErrorResponse(
            code=exc.code,
            title=exc.title,
            message=exc.message,
            suggestions=exc.suggestions,
        ).model_dump(),
    )


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/analyze-scenario", response_model=ScenarioResult)
def analyze_scenario(payload: ScenarioRequest):
    if not validate_day_and_time(payload.dayOfWeek, payload.time):
        raise ScenarioAPIError(
            code="service-unavailable",
            title="Unable to process scenario",
            message="The day or time provided is not in a supported format.",
        )

    known = find_known_location(payload.location)

    if known is None:
        raise ScenarioAPIError(
            code="location-not-found",
            title="Location not found",
            message=(
                "We couldn't identify this location. "
                "Please choose one of the supported locations."
            ),
            suggestions=list_known_location_names(),
        )

    user_point = {
        "lat": known["lat"],
        "lng": known["lng"],
    }

    raw_candidates = get_candidates(
        known["lat"],
        known["lng"],
        get_aed_records(),
        n=CANDIDATE_POOL_SIZE,
    )

    candidates_with_walking = [
        {
            **candidate,
            "walking_distance_m": estimate_walking_distance(
                candidate["straight_line_distance_m"]
            ),
        }
        for candidate in raw_candidates
    ]

    # rank_aeds() determines whether candidates are feasible for the
    # requested day/time and ranks feasible candidates by recommendation score.
    ranked, infeasible = rank_aeds(
        payload.dayOfWeek,
        payload.time,
        candidates_with_walking,
        RANK_WEIGHTS,
    )

    # Nearest-distance baseline is kept separately for comparison/explanation.
    baseline_top3 = baseline_nearest(
        candidates_with_walking,
        top_k=3,
    )

    # No feasible AED exists for the requested scenario.
    # A low recommendation score does NOT make an otherwise feasible AED invalid.
    if not ranked:
        return build_all_closed_result(
            payload.model_dump(),
            user_point,
            infeasible,
        )

    return build_scenario_result(
        payload.model_dump(),
        user_point,
        ranked,
        infeasible,
        baseline_top3,
    )