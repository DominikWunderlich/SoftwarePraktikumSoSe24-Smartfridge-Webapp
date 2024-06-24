from server.db.mapper import mapper


class KuehlschrankMapper(mapper):
    def __init__(self):
        super().__init__()

    def create_kuehlschrank(self, wg_id):
        cursor = self._connector.cursor()

        command = "INSERT INTO datenbank.kuehlschrank (kuehlschrank_id, wg_id) VALUES (%s, %s) "
        data = (wg_id, wg_id,)
        print(F" wg id: {data}")
        cursor.execute(command, data)

        self._connector.commit()
        cursor.close()


    def find_all(self):
        pass

    def find_by_key(self, key):
        pass

    def insert(self, kuehlschrank_id):
        pass

    def update(self, object):
        pass

    def update2(self, food_id, new_mengen_id, kuehlschrank_id):
        cursor = self._connector.cursor()
        command = f"UPDATE datenbank.lebensmittel SET lebensmittel.mengenanzahl_id='{new_mengen_id}' WHERE lebensmittel.lebensmittel_id='{food_id}' AND lebensmittel.kuehlschrank_id='{kuehlschrank_id}'"
        cursor.execute(command)

        self._connector.commit()
        cursor.close()

    def delete(self, kuehlschrank_id):
        cursor = self._connector.cursor()
        print("k_id im mapper", kuehlschrank_id)
        command = f"DELETE FROM datenbank.kuehlschrank WHERE kuehlschrank_id = '{kuehlschrank_id}' "

        cursor.execute(command)

        self._connector.commit()
        cursor.close()

    def delete_with_rezept_id(self, rezept_id, food_id):
        cursor = self._connector.cursor()
        print(f"Das ist die zu entfernende lebensmittel_id {food_id}")
        command = "DELETE FROM datenbank.lebensmittel WHERE rezept_id =%s AND lebensmittel_id =%s"
        data = (rezept_id, food_id)
        cursor.execute(command, data)

        self._connector.commit()
        cursor.close()
