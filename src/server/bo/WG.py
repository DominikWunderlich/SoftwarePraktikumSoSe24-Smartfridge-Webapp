from server.bo.BusinessObject import BusinessObject as bo

class WG(bo):
    def __init__(self):
        super().__init__()
        self.wg_name = ""
        self.wg_ersteller = ""


    def set_wg_name(self, wg_name):
        self.wg_name = wg_name

    def set_wg_ersteller(self, wg_ersteller):
        self.wg_ersteller = wg_ersteller

    def get_wg_name(self):
        return self.wg_name

    def get_wg_ersteller(self):
        return self.wg_ersteller

    def __str__(self):
        return "WG: {}, {}, {}".format(self.get_id(), self.wg_name, self.wg_ersteller)

    @staticmethod
    def from_dict(dictionary=dict()):
        wg = WG()
        wg.set_id(dictionary['id'])
        wg.set_wg_name(dictionary['wgName'])
        wg.set_wg_ersteller(dictionary['wgAdmin'])
        return wg