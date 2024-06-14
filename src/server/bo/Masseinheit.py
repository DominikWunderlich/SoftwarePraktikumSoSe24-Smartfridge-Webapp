from server.bo.BusinessObject import BusinessObject as bo


class Masseinheit(bo):
    def __init__(self):
        super().__init__()
        self.masseinheitsname = ""
        self.umrechnungsfaktor = 0.0

    def get_masseinheit(self):
        """Auslesen des maßeinheit."""
        return self.masseinheitsname

    def set_masseinheit(self, masseinheitsname):
        """Setzen des maßeinheit."""
        self.masseinheitsname = masseinheitsname

    def get_umrechnungsfaktor(self):
        """Auslesen des umrechnungsfaktors."""
        return self.umrechnungsfaktor

    def set_umrechnungsfaktor(self, faktor):
        """Setzen des umrechnungsfaktors."""
        self.umrechnungsfaktor = faktor

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return f"MaßeinheitObjekt: masseinheitsname={self.get_masseinheit()}, umrechnungsfaktor={self.get_umrechnungsfaktor()}"

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in einen User()."""
        ma = Masseinheit()
        ma.set_id(dictionary["id"])
        ma.set_masseinheit(dictionary["masseinheitsname"])
        #ma.set_umrechnungsfaktor(dictionary["umrechnungsfaktor"])
        return ma

   
    def update_measurement_name(self, new_name, success):
        """
        Diese Methode aktualisiert den Namen der Maßeinheit.
        """
        if success:
            self.set_masseinheit(new_name)
            return f"Masseinheit '{self.masseinheitsname}' erfolgreich in '{new_name}' aktualisiert.", 200
        else:
            return f"Aktualisierung des Maßeinheitsnamens '{self.masseinheitsname}' fehlgeschlagen.", 500