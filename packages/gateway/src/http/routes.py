"""
Rotas principais da API SparkScore (stub).
"""


def post_scores_predict(request):
    """
    Recebe payload e retorna scores preditivos.
    """
    # TODO: Implementar integração com engines
    return {"PPA": 0.0, "CTR": 0.0}


def post_sparkunits_extract(request):
    """
    Extrai SparkUnits de um criativo.
    """
    # TODO: Integrar com taxonomy
    return {"units": []}
