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

        command = "INSERT INTO datenbank.rezept (rezept_id, rezept_name, anzahl_portionen, rezept_ersteller, wg_name) VALUES (%s, %s, %s, %s, %s)"
        data = (rezept.get_id(), rezept.get_rezept_name(), rezept.get_anzahl_portionen(), rezept.get_rezept_ersteller(), rezept.get_wg_name())
        cursor.execute(command, data)

        self._connector.commit()
        cursor.close()

        return rezept

    def find_by_key(self, key):
        # Implementierung der Methode find_by_key
        pass

    def find_all(self):
        result = []
        cursor = self._connector.cursor()
        cursor.execute("SELECT rezept_id, rezept_name, anzahl_portionen, rezept_ersteller, wg_name FROM datenbank.rezept")
        tuples = cursor.fetchall()

        for (rezept_id, rezept_name, anzahl_portionen, rezept_ersteller, wg_name) in tuples:
            rezept = Rezept()
            rezept.set_id(rezept_id)
            rezept.set_rezept_name(rezept_name)
            rezept.set_anzahl_portionen(anzahl_portionen)
            rezept.set_rezept_ersteller(rezept_ersteller)
            rezept.set_wg_name(wg_name)
            result.append(rezept)

        self._connector.commit()
        cursor.close()

        return result

    def find_all_by_wg_name(self, wg_name):
        result = []
        cursor = self._connector.cursor()
        cursor.execute("SELECT rezept_id, rezept_name, anzahl_portionen, rezept_ersteller, wg_name FROM datenbank.rezept WHERE wg_name = %s", (wg_name,))
        tuples = cursor.fetchall()

        for (rezept_id, rezept_name, anzahl_portionen, rezept_ersteller, wg_name) in tuples:
            rezept = Rezept()
            rezept.set_id(rezept_id)
            rezept.set_rezept_name(rezept_name)
            rezept.set_anzahl_portionen(anzahl_portionen)
            rezept.set_rezept_ersteller(rezept_ersteller)
            rezept.set_wg_name(wg_name)
            result.append(rezept)

        self._connector.commit()
        cursor.close()

        return result

    def find_by_rezept_id(self, rezept_id):
        result = []
        cursor = self._connector.cursor()
        cursor.execute(f"SELECT rezept_id, rezept_name, anzahl_portionen, rezept_ersteller, wg_name FROM datenbank.rezept WHERE rezept_id = '{rezept_id}'")
        tuples = cursor.fetchall()

        for (rezept_id, rezept_name, anzahl_portionen, rezept_ersteller, wg_name) in tuples:
            rezept = Rezept()
            rezept.set_id(rezept_id)
            rezept.set_rezept_name(rezept_name)
            rezept.set_anzahl_portionen(anzahl_portionen)
            rezept.set_rezept_ersteller(rezept_ersteller)
            rezept.set_wg_name(wg_name)
            result.append(rezept)

        self._connector.commit()
        cursor.close()

        return result

    def update(self, object):
        # Implementierung der Methode update
        pass

    def delete(self, rezept_id):
        pass
        # cursor = self._connector.cursor()
        # cursor.execute("DELETE FROM datenbank.rezept WHERE rezept_id = ?", (rezept_id,))
        # self._connector.commit()
        # cursor.close()