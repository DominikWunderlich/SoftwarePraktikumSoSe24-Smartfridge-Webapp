from server.db.mapper import mapper
from server.bo.Rezept import Rezept
from server.bo.Lebensmittel import Lebensmittel

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

        command = "INSERT INTO datenbank.rezept (rezept_id, rezept_name, anzahl_portionen, rezept_ersteller, wg_name, rezept_anleitung) VALUES (%s, %s, %s, %s, %s, %s)"
        data = (rezept.get_id(), rezept.get_rezept_name(), rezept.get_anzahl_portionen(), rezept.get_rezept_ersteller(), rezept.get_wg_name(), rezept.get_rezept_anleitung())
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
        cursor.execute("SELECT rezept_id, rezept_name, anzahl_portionen, rezept_ersteller, wg_name, rezept_anleitung FROM datenbank.rezept WHERE wg_name = %s", (wg_name,))
        tuples = cursor.fetchall()

        for (rezept_id, rezept_name, anzahl_portionen, rezept_ersteller, wg_name, rezept_anleitung) in tuples:
            rezept = Rezept()
            rezept.set_id(rezept_id)
            rezept.set_rezept_name(rezept_name)
            rezept.set_anzahl_portionen(anzahl_portionen)
            rezept.set_rezept_ersteller(rezept_ersteller)
            rezept.set_wg_name(wg_name)
            rezept.set_rezept_anleitung(rezept_anleitung)
            result.append(rezept)

        self._connector.commit()
        cursor.close()

        return result

    def find_by_rezept_id(self, rezept_id):
        result = []
        cursor = self._connector.cursor()
        cursor.execute(f"SELECT rezept_id, rezept_name, anzahl_portionen, rezept_ersteller, wg_name, rezept_anleitung FROM datenbank.rezept WHERE rezept_id = '{rezept_id}'")
        tuples = cursor.fetchall()

        for (rezept_id, rezept_name, anzahl_portionen, rezept_ersteller, wg_name, rezept_anleitung) in tuples:
            rezept = Rezept()
            rezept.set_id(rezept_id)
            rezept.set_rezept_name(rezept_name)
            rezept.set_anzahl_portionen(anzahl_portionen)
            rezept.set_rezept_ersteller(rezept_ersteller)
            rezept.set_wg_name(wg_name)
            rezept.set_rezept_anleitung(rezept_anleitung)
            result.append(rezept)

        self._connector.commit()
        cursor.close()

        return result

    def update(self, obj):
        cursor = self._connector.cursor()

        command = f"UPDATE datenbank.rezept SET rezept_name=%s, anzahl_portionen=%s, rezept_ersteller=%s," \
                  f"rezept_id=%s, wg_name=%s, rezept_anleitung=%s WHERE rezept_id=%s"
        data = (obj.get_rezept_name(), obj.get_anzahl_portionen(), obj.get_rezept_ersteller(),
                obj.get_id(), obj.get_wg_name(), obj.get_rezept_anleitung(), obj.get_id())
        cursor.execute(command, data)
        self._connector.commit()
        cursor.close()

    def update_anzahl_portionen(self, rezept_id, new_portionen):
        cursor = self._connector.cursor()
        command = f"UPDATE datenbank.rezept SET anzahl_portionen='{new_portionen}' WHERE rezept_id='{rezept_id}'"
        cursor.execute(command)
        self._connector.commit()
        cursor.close()

    def delete(self, rezept_id):
        cursor = self._connector.cursor()

        command = f"DELETE FROM datenbank.lebensmittel WHERE rezept_id='{rezept_id}'"
        command1 = f"DELETE FROM datenbank.rezept WHERE rezept_id='{rezept_id}'"
        cursor.execute(command)
        cursor.execute(command1)

        self._connector.commit()
        cursor.close()

    def find_id_by_wg_name(self, wg_name):
        result = []
        cursor = self._connector.cursor()
        command = f"SELECT rezept_id FROM datenbank.rezept WHERE wg_name='{wg_name}'"
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (rezept_id) in tuples:
            rezept = Rezept()
            rezept.set_id(rezept_id)
            result.append(rezept)

        self._connector.commit()
        cursor.close()

        return result


    def find_rezept_admin_by_email(self, email, rezept_id):
        result = []
        cursor = self._connector.cursor()
        command = f"SELECT rezept_name, anzahl_portionen, rezept_ersteller, rezept_id, wg_name FROM datenbank.rezept WHERE rezept_ersteller LIKE '%{email}%' AND rezept_id = '{rezept_id}'"
        cursor.execute(command)


        tuples = cursor.fetchall()

        for (rezept_name, anzahl_portionen, rezept_ersteller, rezept_id, wg_name) in tuples:
            rz = Rezept()
            rz.set_rezept_name(rezept_name)
            rz.set_anzahl_portionen(anzahl_portionen)
            rz.set_id(rezept_id)
            rz.set_rezept_ersteller(rezept_ersteller)
            result.append(rz)

        self._connector.commit()
        cursor.close()
        print(result)
        return result


    def find_by_rezept_id2(self, rezept_id):
        cursor = self._connector.cursor()
        cursor.execute(f"SELECT rezept_id, rezept_name, anzahl_portionen, rezept_ersteller, wg_name, rezept_anleitung FROM datenbank.rezept WHERE rezept_id = '{rezept_id}'")
        tuples = cursor.fetchall()

        for (rezept_id, rezept_name, anzahl_portionen, rezept_ersteller, wg_name, rezept_anleitung) in tuples:
            rezept = Rezept()
            rezept.set_id(rezept_id)
            rezept.set_rezept_name(rezept_name)
            rezept.set_anzahl_portionen(anzahl_portionen)
            rezept.set_rezept_ersteller(rezept_ersteller)
            rezept.set_wg_name(wg_name)
            rezept.set_rezept_anleitung(rezept_anleitung)


        self._connector.commit()
        cursor.close()

        return rezept

    def find_anzahl_portionen_by_rezept_id(self, rezept_id):
        cursor = self._connector.cursor()
        command = f"SELECT anzahl_portionen FROM datenbank.rezept WHERE rezept_id='{rezept_id}'"
        cursor.execute(command)
        result = cursor.fetchone()
        cursor.close()

        if result:
            return result[0]
        else:
            return None

    def find_lebensmittel_by_rezept_id(self, rezept):
        result = []
        cursor = self._connector.cursor()
        command = f"SELECT lebensmittel.lebensmittel_id, " \
                  f"lebensmittel.lebensmittel_name, " \
                  f"masseinheit.masseinheit_name, " \
                  f"mengenanzahl.menge," \
                  f"lebensmittel.kuehlschrank_id," \
                  f"lebensmittel.rezept_id FROM datenbank.lebensmittel " \
                  f"JOIN masseinheit ON lebensmittel.masseinheit_id = masseinheit.masseinheit_id " \
                  f"JOIN mengenanzahl on lebensmittel.mengenanzahl_id = mengenanzahl.id " \
                  f"WHERE lebensmittel.rezept_id = '{rezept}'"
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (lebensmittel_id, lebensmittel_name, masseinheit_name, menge, kuehlschrank_id, rezept_id) in tuples:
            l = Lebensmittel()
            l.set_id(lebensmittel_id)
            l.set_lebensmittelname(lebensmittel_name)
            l.set_masseinheit(masseinheit_name)
            l.set_mengenanzahl(menge)
            l.set_kuelschrank_id(kuehlschrank_id)
            l.set_rezept_id(rezept_id)
            print(f" Das ist das gezogene Rezept_enthält_lebensmittel aus der DB {l.__str__()}")
            result.append(l)

        self._connector.commit()
        cursor.close()

        return result

    def insert_in_lebensmittel(self, l):
        print("ich bin in der insert Methode des RezeptEnthLebensmMapper")
        cursor = self._connector.cursor()
        cursor.execute("SELECT MAX(lebensmittel_id) AS maxid FROM datenbank.lebensmittel")
        tuples = cursor.fetchall()

        for (maxid,) in tuples:
            if maxid is not None:
                l.set_id(int(maxid) + 1)
            else:
                l.set_id(1)

        command = "INSERT INTO datenbank.lebensmittel (lebensmittel_id, lebensmittel_name, masseinheit_id, mengenanzahl_id, kuehlschrank_id, rezept_id) VALUES (%s, %s, %s,%s,%s,%s)"
        data = (l.get_id(), l.get_lebensmittelname(), l.get_masseinheit_id(), l.get_mengenanzahl_id(), l.get_kuehlschrank_id(), l.get_rezept_id())
        cursor.execute(command, data)

        self._connector.commit()
        cursor.close()
        return l

    def check_if_current_user_is_rezept_admin_using_email_and_wg_id(self, current_user, rezept_id):

        cursor = self._connector.cursor()
        command = f"SELECT rezept_id FROM datenbank.rezept WHERE rezept_ersteller =%s AND wg_id =%s "
        data =(current_user, rezept_id)
        cursor.execute(command, data)
        rezept = cursor.fetchone()

        if rezept:
            result = True

        else:
            result = False

        self._connector.commit()
        cursor.close()
        #print("Mapper result: result", result)
        return result



    def delete_rezept(self, rezept_id):
        cursor = self._connector.cursor()
        command = """
        UPDATE datenbank.rezept
        SET rezept_ersteller = REPLACE(REPLACE(TRIM(BOTH ',' FROM REPLACE(rezept_ersteller, %s, '')), ',,', ','), ',,', ',')
        WHERE rezept_id = %s
        """
        data = (rezept_id)

        cursor.execute(command, data)

        self._connector.commit()
        cursor.close()
