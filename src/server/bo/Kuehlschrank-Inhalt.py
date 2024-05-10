from server.bo.BusinessObject import BusinessObject as bo
from server.bo.Lebensmittel import Lebensmittel

class Kuehlschrank_Inhalt(bo):
    def __init__(self):
        super().__init__()
        self.lebensmittel_id = None

    def get_lebensmittel_id(self):
        return self.lebensmittel_id
        
    def set_lebensmittel_id(self, lebensmittel_id):
        self.lebensmittel_id = lebensmittel_id

    def __str__(self):
        return "Kuehlschrank_Inhalt: {}, {}".format(self.get_id(), self.get_lebensmittel_id())
        
    @staticmethod
    def from_dict(dictonary=dict()):
        ks = Kuehlschrank_Inhalt()
        ks.set_id(dictonary["id"])
        ks.set_lebensmittel_id(dictonary["lebensmittel_id"])
        return ks