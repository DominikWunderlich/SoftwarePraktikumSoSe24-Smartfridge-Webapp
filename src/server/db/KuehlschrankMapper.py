from server.db.mapper import mapper
from server.bo.Kuehlschrank import Kuehlschrank
from server.bo.Lebensmittel import Lebensmittel


class KuehlschrankMapper(mapper):

    def __init__(self):
        super().__init__()


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

    def insert(self, object):
        pass

    def update(self, object):
        pass

    def delete(self, object):
        pass