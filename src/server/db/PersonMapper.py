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

        for (person_id, email, benutzername, vorname, nachname, google_id, wg_id) in tuples:
            user = Person()
            user.set_id(person_id)
            user.set_email(email)
            user.set_benutzername(benutzername)
            user.set_vorname(vorname)
            user.set_nachname(nachname)
            user.set_google_id(google_id)
            user.set_wg_id(wg_id)
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

        for (person_id, email, benutzername, vorname, nachname, google_id, wg_id) in tuples:
            user = Person()
            user.set_id(person_id)
            user.set_email(email)
            user.set_benutzername(benutzername)
            user.set_vorname(vorname)
            user.set_nachname(nachname)
            user.set_google_id(google_id)
            user.set_wg_id(wg_id)
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

        for (person_id, email, benutzername, vorname, nachname, google_id, wg_id) in tuples:
            user = Person()
            user.set_id(person_id)
            user.set_email(email)
            user.set_benutzername(benutzername)
            user.set_vorname(vorname)
            user.set_nachname(nachname)
            user.set_google_id(google_id)
            user.set_wg_id(wg_id)
            result.append(user)

        self._connector.commit()
        cursor.close()

        return result

    def find_by_email(self, email):
        result = []
        cursor = self._connector.cursor()
        command = f"SELECT * FROM datenbank.person WHERE email='{email}'"
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (email, benutzername, nachname, vorname, person_id, google_id, wg_id) in tuples:
            user = Person()
            user.set_email(email)
            user.set_benutzername(benutzername)
            user.set_nachname(nachname)
            user.set_vorname(vorname)
            user.set_id(person_id)
            user.set_google_id(google_id)
            user.set_wg_id(wg_id)
            result.append(user)

        self._connector.commit()
        cursor.close()
        return result

    def find_by_google_id(self, GoogleID):
        cursor = self._connector.cursor()
        command = f"SELECT * FROM datenbank.person WHERE google_id='{GoogleID}'"
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (email, benutzername, nachname, vorname, id, google_id, wg_id) in tuples:
            user = Person()
            user.set_id(id)
            user.set_email(email)
            user.set_benutzername(benutzername)
            user.set_vorname(vorname)
            user.set_nachname(nachname)
            user.set_google_id(google_id)
            user.set_wg_id(wg_id)
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

        command = "INSERT INTO datenbank.person (id, email, benutzername, vorname, nachname, google_id, wg_id) VALUES (%s,%s,%s,%s,%s,%s,%s)"
        data = (
            person.get_id(), person.get_email(), person.get_benutzername(), person.get_vorname(), person.get_nachname(),
            person.get_google_id(), person.get_wg_id())
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

        command = 'UPDATE datenbank.person SET email=%s, benutzername=%s, nachname=%s, vorname=%s, wg_id=%s WHERE google_id=%s'
        data = (
            person.get_email(), person.get_benutzername(), person.get_nachname(), person.get_vorname(),
            person.get_wg_id(),person.get_google_id())

        cursor.execute(command, data)

        self._connector.commit()
        cursor.close()


    def delete(self, person):

        cursor = self._connector.cursor()

        command = f'DELETE FROM datenbank.person WHERE person_id={person.get_id()}'
        cursor.execute(command)

        self._connector.commit()
        cursor.close()

    def find_all_by_wg_bewohner(self, wg_bewohner):
        result = []
        cursor = self._connector.cursor()

        # Erstelle eine Zeichenkette mit so vielen Platzhaltern wie E-Mail-Adressen in wg_bewohner
        placeholders = ', '.join(['%s'] * len(wg_bewohner))

        command = f"SELECT * FROM datenbank.person WHERE email IN ({placeholders})"
        data = tuple(wg_bewohner)
        print(data)
        cursor.execute(command, data)
        tuples = cursor.fetchall()

        for (email, benutzername, nachname, vorname, person_id, google_id, wg_id) in tuples:
            user = Person()
            user.set_email(email)
            user.set_benutzername(benutzername)
            user.set_nachname(nachname)
            user.set_vorname(vorname)
            user.set_id(person_id)
            user.set_google_id(google_id)
            user.set_wg_id(wg_id)
            result.append(user)

        self._connector.commit()
        cursor.close()
        print("199", result)
        return result

    def insert_wg_id_to_wg_ersteller(self, wg_id, wg_ersteller):
        cursor = self._connector.cursor()

        command = f"UPDATE datenbank.person SET wg_id= {wg_id} WHERE email= '{wg_ersteller}'"
        cursor.execute(command)

        self._connector.commit()
        cursor.close()

    def find_wg_id_by_email(self, email):
        cursor = self._connector.cursor()

        command = f"SELECT wg_id FROM datenbank.person WHERE email = '{email}'"
        cursor.execute(command)

        result = cursor.fetchone()

        self._connector.commit()
        cursor.close()

        if result:
            return result[0]
        else:
            return None

    def find_all_by_wg_id(self, wg_id):
        result =[]
        cursor = self._connector.cursor()
        command = f"SELECT * FROM datenbank.person WHERE wg_id='{wg_id}'"
        cursor.execute(command)

        tuples = cursor.fetchall()

        for (email, benutzername, nachname, vorname, id, google_id, wg_id) in tuples:
            person = Person()
            person.set_email(email)
            person.set_benutzername(benutzername)
            person.set_nachname(nachname)
            person.set_vorname(vorname)
            person.set_id(id)
            person.set_google_id(google_id)
            person.set_wg_id(wg_id)
            result.append(person)

        self._connector.commit()
        cursor.close()

        return result

    def update_wg_id_person(self, wg_id, email):
        cursor = self._connector.cursor()
        command = f"UPDATE datenbank.person SET wg_id='{wg_id}' WHERE email ='{email}'"

        cursor.execute(command)
        self._connector.commit()
        cursor.close()
        return

    def delete_wg_id_person(self, wg_id, person_id):
        cursor = self._connector.cursor()
        command = f"UPDATE datenbank.person SET wg_id = null WHERE id = '{person_id}' and wg_id='{wg_id}'"

        cursor.execute(command)
        self._connector.commit()
        cursor.close()
        return





