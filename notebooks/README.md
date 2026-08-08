# Notebooks

Put your Colab work here (export as .ipynb when done).

Planned notebooks:
1. `01_explore_dataset.ipynb` — load AED GeoJSON, inspect OPERATING_HOURS
   values, note distinct patterns to design the parser around
2. `02_hours_parser.ipynb` — build + test the operating-hours parser against
   real example strings from the dataset
3. `03_walking_graph.ipynb` — build/cache OSMnx walking network for your
   demo area, test shortest-path distance calculation, save cached graph
   file for the backend to load (don't rebuild live on every server start)
4. `04_evaluation.ipynb` — run baseline vs. your system on
   /data/test_scenarios.csv, compute metrics, export results table
