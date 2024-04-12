from abc import ABC


class BusinessObject(ABC):
    def __init__(self):
        self._id = 0

    def set_id(self, new_id):
        self._id = new_id

    def get_id(self):
        return self._id


