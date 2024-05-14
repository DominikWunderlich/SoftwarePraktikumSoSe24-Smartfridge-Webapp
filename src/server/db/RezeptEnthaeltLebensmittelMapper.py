from server.db.mapper import mapper
from server.bo.RezeptEnthaeltLebensmittel import RezeptEnthaeltLebensmittel

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
    def find_by_key(self):
        pass
    def update(self):
        pass
