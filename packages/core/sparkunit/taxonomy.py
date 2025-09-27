"""
Taxonomia-base das SparkUnits (unidades mínimas de significação).
"""


class SparkUnit:
    def __init__(
        self,
        trace,
        modality=None,
        actant=None,
        polarity=None,
        channel=None,
        salience=1.0,
        position=None,
    ):
        self.trace = trace
        self.modality = modality
        self.actant = actant
        self.polarity = polarity
        self.channel = channel
        self.salience = salience
        self.position = position

    def __repr__(self):
        return f"<SparkUnit trace={self.trace} salience={self.salience}>"


# Exemplo de uso
# su = SparkUnit(trace="urgência", modality="dever", channel="texto", salience=0.9)
