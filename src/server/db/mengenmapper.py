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

        # Wenn die Menge bereits existiert, geben wir ein False zurück.
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
        print(f" IM Mengenmapper: hier wird die Menge {obj.get_menge()} in die DB gebracht. ")
        cursor.execute(command, data)

        self._connector.commit()
       # cursor.close()
        print("Das ist Object im mengenmapper", obj.get_id())
        return obj.get_id()

    def insert2(self, obj):
        cursor = self._connector.cursor()

        # Zuerst überprüfen wir, ob eine Menge bereits angelegt wurde:
        command_check = "SELECT id FROM datenbank.mengenanzahl WHERE menge = %s"
        data_check = (obj.get_menge())
        cursor.execute(command_check, (data_check,))
        existing_id = cursor.fetchone()
        print(existing_id)
        print("drüber steht die existing_id was ist das?")

        # Wenn die Menge bereits existiert, geben wir ein False zurück.
        if existing_id:
            cursor.close()
            return existing_id[0]

        cursor.execute(f'SELECT MAX(id) AS maxid FROM datenbank.mengenanzahl')
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:

                obj.set_id(maxid[0] + 1)

            else:
                obj.set_id(1)

        command = "INSERT INTO datenbank.mengenanzahl (id, menge) VALUES (%s, %s)"
        data = (obj.get_id(), obj.get_menge())
        print(f" IM Mengenmapper: hier wird die Menge {obj.get_menge()} in die DB gebracht. ")
        cursor.execute(command, data)

        self._connector.commit()
       # cursor.close()
        print("Das ist Object im mengenmapper", obj.get_id())
        return obj.get_id()


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

        result = None
        cursor = self._connector.cursor()
        command = f"SELECT id, menge FROM datenbank.mengenanzahl WHERE id='{key}' "
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, menge) in tuples:
            result = Mengenanzahl()
            result.set_id(id)
            result.set_menge(menge)

        self._connector.commit()
        cursor.close()
        print(f"result {result}")
        return result

    def update(self, object):
        pass

    def delete(self, object):
        pass
