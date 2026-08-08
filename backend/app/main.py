"""
FastAPI backend entrypoint — AED Discovery & Routing prototype.

Planned endpoints:
  GET  /health                 -> simple uptime check
  POST /rank-aeds               -> body: {lat, lon, day_of_week, time}
                                    returns: ranked list of AEDs with
                                    walking distance, parsed hours status,
                                    and confidence/abstain flag
  GET  /baseline-rank-aeds      -> same input, straight-line baseline only
                                    (for comparison in evaluation report)

Remember: outputs must never claim live availability. Only
"in registry, plausibly open based on stated hours as of [dataset date]".
"""

from fastapi import FastAPI

app = FastAPI(title="AED Discovery & Routing (Simulation Only)")


@app.get("/health")
def health():
    return {"status": "ok"}


# TODO: load AED dataset + precomputed walking graph at startup
# TODO: implement operating-hours parser
# TODO: implement /rank-aeds and /baseline-rank-aeds
