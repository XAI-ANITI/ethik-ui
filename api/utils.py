import io
import json

import pandas as pd
from plotly.utils import PlotlyJSONEncoder


def read_ds(f):
    ct = f.content_type
    if ct == "text/csv":
        with io.StringIO(f.read().decode()) as decoded:
            return pd.read_csv(decoded)
    raise ValueError(f"Unsupported content type '{ct}'")


def fig_to_json(fig):
    convert = lambda obj: json.loads(json.dumps(obj, cls=PlotlyJSONEncoder))
    layout = convert(fig.layout)
    layout.pop("template")
    return dict(
        data=convert(fig.data),
        layout=layout,
    )
