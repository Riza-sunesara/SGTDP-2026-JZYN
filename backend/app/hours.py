import re
from datetime import datetime
from typing import Tuple

VALID_DAYS = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"}
TIME_RE = re.compile(r'^([01]\d|2[0-3]):([0-5]\d)$')


def validate_day_and_time(day_of_week: str, time_str: str) -> bool:
    return day_of_week in VALID_DAYS and bool(TIME_RE.match(time_str))


def compute_hours_score(parsed_hours: dict, day_of_week: str, time_str: str) -> Tuple[float, bool]:
    status = parsed_hours.get('status')
    confidence = parsed_hours.get('confidence')

    if status in ('unknown', 'ambiguous'):
        return 0.0, False

    schedule = parsed_hours.get('schedule', {})
    day_key = day_of_week[:3].upper()
    day_hours = schedule.get(day_key)

    if day_hours is None:
        return 0.0, False

    open_t, close_t = day_hours
    query_time = datetime.strptime(time_str, "%H:%M").time()
    open_time = datetime.strptime(open_t, "%H:%M").time()
    close_time = datetime.strptime(close_t, "%H:%M").time()

    is_open = open_time <= query_time <= close_time
    if not is_open:
        return 0.0, False

    score = 1.0 if confidence == "high" else 0.7
    return score, True