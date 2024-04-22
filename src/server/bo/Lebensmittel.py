from BusinessObject import BusinessObject as bo


class Lebensmittel(bo):
    def __init__(self):
        super().__init__()
        self.lebensmittelname = ""
        self.aggregatszustand = ""

    def get_lebensmittlename(self):
        """Auslesen des Lebensmittelnamens."""
        return self.lebensmittelname

    def set_lebensmittlename(self, name):
        """Setzen des Lebensmittelnamens."""
        self.lebensmittelname = name

    def get_aggregatszustand(self):
        """Auslesen des Aggregatszustands."""
        return self.aggregatszustand

    def set_aggregatszustand(self, zustand):
        """Setzen des Aggregatszustands."""
        self.aggregatszustand = zustand

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "Lebensmittel: {}, {}, {}".format(self.get_id(), self.get_lebensmittlename(), self.get_aggregatszustand())

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Lebensmittel-Objekt."""
        lm = Lebensmittel()
        lm.set_id(dictionary["id"])
        lm.set_lebensmittlename(dictionary["lebensmittelname"])
        lm.set_aggregatszustand(dictionary["aggregatszustand"])
        return lm
