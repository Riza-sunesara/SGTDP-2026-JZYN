from typing import List, Literal, Optional
from pydantic import BaseModel


class ScenarioRequest(BaseModel):
    location: str
    dayOfWeek: str
    time: str  # "HH:MM"


class GeoPoint(BaseModel):
    lat: float
    lng: float


class FactorScores(BaseModel):
    distance: float
    operatingHours: float
    accessibility: float
    locationConfidence: float


OperatingHoursStatus = Literal["match", "no-match", "uncertain"]


class AedCandidate(BaseModel):
    id: str
    name: str
    point: GeoPoint
    distanceMeters: float
    operatingHours: OperatingHoursStatus
    accessibility: Optional[str] = None
    floor: Optional[str] = None
    overallScore: float
    factors: FactorScores


class DecisionSupportBaseline(BaseModel):
    label: str
    scoreLabel: str


class DistanceBaseline(BaseModel):
    label: str
    distanceLabel: str


class BaselineComparison(BaseModel):
    decisionSupport: DecisionSupportBaseline
    distanceBaseline: DistanceBaseline


ScenarioWarning = Literal[
    "long-distance",
    "all-candidates-closed",
    "ambiguous-hours",
    "low-confidence",
    "route-unavailable",
]


class ScenarioResult(BaseModel):
    input: ScenarioRequest
    userPoint: GeoPoint
    recommendation: Optional[AedCandidate] = None
    candidates: List[AedCandidate]
    route: Optional[List[GeoPoint]] = None
    baseline: Optional[BaselineComparison] = None
    explanationFacts: List[str]
    warnings: List[ScenarioWarning]


ScenarioErrorCode = Literal[
    "location-not-found",
    "location-outside-singapore",
    "no-qualifying-aed",
    "service-unavailable",
]


class ScenarioErrorResponse(BaseModel):
    code: ScenarioErrorCode
    title: str
    message: str
    suggestions: Optional[List[str]] = None