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

    def find_by_lebensmittelname(self, lebensmittelname):
        result = []
        cursor = self._connector.cursor()
        command = "SELECT lebensmittel_id, lebensmittel_name, masseinheit_id, mengenanzahl_id, kuehlschrank_id, rezept_id FROM datenbank.lebensmittel WHERE lebensmittel_name LIKE %s"
        cursor.execute(command, (lebensmittelname,))
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

        command = "UPDATE datenbank.lebensmittel SET lebensmittelname=%s=%s WHERE id=%s"
        data = (lebensmittel.get_lebensmittlename(), lebensmittel.get_id())
        cursor.execute(command, data)

        self._connector.commit()
        cursor.close()

    def delete(self, lebensmittel):
        cursor = self._connector.cursor()

        command = "DELETE FROM datenbank.lebensmittel WHERE id=%s"
        data = (lebensmittel.get_id(),)
        cursor.execute(command, data)

        self._connector.commit()
        cursor.close()

    def find_by_key(self, key):
        pass

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


if (__name__ == "__main__"):
    with LebensmittelMapper() as mapper:
        result = mapper.find_all()
        for lebensmittel in result:
            print(lebensmittel)