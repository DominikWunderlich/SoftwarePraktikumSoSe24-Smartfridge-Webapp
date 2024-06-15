from server.bo.BusinessObject import BusinessObject as bo


class Person(bo):
    """Realisierung einer exemplarischen Benutzerklasse.

    Aus Gründen der Vereinfachung besitzt der Kunden in diesem Demonstrator
    lediglich einen einfachen Namen, eine E_Mail-Adresse sowie eine außerhalb
    unseres Systems verwaltete User ID (z.B. die Google ID).
    """

    def __init__(self):
        super().__init__()
        self.benutzername = ""  # Die extern verwaltete User ID.
        self.vorname = ""  # Der Name des Benutzers.
        self.nachname = ""  # Der Name des Benutzers.
        self.email = ""  # Die E-Mail-Adresse des Benutzers.
        self.google_id = ""
        self.wg_id = None

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

    def get_google_id(self):
        return self.google_id

    def set_google_id(self, google_id):
        self.google_id = google_id

    def set_wg_id(self, wg_id):
        self.wg_id = wg_id

    def get_wg_id(self):
        return self.wg_id

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "User: {}, {}, {}, {}, {}, {}, {}".format(self.get_id(), self.benutzername, self.vorname, self.nachname,
                                                 self.email, self.google_id, self.wg_id)

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in einen User()."""
        pe = Person()
        pe.set_id(dictionary["id"])
        pe.set_benutzername(dictionary["userName"])
        pe.set_vorname(dictionary["firstName"])
        pe.set_nachname(dictionary["lastName"])
        pe.set_email(dictionary["email"])
        pe.set_google_id(dictionary["googleId"])
        pe.set_wg_id(dictionary["wgId"])
        return pe
