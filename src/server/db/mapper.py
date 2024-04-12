import mysql.connector as connector
import os
from contextlib import AbstractContextManager
from abc import ABC, abstractmethod


class mapper(AbstractContextManager, ABC):

    def __init__(self):
        self._connector = None

    def __enter__(self):

        if os.getenv('GAE_ENV', '').startswith('standard'):

            self._connector = connector.connect(user='root', passwort='demo', unix_spcket='/cloudsql/', database='main')

        else:
            self._connector = connector.connect(user='root', passwort='demo', host='127.0.0.1', database='main')

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
