from server.db.mapper import mapper
from server.bo.WG import WG

class WGMapper(mapper):
    def __init__(self):
        super().__init__()

    def find_all(self):
        """ Auslesen aller Wgs"""
        result = []
        cursor = self._connector.cursor()
        cursor.execute("SELECT wg_id, wg_name, wg_ersteller FROM datenbank.wg")
        tuples = cursor.fetchall()

        for (wg_id, wg_name, wg_ersteller) in tuples:
            wg = WG()
            wg.set_id(wg_id)
            wg.set_wg_name(wg_name)
            wg.set_wg_ersteller(wg_ersteller)
            result.append(wg)

        self._connector.commit()
        cursor.close()

        return result

    def find_by_key(self, key):
        """Auslesen der Wg anhand des WgNamens"""
        result =[]

        cursor = self._connector.cursor()
        command = f"SELECT wg_id, wg_name, wg_ersteller FROM datenbank.wg WHERE wg_name='{key}' "
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (wg_id, wg_name, wg_ersteller) in tuples:
            wg = WG()
            wg.set_id(wg_id)
            wg.set_wg_name(wg_name)
            wg.set_wg_ersteller(wg_ersteller)
            result.append(wg)

        self._connector.commit()
        cursor.close()

        return result


    def find_by_email(self, email):
        """Auslesen der Wg anhand des wg_erstellers"""
        result = []

        cursor = self._connector.cursor()

        command = f"SELECT wg_id, wg_name, wg_ersteller FROM datenbank.wg WHERE wg_ersteller LIKE '%{email}%' "
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (wg_id, wg_name, wg_ersteller) in tuples:
            wg = WG()
            wg.set_id(wg_id)
            wg.set_wg_name(wg_name)
            wg.set_wg_ersteller(wg_ersteller)
            result.append(wg)

        self._connector.commit()
        cursor.close()

        return result

    def insert(self, wg):
        """Erstellen einer Wg"""
        cursor = self._connector.cursor()
        cursor.execute("SELECT MAX(wg_id) AS maxid FROM datenbank.wg")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                wg.set_id(maxid[0] + 1)

            else:
                wg.set_id(1)

        command = "INSERT INTO datenbank.wg (wg_name, wg_ersteller, wg_id) VALUES (%s, %s, %s)"
        data = (wg.get_wg_name(), wg.get_wg_ersteller(), wg.get_id())
        cursor.execute(command, data)

        self._connector.commit()
        cursor.close()

        return wg

    def delete(self, wg_id):
        """Löschen einer Wg anhand der wg_id"""
        cursor = self._connector.cursor()
        data = wg_id

        command = "DELETE FROM datenbank.wg WHERE wg_id =%s"
        cursor.execute(command, (data,))

        self._connector.commit()
        cursor.close()

    def find_wg_admin_by_email(self, wg_id):
        """ Auslesen des wg_erstellers anhand der wg_id"""
        cursor = self._connector.cursor()
        command = f"SELECT wg_ersteller FROM datenbank.wg WHERE wg_id = '{wg_id}'"
        cursor.execute(command)
        result = cursor.fetchone()

        self._connector.commit()
        cursor.close()

        if result:
            return result[0]
        else:
            None

    def check_if_current_user_is_wg_admin_using_email_and_wg_id(self, current_user, wg_id):
        """ Prüfen, ob die eingeloggte email der Ersteller der wg ist anhand der wg_id"""
        cursor = self._connector.cursor()
        command = f"SELECT wg_id, wg_name, wg_ersteller FROM datenbank.wg WHERE wg_ersteller =%s AND wg_id =%s "
        data =(current_user, wg_id)
        cursor.execute(command, data)
        wg = cursor.fetchone()

        if wg:
            result = True

        else:
            result = False

        self._connector.commit()
        cursor.close()
        return result

    def find_wg_by_wg_id(self, wg_id):
        """Auslesen der Wg anhand der wg_id"""
        result = []
        cursor = self._connector.cursor()
        command = f"SELECT wg_id, wg_name, wg_ersteller  FROM datenbank.wg WHERE wg_id = '{wg_id}'"
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (wg_id, wg_name, wg_ersteller) in tuples:
            wg = WG()
            wg.set_id(wg_id)
            wg.set_wg_name(wg_name)
            wg.set_wg_ersteller(wg_ersteller)
            result.append(wg)

        self._connector.commit()
        cursor.close()

        return result

    def update(self, object):
        pass


