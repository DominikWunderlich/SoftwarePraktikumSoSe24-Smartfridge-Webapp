# Info: Der Großteil aus diesem Code wurde aus dem "Bankprojekt" übernommen

from abc import ABC


class BusinessObject(ABC):
    def __init__(self):
        self.id = 0

    def set_id(self, new_id):
        self.id = new_id

    def get_id(self):
        return self.id


