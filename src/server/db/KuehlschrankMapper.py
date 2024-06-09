from server.db.mapper import mapper
from server.bo.Kuehlschrank import Kuehlschrank
from server.bo.Lebensmittel import Lebensmittel
from server.bo.Kuehlschrank_Inhalt import Kuehlschrank_Inhalt


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


    def find_lebensmittel_by_kuehlschrank_id(self, kuehlschrank_id):
        result = []
        cursor = self._connector.cursor()
        command = f"SELECT lebensmittel.lebensmittel_id, " \
                  f"lebensmittel.lebensmittel_name, " \
                  f"maßeinheit.masseinheit_name, " \
                  f"mengenanzahl.menge FROM datenbank.lebensmittel " \
                  f"JOIN kuehlschrankinhalt ON lebensmittel.lebensmittel_id = kuehlschrankinhalt.lebensmittel_id " \
                  f"JOIN maßeinheit ON lebensmittel.masseinheit_id = maßeinheit.masseinheit_id " \
                  f"JOIN mengenanzahl on lebensmittel.mengenanzahl_id = mengenanzahl.id " \
                  f"WHERE kuehlschrankinhalt.kuehlschrank_id = '{kuehlschrank_id}'"
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (lebensmittel_id, lebensmittel_name, masseinheit_name, menge) in tuples:
            l = Lebensmittel()
            l.set_id(lebensmittel_id)
            l.set_lebensmittelname(lebensmittel_name)
            l.set_masseinheit(masseinheit_name)
            l.set_mengenanzahl(menge)
            result.append(l)

        self._connector.commit()
        cursor.close()

        return result

    def find_all(self):
        pass

    def find_by_key(self, key):
        pass

    def insert(self, kuehlschrank_id, lebensmittel):
        cursor = self._connector.cursor()

        command = "INSERT INTO datenbank.kuehlschrankinhalt (kuehlschrank_id, lebensmittel_id) VALUES (%s, %s) "
        data = (kuehlschrank_id, lebensmittel.get_id())
        print(F" Lebensmittel id: {lebensmittel.get_id()}")
        cursor.execute(command, data)

        self._connector.commit()
        cursor.close()

        return lebensmittel


    def update(self, old_food_id, new_food_id, kuehlschrank_id):
        cursor = self._connector.cursor()
        print(f"Das ist old_food_id {old_food_id}, das ist die neue {new_food_id}, das ist die kuehlschrank_id {kuehlschrank_id}")
        command = "UPDATE datenbank.kuehlschrankinhalt SET lebensmittel_id =%s WHERE lebensmittel_id = %s AND kuehlschrank_id=%s"
        data = (new_food_id, old_food_id, kuehlschrank_id)
        cursor.execute(command, data)

        self._connector.commit()
        cursor.close()

    def delete(self, kuehlschrank_id, food_id):
        cursor = self._connector.cursor()
        print(f"Das ist die zu entfernende lebensmittel_id {food_id}")
        command = "DELETE FROM datenbank.lebensmittel WHERE kuehlschrank_id =%s AND lebensmittel_id =%s"
        data = (kuehlschrank_id, food_id)
        cursor.execute(command, data)

        self._connector.commit()
        cursor.close()
