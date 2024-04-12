from BusinessObject import BusinessObject as bo

class rezept(bo):
    def __init__(self):
        super().__init__()
        self.rezeptname = None
        self.owner = None
        self.personenanzahl = None


    def set_rezeptname(self, rezeptname):
        self.rezeptname = rezeptname

    def set_owner(self, owner):
        self.owner = owner

    def set_personenanzahl(self, personenanzahl):
        self.personenanzahl = personenanzahl

    def get_rezeptname(self):
        return self.rezeptname

    def get_owner(self):
        return self.owner

    def get_personenanzahl(self):
        return self.personenanzahl

    def __str__(self):
        return "WG: {}, {}, {}, {}".format(self.get_id(), self.rezeptname, self.owner, self.personenanzahl)

    @staticmethod
    def from_dict(dictionary=dict()):
        rz = rezept()
        rz.set_id(dictionary['id'])
        rz.set_rezeptname(dictionary['wg_name'])
        rz.set_owner(dictionary['wg_bewohner'])
        rz.set_personenanzahl(dictionary['wg_ersteller'])