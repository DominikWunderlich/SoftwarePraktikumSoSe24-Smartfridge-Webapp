from server.bo.Transaction import Transaction
from server.db.mapper import mapper


class MaßeinheitMapper (mapper):

    def __init__(self):
        super().__init__()

    def find_all(self):

        result = []
        cursor = self._cnx.cursor()

        cursor.execute("SELECT id, sourceAccount, targetAccount, amount from datenbank.transactions")
        tuples = cursor.fetchall()

        for (id, sourceAccount, targetAccount, amount) in tuples:
            transaction = Transaction()
            transaction.set_id(id)
            transaction.set_source_account(sourceAccount)
            transaction.set_target_account(targetAccount)
            transaction.set_amount(amount)
            result.append(transaction)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_source_account_id(self, account_id):


        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, sourceAccount, targetAccount, amount FROM datenbank.transactions WHERE sourceAccount={} ORDER BY id".format(account_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, sourceAccount, targetAccount, amount) in tuples:
            transaction = Transaction()
            transaction.set_id(id)
            transaction.set_source_account(sourceAccount)
            transaction.set_target_account(targetAccount)
            transaction.set_amount(amount)
            result.append(transaction)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_target_account_id(self, account_id):
        """Auslesen aller Buchungen eines durch Fremdschlüssel (Kontonr.) gegebenen Ziel-Kontos.

        :param account_id Schlüssel des zugehörigen Kontos.
        :return Eine Sammlung mit Transaction-Objekten.
        """
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, sourceAccount, targetAccount, amount FROM datenbank.transactions WHERE targetAccount={} ORDER BY id".format(account_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, sourceAccount, targetAccount, amount) in tuples:
            transaction = Transaction()
            transaction.set_id(id)
            transaction.set_source_account(sourceAccount)
            transaction.set_target_account(targetAccount)
            transaction.set_amount(amount)
            result.append(transaction)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, sourceAccount, targetAccount, amount FROM datenbank.transactions WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        if tuples is not None \
                and len(tuples) > 0 \
                and tuples[0] is not None:
            (id, sourceAccount, targetAccount, amount) = tuples[0]
            transaction = Transaction()
            transaction.set_id(id)
            transaction.set_source_account(sourceAccount)
            transaction.set_target_account(targetAccount)
            transaction.set_amount(amount)

            result = transaction
        else:
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, transaction):

        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM datenbank.transactions ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            transaction.set_id(maxid[0] + 1)

        command = "INSERT INTO datenbank.transactions (id, sourceAccount, targetAccount, amount) VALUES (%s,%s,%s,%s)"
        data = (transaction.get_id(),
                transaction.get_source_account(),
                transaction.get_target_account(),
                transaction.get_amount())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return transaction

    def update(self, transaction):

        cursor = self._cnx.cursor()

        command = "UPDATE transactions " + "SET sourceAccount=%s, targetAccount=%s, amount=%s WHERE id=%s"
        data = (transaction.get_source_account(),
                transaction.get_target_account(),
                transaction.get_amount(),
                transaction.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, transaction):

        cursor = self._cnx.cursor()

        command = "DELETE FROM datenbank.transactions WHERE id={}".format(transaction.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()


if (__name__ == "__main__"):
    with MasseinheitMapper() as mapper:
        result = mapper.find_all()
        for transaction in result:
            print(Masseinheit)

if (__name__ == "__main__"):
    with AccountMapper() as mapper:
        result = mapper.find_all()
        for lebensmittel in result:
            print(lebensmittel)
