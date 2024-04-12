from BusinessObject import BusinessObject as bo


class Kuehlschrank(bo):
    def __init__(self):
        super().__init__()

    def __str__(self):
        return "Kuehlschrank: {}".format(self.get_id())

    @staticmethod
    def from_dict(dictionary=dict()):
        ks = Kuehlschrank()
        ks.set_id(dictionary['id'])
