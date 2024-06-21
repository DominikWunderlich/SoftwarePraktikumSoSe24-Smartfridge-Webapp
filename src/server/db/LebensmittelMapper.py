from server.db.mapper import mapper
from server.bo.Lebensmittel import Lebensmittel


class LebensmittelMapper(mapper):

    def __init__(self):
        super().__init__()

    def find_all(self):
        result = []
        cursor = self._connector.cursor()
        cursor.execute("SELECT * from datenbank.lebensmittel")
        tuples = cursor.fetchall()

        for (id, lebensmittelname, masseinheit_id, mengenanzahl_id, kuehlschrank_id, rezept_id) in tuples:
            lebensmittel = Lebensmittel()
            lebensmittel.set_id(id)
            lebensmittel.set_lebensmittelname(lebensmittelname)
            lebensmittel.set_masseinheit(masseinheit_id)
            lebensmittel.set_mengenanzahl(mengenanzahl_id)
            lebensmittel.set_kuelschrank_id(kuehlschrank_id)
            lebensmittel.set_rezept_id(rezept_id)
            result.append(lebensmittel)

        self._connector.commit()
        cursor.close()

        return result

    def find_by_id(self, lid):
        cursor = self._connector.cursor()
        command = f"SELECT lebensmittel_id, lebensmittel_name, masseinheit_id, mengenanzahl_id, kuehlschrank_id, rezept_id " \
                  "FROM datenbank.lebensmittel " \
                  "WHERE lebensmittel_id =%s"
        cursor.execute(command, (lid, ))
        obj = cursor.fetchall()

        for (lebensmittel_id, lebensmittel_name, masseinheit_id, mengenanzahl_id, kuehlschrank_id, rezept_id) in obj:
            l = Lebensmittel()
            l.set_id(lebensmittel_id)
            l.set_lebensmittelname(lebensmittel_name)
            l.set_masseinheit(masseinheit_id)
            l.set_mengenanzahl(mengenanzahl_id)
            l.set_kuelschrank_id(kuehlschrank_id)
            l.set_rezept_id(rezept_id)

        return l


    def find_by_lebensmittelname(self, lebensmittelname, kid):
        result = []
        cursor = self._connector.cursor()
        command = "SELECT lebensmittel_id, lebensmittel_name, masseinheit_id, mengenanzahl_id, kuehlschrank_id, rezept_id " \
                  "FROM datenbank.lebensmittel " \
                  "WHERE lebensmittel_name LIKE %s" \
                  "AND kuehlschrank_id = %s"
        cursor.execute(command, (lebensmittelname, kid))
        tuples = cursor.fetchall()

        for (lebensmittel_id, lebensmittel_name, masseinheit_id, mengenanzahl_id, kuehlschrank_id, rezept_id) in tuples:
            lebensmittel = Lebensmittel()
            lebensmittel.set_id(lebensmittel_id)
            lebensmittel.set_lebensmittelname(lebensmittel_name)
            lebensmittel.set_masseinheit(masseinheit_id)
            lebensmittel.set_mengenanzahl(mengenanzahl_id)
            lebensmittel.set_kuelschrank_id(kuehlschrank_id)
            lebensmittel.set_rezept_id(rezept_id)
            result.append(lebensmittel)

        self._connector.commit()
        cursor.close()

        return result

    def find_by_lebensmittelname2(self, lebensmittelname, rid):
        result = []
        cursor = self._connector.cursor()
        command = "SELECT lebensmittel_id, lebensmittel_name, masseinheit_id, mengenanzahl_id, kuehlschrank_id, rezept_id " \
                  "FROM datenbank.lebensmittel " \
                  "WHERE lebensmittel_name LIKE %s" \
                  "AND rezept_id = %s"
        cursor.execute(command, (lebensmittelname, rid))
        tuples = cursor.fetchall()

        for (lebensmittel_id, lebensmittel_name, masseinheit_id, mengenanzahl_id, kuehlschrank_id, rezept_id) in tuples:
            lebensmittel = Lebensmittel()
            lebensmittel.set_id(lebensmittel_id)
            lebensmittel.set_lebensmittelname(lebensmittel_name)
            lebensmittel.set_masseinheit(masseinheit_id)
            lebensmittel.set_mengenanzahl(mengenanzahl_id)
            lebensmittel.set_kuelschrank_id(kuehlschrank_id)
            lebensmittel.set_rezept_id(rezept_id)
            result.append(lebensmittel)

        self._connector.commit()
        cursor.close()

        return result

    def insert(self, l):
        cursor = self._connector.cursor()

        # Zuerst überprüfen wir, ob ein Lebensmittel bereits angelegt wurde:
        command_check = "SELECT lebensmittel_id FROM datenbank.lebensmittel WHERE lebensmittel_name = %s AND " \
                        "masseinheit_id = %s AND mengenanzahl_id = %s AND (kuehlschrank_id=%s OR kuehlschrank_id is NULL) \
                        AND (rezept_id=%s OR rezept_id is NULL)"
        data_check = (l.get_lebensmittelname(), l.get_masseinheit(), l.get_mengenanzahl(), l.get_kuehlschrank_id(),
                      l.get_rezept_id())
        cursor.execute(command_check, data_check)
        existing_id = cursor.fetchone()

        # Wenn das Lebensmittel bereits existiert, geben wir ein False zurück.
        if existing_id:
            l.set_id(existing_id[0])
            cursor.close()
            return l

        cursor.execute("SELECT MAX(lebensmittel_id) AS maxid FROM datenbank.lebensmittel")
        tuples = cursor.fetchall()

        for (maxid,) in tuples:
            if maxid is not None:
                l.set_id(maxid + 1)
            else:
                l.set_id(1)

        command = "INSERT INTO lebensmittel (lebensmittel_id, lebensmittel_name, masseinheit_id, mengenanzahl_id, kuehlschrank_id, rezept_id) VALUES (%s, %s, %s, %s, %s, %s)"
        data = (l.get_id(), l.get_lebensmittelname(), l.get_masseinheit(), l.get_mengenanzahl(), l.get_kuehlschrank_id(), l.get_rezept_id())
        cursor.execute(command, data)

        self._connector.commit()
        cursor.close()
        print(f"im Lebensmittelmapper: lebensmittel_id des hinzugefügten Objekts: {l.get_id()}")
        return l

    def update(self, lebensmittel):
        cursor = self._connector.cursor()

        command = "UPDATE datenbank.lebensmittel SET lebensmittel_name=%s, masseinheit_id=%s, mengenanzahl_id=%s," \
                  "kuehlschrank_id=%s, rezept_id=%s  WHERE lebensmittel_name=%s AND kuehlschrank_id=%s"
        data = (lebensmittel.get_lebensmittelname(), lebensmittel.get_masseinheit(), lebensmittel.get_mengenanzahl(),
                lebensmittel.get_kuehlschrank_id(), lebensmittel.get_rezept_id(), lebensmittel.get_lebensmittelname(),
                lebensmittel.get_kuehlschrank_id())
        cursor.execute(command, data)

        self._connector.commit()
        cursor.close()


    def update_menge(self, lebensmittel, neue_menge):
        print("jetzt bin ich in der update_menge Methode")
        print(lebensmittel)
        lebensmittel_id = lebensmittel.get_id()
        print(lebensmittel_id) #das ist die lebensmittel_id deren Datensatz aktualisiert werden soll
        print("juhu")
        print(neue_menge) #Das ist die mengen_id von der neuen menge
        cursor = self._connector.cursor()
        print("bin ich im try?")
        command = f"UPDATE datenbank.lebensmittel SET mengenanzahl_id=%s WHERE lebensmittel_id=%s"
        data = (neue_menge, lebensmittel_id)
        cursor.execute(command, data)
        self._connector.commit()
        print(f"Menge in Lebensmittel mit ID {lebensmittel.get_id()} aktualisiert.")
        cursor.close()
        return

    def update3(self, lebensmittel):
        cursor = self._connector.cursor()

        command = "UPDATE datenbank.lebensmittel SET lebensmittel_name=%s, masseinheit_id=%s, mengenanzahl_id=%s," \
                  "kuehlschrank_id=%s, rezept_id=%s  WHERE lebensmittel_name=%s AND rezept_id=%s"
        data = (
            lebensmittel.get_lebensmittelname(), lebensmittel.get_masseinheit(), lebensmittel.get_mengenanzahl(),
            lebensmittel.get_kuehlschrank_id(), lebensmittel.get_rezept_id(), lebensmittel.get_lebensmittelname(),
            lebensmittel.get_rezept_id())
        cursor.execute(command, data)

        self._connector.commit()
        cursor.close()

    def update_foodobj(self, lebensmittel, old_name):
        cursor = self._connector.cursor()
        command = "UPDATE datenbank.lebensmittel SET lebensmittel_name=%s, masseinheit_id=%s, mengenanzahl_id=%s," \
                  "kuehlschrank_id=%s, rezept_id=%s  WHERE lebensmittel_name=%s AND kuehlschrank_id=%s"
        data = (
        lebensmittel.get_lebensmittelname(), lebensmittel.get_masseinheit(), lebensmittel.get_mengenanzahl(),
        lebensmittel.get_kuehlschrank_id(), lebensmittel.get_rezept_id(), old_name,
        lebensmittel.get_kuehlschrank_id())
        cursor.execute(command, data)

        self._connector.commit()
        cursor.close()

    def update_foodobj_rezept(self, lebensmittel, old_name):
        cursor = self._connector.cursor()
        command = "UPDATE datenbank.lebensmittel SET lebensmittel_name=%s, masseinheit_id=%s, mengenanzahl_id=%s," \
                  "kuehlschrank_id=%s, rezept_id=%s  WHERE lebensmittel_name=%s AND rezept_id=%s"
        data = (
        lebensmittel.get_lebensmittelname(), lebensmittel.get_masseinheit(), lebensmittel.get_mengenanzahl(),
        lebensmittel.get_kuehlschrank_id(), lebensmittel.get_rezept_id(), old_name,
        lebensmittel.get_rezept_id())
        cursor.execute(command, data)

        self._connector.commit()
        cursor.close()
    def delete(self, lId, kId):
        cursor = self._connector.cursor()

        command = "DELETE FROM datenbank.lebensmittel WHERE lebensmittel_id=%s AND kuehlschrank_id=%s"
        data = (lId, kId)
        cursor.execute(command, data)

        self._connector.commit()
        cursor.close()

    def find_by_key(self, key):
        result = []
        cursor = self._connector.cursor()
        command = f"SELECT lebensmittel.lebensmittel_id, " \
                  f"lebensmittel.lebensmittel_name, " \
                  f"masseinheit.masseinheit_name, " \
                  f"mengenanzahl.menge, " \
                  f"lebensmittel.kuehlschrank_id, " \
                  f"lebensmittel.rezept_id FROM datenbank.lebensmittel " \
                  f"JOIN masseinheit ON lebensmittel.masseinheit_id = masseinheit.masseinheit_id " \
                  f"JOIN mengenanzahl on lebensmittel.mengenanzahl_id = mengenanzahl.id " \
                  f"WHERE rezept_id = '{key}'"
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (lebensmittel_id, lebensmittel_name, masseinheit_name, menge, kid, rid) in tuples:
            l = Lebensmittel()
            l.set_id(lebensmittel_id)
            l.set_lebensmittelname(lebensmittel_name)
            l.set_masseinheit(masseinheit_name)
            l.set_mengenanzahl(menge)
            l.set_kuelschrank_id(kid)
            l.set_rezept_id(rid)
            result.append(l)

        self._connector.commit()
        cursor.close()

        return result

    def find_id_by_name_mengen_id_and_masseinheit_id(self, lebensmittel_name, masseinheit_id, mengenanzahl_id):
        cursor = self._connector.cursor()
        command = "SELECT lebensmittel_id FROM datenbank.lebensmittel WHERE lebensmittel_name = %s AND masseinheit_id = %s AND mengenanzahl_id = %s"
        data = (lebensmittel_name, masseinheit_id, mengenanzahl_id)
        cursor.execute(command, data)
        result = cursor.fetchone()
        cursor.close()
        if result:
            return result[0]
        else:
            return None

    def find_lebensmittel_by_kuehlschrank_id(self, kuehlschrank_id):
        result = []
        cursor = self._connector.cursor()
        command = f"SELECT lebensmittel.lebensmittel_id, " \
                  f"lebensmittel.lebensmittel_name, " \
                  f"masseinheit.masseinheit_name, " \
                  f"mengenanzahl.menge, " \
                  f"lebensmittel.kuehlschrank_id, " \
                  f"lebensmittel.rezept_id FROM datenbank.lebensmittel " \
                  f"JOIN masseinheit ON lebensmittel.masseinheit_id = masseinheit.masseinheit_id " \
                  f"JOIN mengenanzahl on lebensmittel.mengenanzahl_id = mengenanzahl.id " \
                  f"WHERE kuehlschrank_id = '{kuehlschrank_id}'"
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (lebensmittel_id, lebensmittel_name, masseinheit_name, menge, kid, rid) in tuples:
            l = Lebensmittel()
            l.set_id(lebensmittel_id)
            l.set_lebensmittelname(lebensmittel_name)
            l.set_masseinheit(masseinheit_name)
            l.set_mengenanzahl(menge)
            l.set_kuelschrank_id(kid)
            l.set_rezept_id(rid)
            result.append(l)

        self._connector.commit()
        cursor.close()

        return result


if (__name__ == "__main__"):
    with LebensmittelMapper() as mapper:
        result = mapper.find_all()
        for lebensmittel in result:
            print(lebensmittel)