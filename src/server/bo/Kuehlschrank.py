from server.bo.BusinessObject import BusinessObject as bo


class Kuehlschrank(bo):
    def __init__(self):
        super().__init__()
        self.lebensmittel_liste = []

    def get_lebensmittel_liste(self):
        return self.lebensmittel_liste
    
    def set_lebensmittel_liste(self, lebensmittel_liste):
        self.lebensmittel_liste = lebensmittel_liste

    def __str__(self):
        return "Kuehlschrank: {}".format(self.get_id())

    @staticmethod
    def from_dict(dictionary=dict()):
        ks = Kuehlschrank()
        ks.set_id(dictionary['id'])
        ks.set_lebensmittel_liste(dictionary.get('lebensmittel_liste', []))
        return ks

