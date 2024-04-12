from server.bo import BusinessObject as bo
class Maßeinheit (bo.BusinessObject):
    """Realisierung einer exemplarischen Benutzerklasse.

    Aus Gründen der Vereinfachung besitzt der Kunden in diesem Demonstrator
    lediglich einen einfachen Namen, eine E_Mail-Adresse sowie eine außerhalb
    unseres Systems verwaltete User ID (z.B. die Google ID).
    """
    def __init__(self):
        super().__init__()
        self.maßeinheitsname= ""
        self.menge = ""
        self.id = ""


    def get_maßeinheit(self):
        """Auslesen des maßeinheit."""
        return self.maßeinheit

    def set_maßeinheit(neweinheit: id):
        """Setzen des maßeinheit."""
        self.maßeinheit = id

    def get_menge(self):
        """Auslesen des menge."""
        return self.menge

    def set_menge(neweinheit, value):
        """Setzen des menge."""
        self.menge = value

    def create_maßeinheit(self):
        """Erstellen einer neuen Maßeinheit."""
        pass

    def remove_maßeinheit(self):
        """Entfernen einer Maßeinheit."""
        pass

    def update_maßeinheit(self):
        """Aktualisieren einer Maßeinheit."""
        pass


    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "User: {}, {}, {}".format(self._id, self.maßeinheit, self.menge)

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in einen User()."""
        ma = maßeinheit()
        ma.set_id(dictionary["id"])
        ma.set_name(dictionary["maßeinheit"])
        ma.set_email(dictionary["menge"])
        return obj
