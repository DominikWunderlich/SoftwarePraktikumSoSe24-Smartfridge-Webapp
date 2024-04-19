from server.bo import BusinessObject as bo
class Person (bo.BusinessObject):
    def __init__(self):
        super().__init__()
        self.benutzername = ""  # Die extern verwaltete User ID.
        self.vorname = ""  # Der vorname des Benutzers.
        self.nachname = ""  # Der Nachname des Benutzers.
        self.email = ""  # Die E-Mail-Adresse des Benutzers.
    def get_benutzername(self):
        """Auslesen des Benutzernamens."""
        return self.benutzername

    def set_benutzername(self, value):
        """Setzen des Benutzernamens."""
        self.benutzername = value
    def get_vorname(self):
        """Auslesen vorname."""
        return self.vorname

    def set_vorname(self, value):
        """setzten vorname."""
        self.vorname = value

    def get_nachname(self):
        """Auslesen nachname."""
        return self.nachname

    def set_nachname(self, value):
        """Setzen nachname."""
        self.nachname = value

    def get_email(self):
        """Auslesen der E-Mail-Adresse."""
        return self.email

    def set_email(self, value):
        """Setzen der E-Mail-Adresse."""
        self.email = value


    def __str__(self):
        return "User: {}, {}, {}, {}, {}".format(self._id, self.benutzername, self.vorname, self.nachname, self.email)

    @staticmethod
    def from_dict(dictionary=dict()):
        pe = person()
        pe.set_id(dictionary["id"])
        pe.set_benutzername(dictionary["benutzername"])  # eigentlich Teil von BusinessObject !
        pe.set_name(dictionary["vorname"])
        pe.set_name(dictionary["nachname"])
        pe.set_email(dictionary["email"])
        return obj
