import io
import json

import colorlover as cl
import pandas as pd
from plotly.utils import PlotlyJSONEncoder


def read_ds(f, cat_features):
    ct = f.content_type
    if ct == "text/csv":
        with io.StringIO(f.read().decode()) as decoded:
            df = pd.read_csv(decoded)
            df[cat_features] = df[cat_features].apply(lambda col: col.astype("category"))
            return df
    raise ValueError(f"Unsupported content type '{ct}'")


def fig_to_json(fig):
    convert = lambda obj: json.loads(json.dumps(obj, cls=PlotlyJSONEncoder))
    return dict(
        data=convert(fig.data),
        layout=convert(fig.layout),
    )


def interp_color(n, scale=cl.scales["9"]["seq"]["YlOrRd"]):
    return cl.interp(scale, n+1)[1:]
