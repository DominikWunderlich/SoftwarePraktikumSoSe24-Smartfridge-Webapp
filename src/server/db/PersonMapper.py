from server.db.mapper import mapper
from server.bo.Person import Person


class PersonMapper(mapper):
    def __init__(self):
        super().__init__()

    def find_all(self):

        result = []
        cursor = self._connector.cursor()
        command = "SELECT * from datenbank.person"
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (person_id, email, benutzername, vorname, nachname, google_id) in tuples:
            user = Person()
            user.set_id(person_id)
            user.set_email(email)
            user.set_benutzername(benutzername)
            user.set_vorname(vorname)
            user.set_nachname(nachname)
            user.set_google_id(google_id)
            result.append(user)

        self._connector.commit()
        cursor.close()

        return result

    def find_by_name(self, username):

        result = []
        cursor = self._connector.cursor()
        command = f"SELECT * FROM datenbank.person WHERE benutzername='{username}'"
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (person_id, email, benutzername, vorname, nachname, google_id) in tuples:
            user = Person()
            user.set_id(person_id)
            user.set_email(email)
            user.set_benutzername(benutzername)
            user.set_vorname(vorname)
            user.set_nachname(nachname)
            user.set_google_id(google_id)
            result.append(user)

        self._connector.commit()
        cursor.close()

        return result

    def find_by_key(self, key):

        result = []
        cursor = self._connector.cursor()
        command = f"SELECT * FROM datenbank.person WHERE person_id='{key}'"
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (person_id, email, benutzername, vorname, nachname, google_id) in tuples:
            user = Person()
            user.set_id(person_id)
            user.set_email(email)
            user.set_benutzername(benutzername)
            user.set_vorname(vorname)
            user.set_nachname(nachname)
            user.set_google_id(google_id)
            result.append(user)

        self._connector.commit()
        cursor.close()

        return result

    def find_by_email(self, mail):

        result = []

        cursor = self._connector.cursor()
        command = f"SELECT * FROM datenbank.person WHERE email='{mail}'"
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, email, benutzername, vorname, nachname, google_id) in tuples:
            user = Person()
            user.set_id(id)
            user.set_email(email)
            user.set_benutzername(benutzername)
            user.set_vorname(vorname)
            user.set_nachname(nachname)
            user.set_google_id(google_id)
            result.append(user)

        self._connector.commit()
        cursor.close()

        return result

    def find_by_google_id(self, GoogleID):
        cursor = self._connector.cursor()
        command = f"SELECT * FROM datenbank.person WHERE google_id='{GoogleID}'"
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (email, benutzername, nachname, vorname, id, google_id) in tuples:
            user = Person()
            user.set_id(id)
            user.set_email(email)
            user.set_benutzername(benutzername)
            user.set_vorname(vorname)
            user.set_nachname(nachname)
            user.set_google_id(google_id)
            return user

        self._connector.commit()
        cursor.close()

    def insert(self, person):

        cursor = self._connector.cursor()
        cursor.execute(f'SELECT MAX(id) AS maxid FROM datenbank.person')
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:

                person.set_id(maxid[0] + 1)

            else:
                person.set_id(1)

        command = "INSERT INTO datenbank.person (id, email, benutzername, vorname, nachname, google_id) VALUES (%s,%s,%s,%s,%s,%s)"
        data = (
            person.get_id(), person.get_email(), person.get_benutzername(), person.get_vorname(), person.get_nachname(),
            person.get_google_id())
        cursor.execute(command, data)

        self._connector.commit()
        cursor.close()

        return person

    def update(self, person):
        cursor = self._connector.cursor()

        cursor.execute('SELECT id FROM datenbank.person WHERE google_id=%s', (person.get_google_id(),))
        current_id = cursor.fetchone()

        if current_id is None:
            print(f"Im Person-Mapper Update. Keine Person mit der  {person.get_google_id()} gefunden.")
            cursor.close()

        command = 'UPDATE datenbank.person SET email=%s, benutzername=%s, nachname=%s, vorname=%s WHERE google_id=%s'
        data = (
            person.get_email(), person.get_benutzername(), person.get_nachname(), person.get_vorname(),
            person.get_google_id())
        cursor.execute(command, data)

        self._connector.commit()
        cursor.close()

    def delete(self, person):

        cursor = self._connector.cursor()

        command = f'DELETE FROM datenbank.person WHERE person_id={person.get_id()}'
        cursor.execute(command)

        self._connector.commit()
        cursor.close()
