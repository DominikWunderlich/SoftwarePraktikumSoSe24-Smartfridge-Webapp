from server.bo.Masseinheit import Masseinheit
from server.db.mapper import mapper

class MasseinheitMapper(mapper):

    def find_all(self):
        result = []
        cursor = self._connector.cursor()
        cursor.execute("SELECT * FROM datenbank.maßeinheit")
        for (id, maßeinheit, faktor) in cursor.fetchall():
            masseinheit_instance = Masseinheit()
            masseinheit_instance.set_id(id)
            masseinheit_instance.set_masseinheit(maßeinheit)
            masseinheit_instance.set_umrechnungsfaktor(faktor)
            result.append(masseinheit_instance)
        cursor.close()
        return result

    def find_by_name(self, name):
        result = None
        cursor = self._connector.cursor()
        command = "SELECT masseinheit_id, masseinheit_name, umrechnungsfaktor FROM datenbank.maßeinheit WHERE masseinheit_name = %s"
        cursor.execute(command, (name,))
        tuple = cursor.fetchone()
        cursor.close()
        if tuple:
            (id, maßeinheit, faktor) = tuple
            result = Masseinheit()
            result.set_id(id)
            result.set_masseinheit(maßeinheit)
            result.set_umrechnungsfaktor(faktor)
        return result

    def insert(self, Masseinheit):
        cursor = self._connector.cursor()

        cursor.execute(f'SELECT MAX(masseinheit_id) AS maxid FROM datenbank.maßeinheit')
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:

                Masseinheit.set_id(maxid[0] + 1)

            else:
                Masseinheit.set_id(1)

        command = "INSERT INTO datenbank.maßeinheit (masseinheit_id, masseinheit_name, umrechnungsfaktor) VALUES (%s, %s, %s)"
        data = (Masseinheit.get_id(), Masseinheit.get_masseinheit(), Masseinheit.get_umrechnungsfaktor())
        cursor.execute(command, data)

        self._connector.commit()
        cursor.close()

    def update(self, Masseinheit):
        cursor = self._connector.cursor()
        command = "UPDATE datenbank.maßeinheit SET maßeinheit=%s, menge=%s WHERE id=%s"
        data = (Masseinheit.get_masseinheitname(), Masseinheit.get_menge(), Masseinheit.get_id())
        cursor.execute(command, data)
        self._connector.commit()
        cursor.close()

    def delete(self, Masseinheit):
        cursor = self._connector.cursor()
        command = "DELETE FROM datenbank.maßeinheit WHERE id=%s"
        cursor.execute(command, (Masseinheit.get_id(),))
        self._connector.commit()
        cursor.close()

    def find_by_key(self, key):
        pass

if __name__ == "__main__":
    with MasseinheitMapper() as mapper:
        result = mapper.find_all()
        for masseinheit_instance in result:
            print(masseinheit_instance)
