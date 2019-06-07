import io

import pandas as pd


def read_ds(f):
    ct = f.content_type
    if ct == "text/csv":
        with io.StringIO(f.read().decode()) as decoded:
            return pd.read_csv(decoded)
    raise ValueError(f"Unsupported content type '{ct}'")
