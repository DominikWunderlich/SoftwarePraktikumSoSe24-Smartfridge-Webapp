from server.db.mapper import mapper
from server.bo.WG import WG

class WGMapper(mapper):
    def __init__(self):
        super().__init__()

    def find_all(self):
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

    """ Die wg wird anhand der email Adresse des wg_bewohners oder wg_erstellers ausgegeben"""
    def find_by_email(self, email):
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

    """ Diese Methode wird nicht mehr verwendet Stand 05.06.24"""
    def update(self, wg):
        cursor = self._connector.cursor()

        command = "UPDATE datenbank.wg SET wg_id=%s, wg_name=%s, wg_ersteller=%s WHERE wg_id=%s"
        data = (wg.get_id(), wg.get_wg_name(), wg.get_wg_ersteller(), wg.get_id())

        cursor.execute(command, data)
        self._connector.commit()
        cursor.close()


    # Diese Methode wird nicht mehr verwendet, da aber WGMapper von mapper erbt, bleibt die noch drinnen
    def delete(self, key):
        cursor = self._connector.cursor()

        command = f"DELETE FROM datenbank.wg WHERE wg_name='{key}'"
        cursor.execute(command)

        self._connector.commit()
        cursor.close()


    def delete_wg_and_kuehlschrank(self, wg_id):
        cursor = self._connector.cursor()
        data = wg_id

        command_1 = "DELETE FROM datenbank.lebensmittel WHERE kuehlschrank_id=%s"
        command_2 = "DELETE FROM datenbank.kuehlschrank WHERE kuehlschrank_id=%s"
        command_3 = "DELETE FROM datenbank.wg WHERE wg_id =%s"
        cursor.execute(command_1, (data,))
        cursor.execute(command_2, (data,))
        cursor.execute(command_3, (data,))

        self._connector.commit()
        cursor.close()

    def find_wg_admin_by_email(self, email):
        result = []
        cursor = self._connector.cursor()
        command = f"SELECT wg_ersteller FROM datenbank.wg WHERE wg_ersteller LIKE '%{email}%'"
        cursor.execute(command)

        tuples = cursor.fetchall()

        for (wg_ersteller) in tuples:
            wg = WG()
            wg.set_wg_ersteller(wg_ersteller)
            result.append(wg)

        self._connector.commit()
        cursor.close()
        return result

    def check_if_current_user_is_wg_admin_using_email_and_wg_id(self, current_user, wg_id):

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
        #print("Mapper result: result", result)
        return result

    def add_wg_bewohner(self, new_email, wg_id):
        cursor = self._connector.cursor()
        command = "UPDATE datenbank.wg SET wg_bewohner = CONCAT(wg_bewohner, ', ', %s) WHERE wg_id = %s"
        data =(new_email, wg_id)

        cursor.execute(command, data)

        self._connector.commit()
        cursor.close()

    def delete_wg_bewohner(self, new_email, wg_id):
        cursor = self._connector.cursor()
        command = """
        UPDATE datenbank.wg 
        SET wg_bewohner = REPLACE(REPLACE(TRIM(BOTH ',' FROM REPLACE(wg_bewohner, %s, '')), ',,', ','), ',,', ',')
        WHERE wg_id = %s
        """
        data = (new_email, wg_id)

        cursor.execute(command, data)

        self._connector.commit()
        cursor.close()

    def find_wg_id_by_email(self, email):
        print(email)
        e = f"%{email}%"
        cursor = self._connector.cursor()
        command = "SELECT wg_id FROM datenbank.wg WHERE wg_ersteller LIKE %s"
        cursor.execute(command, (e, e))

        wg_id = cursor.fetchone()
        if wg_id:
            # print(wg_id[0])
            return wg_id[0]  # Nur die wg_id zurückgeben

        return None

    # def find_wg_bewohner_by_wg_id(self, wg_id):
    #     cursor = self._connector.cursor()
    #     command = f"SELECT wg_bewohner FROM datenbank.wg WHERE wg_id='{wg_id}' "
    #     cursor.execute(command)
    #     wg_bewohner_row = cursor.fetchone()
    #
    #     self._connector.commit()
    #     cursor.close()
    #
    #     if wg_bewohner_row:
    #         wg_bewohner_list = wg_bewohner_row[0].split(", ")
    #         return wg_bewohner_list
    #     else:
    #         return []

    def find_wg_admin_by_wg_id(self, wg_id):
        cursor = self._connector.cursor()
        command = "SELECT wg_ersteller FROM datenbank.wg WHERE wg_id LIKE %s"
        cursor.execute(command, wg_id)

        wg_ersteller= cursor.fetchone()
        if wg_ersteller:
            return wg_ersteller

        return None

    def find_wg_by_wg_id(self, wg_id):
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


