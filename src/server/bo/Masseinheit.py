from src.server.bo import BusinessObject as bo
class Masseinheit (bo.BusinessObject):
    """Realisierung einer exemplarischen Benutzerklasse.

    Aus Gründen der Vereinfachung besitzt der Kunden in diesem Demonstrator
    lediglich einen einfachen Namen, eine E_Mail-Adresse sowie eine außerhalb
    unseres Systems verwaltete User ID (z.B. die Google ID).
    """
    def __init__(self):
        super().__init__()
        self.masseinheitsname = ""
        self.kuerzel = ""
        self.umrechnungsfaktor = 0.0

    def get_masseinheit(self):
        """Auslesen des maßeinheit."""
        return self.masseinheitsname

    def set_masseinheit(self, masseinheitsname):
        """Setzen des maßeinheit."""
        self.masseinheitsname = masseinheitsname

    def get_kuerzel(self):
        """Auslesen des Kürzels."""
        return self.kuerzel

    def set_kuerzel(self, k):
        """Setzen des Kürzels."""
        self.kuerzel = k

    def get_umrechnungsfaktor(self):
        """Auslesen des umrechnungsfaktors."""
        return self.umrechnungsfaktor

    def set_umrechnungsfaktor(self, faktor):
        """Setzen des umrechnungsfaktors."""
        self.umrechnungsfaktor = faktor




    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return f"MaßeinheitObjekt: masseinheitsname={self.get_masseinheit()}, kuerzel={self.get_kuerzel()}," \
               f"umrechnungsfaktor={self.get_umrechnungsfaktor()}"

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in einen User()."""
        ma = Masseinheit()
        ma.set_id(dictionary["id"])
        ma.set_masseinheit(dictionary["maßeinheit"])
        ma.set_kuerzel(dictionary["kuerzel"])
        ma.set_umrechnungsfaktor(dictionary["faktor"])
        return ma