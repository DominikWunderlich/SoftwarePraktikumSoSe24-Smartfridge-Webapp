from server.bo.mengenanzahl import Mengenanzahl
from server.db.mapper import mapper

class MengenanzahlMapper(mapper):

    def insert(self, obj):
        cursor = self._connector.cursor()

        cursor.execute(f'SELECT MAX(id) AS maxid FROM datenbank.mengenanzahl')
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:

                obj.set_id(maxid[0] + 1)

            else:
                obj.set_id(1)

        command = "INSERT INTO datenbank.mengenanzahl (id, menge) VALUES (%s, %s)"
        data = (obj.get_id(), obj.get_menge())
        cursor.execute(command, data)

        self._connector.commit()
        cursor.close()

    def find_all(self):
        pass

    def find_by_key(self, key):
        pass

    def update(self, object):
        pass

    def delete(self, object):
        pass
