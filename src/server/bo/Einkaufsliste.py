from server.bo.BusinessObject import BusinessObject as bo


class Einkaufsliste(bo):
    def __init__(self):
        super().__init__()
        self.bezeichnung = ""

    def get_bezeichnung(self):
        """Auslesen des Artikelnamens."""
        return self.bezeichnung

    def set_benutzername(self, value):
        """Setzen des Artikelnamens."""
        self.bezeichnung = value


    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return f"Artikel: {self.bezeichnung}"

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in einen User()."""
        pe = Einkaufsliste()
        pe.set_id(dictionary["id"])
        pe.set_benutzername(dictionary["bezeichnung"])
        return pe
