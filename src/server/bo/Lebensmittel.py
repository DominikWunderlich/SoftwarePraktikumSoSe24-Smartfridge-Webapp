from server.bo.BusinessObject import BusinessObject as bo


class Lebensmittel(bo):
    def __init__(self):
        super().__init__()
        self.lebensmittel_name = ""
        self.aggregatzustand = ""

    def get_lebensmittel_name(self):
        """Auslesen des Lebensmittelnamens."""
        return self.lebensmittel_name

    def set_lebensmittel_name(self, name):
        """Setzen des Lebensmittelnamens."""
        self.lebensmittel_name = name

    def get_aggregatzustand(self):
        """Auslesen des Aggregatszustands."""
        return self.aggregatzustand

    def set_aggregatzustand(self, zustand):
        """Setzen des Aggregatzustands."""
        self.aggregatzustand = zustand

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "Lebensmittel: {}, {}, {}".format(self.get_id(), self.lebensmittel_name, self.aggregatzustand)

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Lebensmittel-Objekt."""
        lm = Lebensmittel()
        lm.set_id(dictionary["id"])
        lm.set_lebensmittel_name(dictionary["lebensmittel_name"])
        lm.set_aggregatzustand(dictionary["aggregatzustand"])
        return lm
