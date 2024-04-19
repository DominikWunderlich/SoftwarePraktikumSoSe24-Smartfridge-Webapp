from server.bo.Masseinheit import Masseinheit
from server.db.mapper import mapper

class MasseinheitMapper(mapper):

    def find_all(self):
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * FROM datenbank.masseinheit")
        for (id, maßeinheit, menge) in cursor.fetchall():
            masseinheit_instance = Masseinheit()
            masseinheit_instance.set_id(id)
            masseinheit_instance.set_masseinheitname(maßeinheit)
            masseinheit_instance.set_menge(menge)
            result.append(masseinheit_instance)
        cursor.close()
        return result

    def find_by_name(self, name):
        result = None
        cursor = self._cnx.cursor()
        command = "SELECT id, maßeinheit, menge FROM datenbank.Masseinheit WHERE maßeinheit = %s"
        cursor.execute(command, (mname,))
        tuple = cursor.fetchone()
        cursor.close()
        if tuple:
            (id, maßeinheit, menge) = tuple
            result = Masseinheit()
            result.set_id(id)
            result.set_masseinheit(maßeinheit)
            result.set_menge(menge)
        return result

    def insert(self, Masseinheit):
        cursor = self._cnx.cursor()
        command = "INSERT INTO datenbank.masseinheit (id, maßeinhei, menge) VALUES (%s, %s, %s)"
        data = (Masseinheit.get_id(), Masseinheit.get_masseinheitname(), Masseinheit.get_menge())
        cursor.execute(command, data)
        self._cnx.commit()
        cursor.close()

    def update(self, Masseinheit):
        cursor = self._cnx.cursor()
        command = "UPDATE datenbank.masseinheit SET maßeinheit=%s, menge=%s WHERE id=%s"
        data = (Masseinheit.get_masseinheitname(), Masseinheit.get_menge(), Masseinheit.get_id())
        cursor.execute(command, data)
        self._cnx.commit()
        cursor.close()

    def delete(self, Masseinheit):
        cursor = self._cnx.cursor()
        command = "DELETE FROM datenbank.masseinheit WHERE id=%s"
        cursor.execute(command, (Masseinheit.get_id(),))
        self._cnx.commit()
        cursor.close()

if __name__ == "__main__":
    with MasseinheitMapper() as mapper:
        result = mapper.find_all()
        for masseinheit_instance in result:
            print(masseinheit_instance)
