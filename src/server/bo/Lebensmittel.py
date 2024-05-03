from server.bo.BusinessObject import BusinessObject as bo


class Lebensmittel(bo):
    def __init__(self):
        super().__init__()
        self.lebensmittelname = ""
        self.masseinheit = 0
        self.mengenanzahl = 0

    def get_lebensmittelname(self):
        """Auslesen des Lebensmittelnamens."""
        return self.lebensmittelname

    def set_lebensmittelname(self, name):
        """Setzen des Lebensmittelnamens."""
        self.lebensmittelname = name

    def get_masseinheit(self):
        """Auslesen des maßeinheit."""
        return self.masseinheit

    def set_masseinheit(self, m):
        """Setzen des maßeinheit."""
        self.masseinheit = m

    def set_mengenanzahl(self, m):
        self.mengenanzahl = m

    def get_mengenanzahl(self):
        return self.mengenanzahl

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return f"LebensmittelObjekt: Name={self.get_lebensmittelname()}, " \
               f"Maßeinheit={self.get_masseinheit()}, Anzahl={self.get_mengenanzahl()}"

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Lebensmittel-Objekt."""
        lm = Lebensmittel()
        lm.set_id(dictionary["id"])
        lm.set_lebensmittelname(dictionary["lebensmittelName"])
        lm.set_masseinheit(dictionary["masseinheit"])
        lm.set_mengenanzahl(dictionary["mengenanzahl"])
        return lm