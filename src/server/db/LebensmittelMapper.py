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

        for (id, lebensmittelname) in tuples:
            lebensmittel = Lebensmittel()
            lebensmittel.set_id(id)
            lebensmittel.set_lebensmittlename(lebensmittelname)
            result.append(lebensmittel)

        self._connector.commit()
        cursor.close()

        return result

    def find_by_lebensmittelname(self, lebensmittelname):
        result = []
        cursor = self._connector.cursor()
        command = "SELECT id, lebensmittelname, aggregatszustand FROM datenbank.lebensmittel WHERE lebensmittelname LIKE %s"
        cursor.execute(command, (lebensmittelname,))
        tuples = cursor.fetchall()

        for (id, lebensmittelname) in tuples:
            lebensmittel = Lebensmittel()
            lebensmittel.set_id(id)
            lebensmittel.set_lebensmittlename(lebensmittelname)
            result.append(lebensmittel)

        self._connector.commit()
        cursor.close()

        return result

    def insert(self, l):
        cursor = self._connector.cursor()
        cursor.execute("SELECT MAX(lebensmittel_id) AS maxid FROM datenbank.lebensmittel")
        tuples = cursor.fetchall()

        for (maxid,) in tuples:
            if maxid is not None:
                l.set_id(maxid + 1)
            else:
                l.set_id(1)

        command = "INSERT INTO lebensmittel (lebensmittel_id, lebensmittel_name, masseinheit_id, mengenanzahl_id) VALUES (%s, %s, %s, %s)"
        data = (l.get_id(), l.get_lebensmittelname(), l.get_masseinheit(), l.get_mengenanzahl())
        cursor.execute(command, data)

        self._connector.commit()
        cursor.close()

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

if (__name__ == "__main__"):
    with LebensmittelMapper() as mapper:
        result = mapper.find_all()
        for lebensmittel in result:
            print(lebensmittel)