import mysql.connector as connector
import os
from contextlib import AbstractContextManager
from abc import ABC, abstractmethod
from credentials import credentials


class mapper(AbstractContextManager, ABC):

    def __init__(self):
        self._connector = None

    def __enter__(self):
        self._connector = connector.connect(user='root', password=credentials["db_password"], host='localhost', database='datenbank')

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
