from server.bo.BusinessObject import BusinessObject as bo


class Kuehlschrank(bo):
    def __init__(self):
        super().__init__()
        self.wg_id = None

    def get_wg_id(self):
        return self.wg_id
    
    def set_wg_id(self, wg_id):
        self.wg_id = wg_id

    def __str__(self):
        return "Kuehlschrank: {}, {}".format(self.get_id(), self.get_wg_id())
    
    @staticmethod
    def from_dict(dictonary=dict()):
        ks = Kuehlschrank()
        ks.set_id(dictonary["id"])
        ks.set_wg_id(dictonary["wg_id"])
        return ks