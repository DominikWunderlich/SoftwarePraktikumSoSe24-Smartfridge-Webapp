from server.db.mapper import mapper
from server.bo.Lebensmittel import Lebensmittel


class LebensmittelMapper(mapper):

    def __init__(self):
        super().__init__()

    def find_all(self):
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from datenbank.lebensmittel")
        tuples = cursor.fetchall()

        for (id, lebensmittel_name, aggregatzustand) in tuples:
            lebensmittel = Lebensmittel()
            lebensmittel.set_lebensmittel_id(id)
            lebensmittel.set_lebensmittel_name(lebensmittel_name)
            lebensmittel.set_aggregatzustand(aggregatzustand)
            result.append(lebensmittel)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_lebensmittelname(self, lebensmittel_name):
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, lebensmittel_name, aggregatzustand FROM datenbank.lebensmittel WHERE lebensmittel_name LIKE %s"
        cursor.execute(command, (lebensmittel_name,))
        tuples = cursor.fetchall()

        for (id, lebensmittel_name, aggregatzustand) in tuples:
            lebensmittel = Lebensmittel()
            lebensmittel.set_lebensmittel_id(id)
            lebensmittel.set_lebensmittel_name(lebensmittel_name)
            lebensmittel.set_aggregatzustand(aggregatzustand)
            result.append(lebensmittel)

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, lebensmittel):
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM datenbank.lebensmittel")
        tuples = cursor.fetchall()

        for (maxid,) in tuples:
            if maxid is not None:
                lebensmittel.set_id(maxid + 1)
            else:
                lebensmittel.set_id(1)

        command = "INSERT INTO lebensmittel (id, lebensmittel_name, aggregatzustand) VALUES (%s, %s, %s)"
        data = (lebensmittel.get_id(), lebensmittel.get_lebensmittel_name(), lebensmittel.get_aggregatzustand())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return lebensmittel

    def update(self, lebensmittel):
        cursor = self._cnx.cursor()

        command = "UPDATE datenbank.lebensmittel SET lebensmittel_name=%s, aggregatzustand=%s WHERE id=%s"
        data = (lebensmittel.get_lebensmittel_name(), lebensmittel.get_aggregatzustand(), lebensmittel.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, lebensmittel):
        cursor = self._cnx.cursor()

        command = "DELETE FROM datenbank.lebensmittel WHERE id=%s"
        data = (lebensmittel.get_id(),)
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

if (__name__ == "__main__"):
    with LebensmittelMapper() as mapper:
        result = mapper.find_all()
        for lebensmittel in result:
            print(lebensmittel)
