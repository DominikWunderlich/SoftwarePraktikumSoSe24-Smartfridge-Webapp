# Info: Der Großteil aus diesem Code wurde aus dem "Bankprojekt" übernommen

import mysql.connector as connector
from contextlib import AbstractContextManager
from abc import ABC, abstractmethod
from credentials import credentials
import os

class mapper(AbstractContextManager, ABC):

    def __init__(self):
        self._connector = None

    def __enter__(self):

        """Hier wird geprüft ob die Verbindung zur Datenbank in der Cloud oder lokal ausgeführt wird. """

        if os.getenv('GAE_ENV', '').startswith('standard'):
            """Falls Code in der Cloud läuft, sind wir im "if" Zweig"""

            self._connector = connector.connect(user='root', password='sopra2024',
                                                unix_socket='/cloudsql/eatsmarter:europe-west3:eatsmarter-db',
                                                database='datenbank')

        else:
            """Kommen wir hier an, läuft der Code auf einem lokalen Development Server. Es wird eine Verbindung zu 
            einer lokal installierten MySQL Datenbank hergestellt."""
            self._connector = connector.connect(user='root', password=credentials["db_password"], host='127.0.0.1',
                                                database='datenbank')

        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self._connector.close()

    @abstractmethod
    def find_all(self):
        pass

    @abstractmethod
    def find_by_key(self, key):
        pass

    @abstractmethod
    def insert(self, object):
        pass

    @abstractmethod
    def update(self, object):
        pass

    @abstractmethod
    def delete(self, object):
        pass
