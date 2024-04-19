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

    def insert(self, wg):
        cursor = self._connector.cursor()
        cursor.execute("SELECT MAX(wg_id) AS maxid FROM datenbank.wg")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                wg.set_id(maxid[0] + 1)

            else:
                wg.set_id(1)

        command = "INSERT INTO datenbank.wg (wg_id, wg_name, wg_bewohner, wg_ersteller) VALUES (%s, %s, %s, %s)"
        data = (wg.get_id(), wg.get_wg_name(), wg.get_wg_bewohner(), wg.get_wg_ersteller())
        cursor.execute(command, data)

        self._connector.commit()
        cursor.close()

        return wg

    def update(self, wg):
        cursor = self._connector.cursor()

        command = "UPDATE datenbank.wg SET wg_id=%s, wg_name=%s, wg_bewohner=%s, wg_ersteller=%s"
        data = (wg.get_id(), wg.get_wg_name(), wg.get_wg_bewohner(), wg.get_wg_ersteller())

        cursor.execute(command, data)

        self._connector(command, data)
        cursor.close()

    def delete(self, key):
        cursor = self._connector.cursor()

        command = f"DELETE FROM datenbank.wg WHERE wg_name='{key}'"
        cursor.execute(command)

        self._connector.commit()
        cursor.close()
