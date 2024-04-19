from server.bo import BusinessObject as bo
class Lebensmittel (bo.BusinessObject):
    """Realisierung einer exemplarischen Benutzerklasse.

    Aus Gründen der Vereinfachung besitzt der Kunden in diesem Demonstrator
    lediglich einen einfachen Namen, eine E_Mail-Adresse sowie eine außerhalb
    unseres Systems verwaltete User ID (z.B. die Google ID).
    """
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

    def add_lebensmittel(self):
        """Hinzufügen eines Lebensmittels."""
        pass

    def remove_lebensmittel(self):
        """Entfernen eines Lebensmittels."""
        pass

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "Lebensmittel: {}, {}, {}".format(self.get_id(), self.lebensmittelname, self.aggregatszustand)

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Lebensmittel-Objekt."""
        lm = Lebensmittel()
        lm.set_id(dictionary["id"])
        lm.set_lebensmittlename(dictionary["lebensmittelname"])
        lm.set_aggregatszustand(dictionary["aggregatszustand"])
        return lm
