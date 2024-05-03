from server.bo.BusinessObject import BusinessObject as bo
from server.bo.Lebensmittel import Lebensmittel


class Kuehlschrank(bo):
    def __init__(self):
        super().__init__()
        self.lebensmittel_dict = {}

    def get_lebensmittel(self, lebensmittel_id):
        """Gibt ein Lebensmittel anhand seiner ID aus dem Kühlschrank zürck"""
        return self.lebensmittel_dict[lebensmittel_id]
    
    def get_lebensmittelliste_by_name(self):
        """Gibt eine Liste der Namen der Lebensmittel im Kühlschrank zurück."""
        return [lebensmittel.get_lebensmittlename() for lebensmittel in self.lebensmittel_dict.values()]

    def __str__(self):
        """Gibt eine textuelle Darstellung des Kühlschranks zurück."""
        lebensmittel_str = ", ".join(self.get_lebensmittelliste_by_name())
        return f"Kuehlschrank: {self.get_id()}, Lebensmittel: {lebensmittel_str}"

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Kuehlschrank-Objekt."""
        ks = Kuehlschrank()
        ks.set_id(dictionary['id'])
        lebensmittel_liste = dictionary.get('lebensmittel_liste', [])
        for lebensmittel_dict in lebensmittel_liste:
            lebensmittel = Lebensmittel.from_dict(lebensmittel_dict)
            ks.add_lebensmittel(lebensmittel)
        return ks

