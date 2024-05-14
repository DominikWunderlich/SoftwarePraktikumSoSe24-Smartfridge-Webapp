from server.bo.BusinessObject import BusinessObject as bo


class RezeptEnthaeltLebensmittel(bo):
    def __init__(self):
        super().__init__()
        self.rezept_id = 0
        self.lebensmittel_id = 0

    def set_rezept_id(self, rezept_id):
        self.rezept_id = rezept_id

    def set_lebensmittel_id(self, lebensmittel_id):
        self.lebensmittel_id = lebensmittel_id

    def get_rezept_id(self):
        return self.rezept_id

    def get_lebensmittel_id(self):
        return self.lebensmittel_id

    def __str__(self):
        return "RezeptEnthaeltLebensmittel: {}, {}, {}".format(self.get_id(), self.rezept_id, self.lebensmittel_id)

    @staticmethod
    def from_dict(dictionary=dict()):
        rz = RezeptEnthaeltLebensmittel()
        rz.set_id(dictionary["id"])
        rz.set_rezept_id(dictionary["rezept_id"])
        rz.set_lebensmittel_id(dictionary["lebensmittel_id"])
        return rz

