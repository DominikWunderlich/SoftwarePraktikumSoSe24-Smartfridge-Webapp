from server.db.mapper import mapper
from server.bo.Person import Person

class PersonMapper(mapper):

    def __init__(self):
        super().__init__()

    def find_all(self):

        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from datenbank.person")
        tuples = cursor.fetchall()

        for (id, benutzername, vorname, nachname, email) in tuples:
            user = Person
            user.set_id(id)
            user.set_benutzername(benutzername)
            user.set_vorname(vorname)
            user.set_nachname(nachname)
            user.set_email(email)


        self._cnx.commit()
        cursor.close()

        return result

    def find_by_name(self, benutzername):

        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, vorname, nachname,  email, google_user_id FROM datenbank.person WHERE name LIKE '{}' ORDER BY name".format(benutzername)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, benutzername, vorname, nachname, email, google_user_id) in tuples:
            user = Person
            user.set_id(id)
            user.set_benutzername(benutzername)
            user.set_vorname(vorname)
            user.set_nachname(nachname)
            user.set_email(email)
            user.set_user_id(google_user_id)
            result.append(user)


        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):


        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, benutzername, vorname, nachname, email, google_user_id FROM datenbank.person WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, benutzername, vorname, nachname, email, google_user_id) = tuples[0]
            user = Person
            user.set_id(id)
            user.set_benutzername(benutzername)
            user.set_vorname(vorname)
            user.set_nachname(nachname)
            user.set_email(email)
        except IndexError:

            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_email(self, email):

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, benutzername, vorname, nachname, email, google_user_id FROM datenbank.person WHERE email={}".format(email)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, benutzername, vorname, nachname, email, google_user_id) = tuples[0]
            user = Person
            user.set_id(id)
            user.set_benutzername(benutzername)
            user.set_vorname(vorname)
            user.set_nachname(nachname)
            user.set_email(email)
        except IndexError:

            result = None

        self._cnx.commit()
        cursor.close()

        return result
    def find_by_google_user_id(self, google_user_id):

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, benutzername, vorname, nachname, email, google_user_id FROM datenbank.person WHERE google_user_id='{}'".format(google_user_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, benutzername, vorname, nachname, email, google_user_id) = tuples[0]
            user = Person
            user.set_id(id)
            user.set_benutzername(benutzername)
            user.set_vorname(vorname)
            user.set_nachname(nachname)
            user.set_email(email)

            result = user
        except IndexError:

            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, benutzername):

        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM datenbank.person ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:

                benutzername.set_id(maxid[0] + 1)
            else:

                benutzername.set_id(1)

        command = "INSERT INTO users (id, vorname, nachname, email, benutzername, google_user_id) VALUES (%s,%s,%s,%s)"
        data = (benutzername.get_id(), benutzername.get_name(), benutzername.get_email(), benutzername.get_user_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return benutzername

    def update(self, user):

        cursor = self._cnx.cursor()

        command = "UPDATE users " + "SET name=%s, email=%s WHERE google_user_id=%s"
        data = (user.get_benutzername(), user.get_vorname(), user.get_nachname(), user.get_email(), user.get_user_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, user):

        cursor = self._cnx.cursor()

        command = "DELETE FROM datenbank.person WHERE id={}".format(user.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()



if (__name__ == "__main__"):
    with PersonMapper() as mapper:
        result = mapper.find_all()
        for user in result:
            print(user)
