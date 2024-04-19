from server.bo import BusinessObject as bo
class Masseinheit (bo.BusinessObject):
    """Realisierung einer exemplarischen Benutzerklasse.

    Aus Gründen der Vereinfachung besitzt der Kunden in diesem Demonstrator
    lediglich einen einfachen Namen, eine E_Mail-Adresse sowie eine außerhalb
    unseres Systems verwaltete User ID (z.B. die Google ID).
    """
    def __init__(self):
        super().__init__()
        self.masseinheitsname = ""
        self.menge = ""

    def get_masseinheit(self):
        """Auslesen des maßeinheit."""
        return self.masseinheitsname

    def set_masseinheit(self, masseinheitsname):
        """Setzen des maßeinheit."""
        self.masseinheitsname = masseinheitsname

    def get_menge(self):
        """Auslesen des menge."""
        return self.menge

    def set_menge(self, menge):
        """Setzen des menge."""
        self.menge = menge




    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "User: {}, {}, {}".format(self.get_id(), self.masseinheitsname, self.menge)

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in einen User()."""
        ma = Masseinheit()
        ma.set_id(dictionary["id"])
        ma.set_masseinheit(dictionary["maßeinheit"])
        ma.set_menge(dictionary["menge"])
        return ma
