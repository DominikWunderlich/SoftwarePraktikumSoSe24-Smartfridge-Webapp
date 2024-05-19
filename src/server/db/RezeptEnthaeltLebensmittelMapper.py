from server.db.mapper import mapper
from server.bo.RezeptEnthaeltLebensmittel import RezeptEnthaeltLebensmittel
from server.bo.Lebensmittel import Lebensmittel

class RezeptEnthaeltLebensmittelMapper(mapper):
    def __init__(self):
        super().__init__()

    def insert(self, rezept_enthaelt_lebensmittel):
        print("ich bin in der insert Methode des RezeptEnthLebensmMapper")
        cursor = self._connector.cursor()
        cursor.execute("SELECT MAX(rezept_enthaelt_lebensmittel) AS maxid FROM datenbank.rezept_enthaelt_lebensmittel")
        tuples = cursor.fetchall()

        for (maxid,) in tuples:
            if maxid is not None:
                rezept_enthaelt_lebensmittel.set_id(int(maxid) + 1)
            else:
                rezept_enthaelt_lebensmittel.set_id(1)

        command = "INSERT INTO datenbank.rezept_enthaelt_lebensmittel (rezept_enthaelt_lebensmittel, rezept_id, lebensmittel_id) VALUES (%s, %s, %s)"
        data = (rezept_enthaelt_lebensmittel.get_id(), rezept_enthaelt_lebensmittel.get_rezept_id(), rezept_enthaelt_lebensmittel.get_lebensmittel_id())
        cursor.execute(command, data)

        self._connector.commit()
        cursor.close()
        return rezept_enthaelt_lebensmittel

    def delete(self):
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

    def find_lebensmittel_by_rezept_id(self, rezept):
        result = []
        cursor = self._connector.cursor()
        command = f"SELECT lebensmittel.lebensmittel_id, " \
                  f"lebensmittel.lebensmittel_name, " \
                  f"maßeinheit.masseinheit_name, " \
                  f"mengenanzahl.menge FROM datenbank.lebensmittel " \
                  f"JOIN rezept_enthaelt_lebensmittel ON lebensmittel.lebensmittel_id = " \
                  f"rezept_enthaelt_lebensmittel.lebensmittel_id " \
                  f"JOIN maßeinheit ON lebensmittel.masseinheit_id = maßeinheit.masseinheit_id " \
                  f"JOIN mengenanzahl on lebensmittel.mengenanzahl_id = mengenanzahl.id " \
                  f"WHERE rezept_enthaelt_lebensmittel.rezept_id = '{rezept}'"
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (lebensmittel_id, lebensmittel_name, masseinheit_name, menge) in tuples:
            l = Lebensmittel()
            l.set_id(lebensmittel_id)
            l.set_lebensmittelname(lebensmittel_name)
            l.set_masseinheit(masseinheit_name)
            l.set_mengenanzahl(menge)
            print(f" Das ist das gezogene Rezept_enthält_lebensmittel aus der DB {l.__str__()}")
            result.append(l)

        self._connector.commit()
        cursor.close()

        return result
