from server.bo.BusinessObject import BusinessObject as bo


class Mengenanzahl(bo):
    def __init__(self):
        super().__init__()
        self.menge = 0.0

    def set_menge(self, m):
        self.menge = m

    def get_menge(self):
        return self.menge

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return f"MengenanzahlObjekt: menge={self.get_menge()}"


    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict()."""
        m = Mengenanzahl()
        m.set_id(dictionary["id"])
        m.set_menge(dictionary["menge"])
        return m