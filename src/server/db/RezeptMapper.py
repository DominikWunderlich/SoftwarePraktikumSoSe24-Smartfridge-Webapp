from server.db.mapper import mapper
from server.bo.Rezept import Rezept

class RezeptMapper(mapper):
    def __init__(self):
        super().__init__()

    def insert(self, rezept):
        cursor = self._connector.cursor()
        cursor.execute("SELECT MAX(rezept_id) AS maxid FROM datenbank.rezept")
        tuples = cursor.fetchall()

        for (maxid,) in tuples:
            if maxid is not None:
                rezept.set_id(int(maxid) + 1)
            else:
                rezept.set_id(1)

        #    for (maxid,) in tuples:
        #if maxid is not None:
        #    rezept.set_id(int(maxid) + 1)
        #else:
        #    rezept.set_id(1)

        command = "INSERT INTO datenbank.rezept (rezept_id, rezept_name, anzahl_portionen, rezept_ersteller) VALUES (%s, %s, %s, %s)"
        data = (rezept.get_id(), rezept.get_rezept_name(), rezept.get_anzahl_portionen(), rezept.get_rezept_ersteller())
        cursor.execute(command, data)

        self._connector.commit()
        cursor.close()

        return rezept

    def find_by_key(self, key):
        # Implementierung der Methode find_by_key
        pass

    def find_all(self):
        # Implementierung der Methode find_all
        pass

    def update(self, object):
        # Implementierung der Methode update
        pass

    def delete(self, key):
        # Implementierung der Methode delete
        pass