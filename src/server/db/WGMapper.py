from server.db.mapper import mapper
from server.bo.WG import WG

class WGMapper(mapper):
    def __init__(self):
        super().__init__()

    def find_all(self):
        result = []
        cursor = self._connector.cursor()
        cursor.execute("SELECT wg_id, wg_name, wg_bewohner, wg_ersteller FROM datenbank.wg")
        tuples = cursor.fetchall()

        for (wg_id, wg_name, wg_bewohner, wg_ersteller) in tuples:
            wg = WG()
            wg.set_id(wg_id)
            wg.set_wg_name(wg_name)
            wg.set_wg_bewohner(wg_bewohner)
            wg.set_wg_ersteller(wg_ersteller)
            result.append(wg)

        self._connector.commit()
        cursor.close()

        return result

    def find_by_key(self, key):
        result =[]

        cursor = self._connector.cursor()
        command = f"SELECT wg_id, wg_name, wg_bewohner, wg_ersteller FROM datenbank.wg WHERE wg_name='{key}' "
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (wg_id, wg_name, wg_bewohner, wg_ersteller) in tuples:
            wg = WG()
            wg.set_id(wg_id)
            wg.set_wg_name(wg_name)
            wg.set_wg_bewohner(wg_bewohner)
            wg.set_wg_ersteller(wg_ersteller)
            result.append(wg)

        self._connector.commit()
        cursor.close()

        return result

    """ Die wg wird anhand der email Adresse des wg_bewohners oder wg_erstellers ausgegeben"""
    def find_by_email(self, email):
        result = []

        cursor = self._connector.cursor()
        # TODO: passt das LIKE auch für den Gebrauch von Domi? Wenn nicht Funktion 2mal (WHERE wg_bewohner LIKE '%{email}%'"" & (WHERE wg_bewohner='{email}')
        command = f"SELECT wg_id, wg_name, wg_bewohner, wg_ersteller FROM datenbank.wg WHERE wg_bewohner LIKE '%{email}%' OR wg_ersteller LIKE '%{email}%' "
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (wg_id, wg_name, wg_bewohner, wg_ersteller) in tuples:
            wg = WG()
            wg.set_id(wg_id)
            wg.set_wg_name(wg_name)
            wg.set_wg_bewohner(wg_bewohner)
            wg.set_wg_ersteller(wg_ersteller)
            result.append(wg)

        self._connector.commit()
        cursor.close()

        return result

    def insert(self, wg):
        cursor = self._connector.cursor()
        cursor.execute("SELECT MAX(wg_id) AS maxid FROM datenbank.wg")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                wg.set_id(maxid[0] + 1)

            else:
                wg.set_id(1)

        command = "INSERT INTO datenbank.wg (wg_name, wg_bewohner, wg_ersteller, wg_id) VALUES (%s, %s, %s, %s)"
        data = (wg.get_wg_name(), wg.get_wg_bewohner(), wg.get_wg_ersteller(), wg.get_id())
        cursor.execute(command, data)

        self._connector.commit()
        cursor.close()

        return wg

    """ Diese Methode updated eine WG basierend auf der wg_id"""
    def update(self, wg):
        cursor = self._connector.cursor()

        command = "UPDATE datenbank.wg SET wg_id=%s, wg_name=%s, wg_bewohner=%s, wg_ersteller=%s WHERE wg_id=%s"
        data = (wg.get_id(), wg.get_wg_name(), wg.get_wg_bewohner(), wg.get_wg_ersteller(), wg.get_id())

        cursor.execute(command, data)
        self._connector.commit()
        cursor.close()



    def delete(self, key):
        cursor = self._connector.cursor()

        command = f"DELETE FROM datenbank.wg WHERE wg_name='{key}'"
        cursor.execute(command)

        self._connector.commit()
        cursor.close()

    def find_wg_admin_by_email(self, email):
        result = []
        cursor = self._connector.cursor()
        command = f"SELECT wg_ersteller FROM datenbank.wg WHERE wg_bewohner LIKE '%{email}%' OR wg_ersteller LIKE '%{email}%'"
        cursor.execute(command)

        tuples = cursor.fetchall()

        for (wg_ersteller) in tuples:
            wg = WG()
            wg.set_wg_ersteller(wg_ersteller)
            result.append(wg)

        self._connector.commit()
        cursor.close()
        return result
