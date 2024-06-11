from server.db.mapper import mapper
from server.bo.RezeptEnthaeltLebensmittel import RezeptEnthaeltLebensmittel
from server.bo.Lebensmittel import Lebensmittel

class RezeptEnthaeltLebensmittelMapper(mapper):
    def __init__(self):
        super().__init__()

    def insert(self, l):
        pass
        #print("ich bin in der insert Methode des RezeptEnthLebensmMapper")
        #cursor = self._connector.cursor()
        #cursor.execute("SELECT MAX(lebensmittel_id) AS maxid FROM datenbank.lebensmittel")
        #tuples = cursor.fetchall()

        #for (maxid,) in tuples:
        #    if maxid is not None:
        #        l.set_id(int(maxid) + 1)
        #    else:
        #        l.set_id(1)

        #command = "INSERT INTO datenbank.lebensmittel (lebensmittel_id, lebensmittel_name, masseinheit_id, mengenanzahl_id, kuehlschrank_id, rezept_id) VALUES (%s, %s, %s,%s,%s,%s,)"
        #data = (l.get_id(), l.get_lebensmittelname(), l.get_masseinheit_id, l.get_mengenanzahl_id,l.get_kuehlschrank_id, l.get_rezept_id())
        #cursor.execute(command, data)

        #self._connector.commit()
        #cursor.close()
        #return l

    def delete(self, l):
        pass
    def find_all(self):
        pass
    def find_by_key(self, key):
        result = []
        cursor = self._connector.cursor()
        command = "SELECT rezept_enthaelt_lebensmittel, rezept_id, lebensmittel_id FROM " \
                  "datenbank.rezept_enthaelt_lebensmittel WHERE rezept_id LIKE %s"
        data = (key)
        cursor.execute(command, data)
        tuples = cursor.fetchall()

        for (rezept_enthaelt_lebensmittel, rezept_id, lebensmittel_id) in tuples:
            r = RezeptEnthaeltLebensmittel()
            r.set_id(rezept_enthaelt_lebensmittel)
            r.set_rezept_id(rezept_id)
            r.set_lebensmittel_id(lebensmittel_id)
            print(f" Das ist das gezogene Rezept_enthält_lebensmittel aus der DB {r.__str__()}")
            result.append(r)

        self._connector.commit()

        cursor.close()

        return result
    def update(self):
        pass


