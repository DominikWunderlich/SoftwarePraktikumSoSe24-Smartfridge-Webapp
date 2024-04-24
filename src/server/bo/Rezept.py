from server.bo.BusinessObject import BusinessObject as bo
#Frage: ohne server.bo. sind 2 probleme weg??!!


class Rezept(bo):
    def __init__(self):
        super().__init__()
        self.rezept_name = ""
        self.anzahl_portionen = ""
        self.rezept_ersteller = ""

    def set_rezept_name(self, rezept_name):
        self.rezept_name = rezept_name

    def set_rezept_ersteller(self, rezept_ersteller):
        self.rezept_ersteller = rezept_ersteller

    def set_anzahl_portionen(self, anzahl_portionen):
        self.anzahl_portionen = anzahl_portionen

    def get_rezept_name(self):
        return self.rezept_name

    def get_rezept_ersteller(self):
        return self.rezept_ersteller

    def get_anzahl_portionen(self):
        return self.anzahl_portionen

    def __str__(self):
        return "Rezept: {}, {}, {}, {}".format(self.get_id(), self.rezept_name, self.anzahl_portionen,
                                               self.rezept_ersteller)

    @staticmethod
    def from_dict(dictionary=dict()):
        rz = Rezept()
        rz.set_id(dictionary["id"])
        rz.set_rezept_name(dictionary["rezeptName"])
        rz.set_anzahl_portionen(dictionary["anzahlPortionen"])
        rz.set_rezept_ersteller(dictionary["rezeptAdmin"])
        return rz

