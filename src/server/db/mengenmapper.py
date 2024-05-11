from server.bo.mengenanzahl import Mengenanzahl
from server.db.mapper import mapper

class MengenanzahlMapper(mapper):

    def insert(self, obj):
        cursor = self._connector.cursor()

        # Zuerst überprüfen wir, ob eine Menge bereits angelegt wurde:
        command_check = "SELECT id FROM datenbank.mengenanzahl WHERE menge = %s"
        data_check = (obj.get_menge())
        cursor.execute(command_check, (data_check,))
        existing_id = cursor.fetchone()

        # Wenn der Maßeinheit_name bereits existiert, geben wir ein False zurück.
        if existing_id:
            cursor.close()
            return False

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

    def find_by_menge(self, m):
        result = None

        cursor = self._connector.cursor()

        command = "SELECT id, menge FROM datenbank.mengenanzahl WHERE menge = %s"

        cursor.execute(command, (m,))
        tuple = cursor.fetchone()

        if tuple:
            (id, menge) = tuple
            result = Mengenanzahl()
            result.set_id(id)
            result.set_menge(menge)
        return result

    def find_all(self):
        pass

    def find_by_key(self, key):
        result = []

        cursor = self._connector.cursor()
        command = f"SELECT id, menge FROM datenbank.mengenanzahl WHERE id='{key}' "
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, menge) in tuples:
            menge = Mengenanzahl()
            menge.set_id(id)
            menge.set_menge(menge)
            result.append(menge)

        self._connector.commit()
        cursor.close()
        print(f"result {result}")
        return result

    def update(self, object):
        pass

    def delete(self, object):
        pass
