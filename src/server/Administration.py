from server.bo.WG import WG
from server.db.WGMapper import WGMapper
from server.bo.Person import Person
from server.db.PersonMapper import PersonMapper
from server.bo.Rezept import Rezept
from server.db.RezeptMapper import RezeptMapper
from server.db.LebensmittelMapper import LebensmittelMapper

class Administration(object):
    def __init__(self):
        pass

    """ WG-spezifische Methoden """

    def create_wg(self, wg_name, wg_bewohner, wg_ersteller):
        """ Erstellen einer WG-Instanz. """
        print(f"DEBUG IN create_wg in admin.py wg_name = {wg_name}, wg_bewohner={wg_bewohner}, wg_ersteller={wg_ersteller}")
        w = WG()
        w.set_wg_name(wg_name)
        w.set_wg_bewohner(wg_bewohner)
        w.set_wg_ersteller(wg_ersteller)
        w.set_id(1)

        with WGMapper() as mapper:
            return mapper.insert(w)

    def get_wg_by_name(self, key):
        """ Auslesen einer WG Instanz nach Name """
        with WGMapper() as mapper:
            return mapper.find_by_key(key)

    def getWGByEmail(self, email):
        with WGMapper() as mapper:
            return mapper.find_by_email(email)

    """ Diese Methode updated die Wg auf der wgPage"""
    """ Die Wg muss nicht nochmal anhand der email ausgegeben werden, da sie bereits in der anderen Methode"""
    def update_wg_by_email(self, new_wg):
        with WGMapper() as mapper:
            mapper.update(new_wg)
            return new_wg

    def delete_wg_by_name(self, key):
        with WGMapper() as mapper:
            return mapper.delete(key)

    """ User Methoden """
    def create_user(self, email, username, firstname, lastname, googleid):
        """ Erstellen des Objektes. """
        p = Person()
        p.set_email(email),
        p.set_benutzername(username),
        p.set_vorname(firstname),
        p.set_nachname(lastname),
        p.set_google_id(googleid)

        with PersonMapper() as mapper:
            if mapper.find_by_email(email):
                # Wenn es bereits ein Objekt in der DB gibt
                return
            else:
                return mapper.insert(p)

    def redirect_user(self, googleid):
        """ Auslesen einer Person-Instanz anhand der Google ID. """
        with PersonMapper() as mapper:
            p = mapper.find_by_google_id(googleid)
        p_email = p.get_email()

        """ Check ob die Person bereits in einer WG ist. """
        with WGMapper() as wgmapper:
            res = wgmapper.find_by_email(p_email)
            if res is not None:
                return res
            else:
                return




    """ Rezept-spezifische Methoden """

    def create_rezept(self, rezept_name, anzahl_portionen, rezept_ersteller):
        """ Erstellen einer Rezept-Instanz. """
        r = Rezept()
        r.set_rezept_name(rezept_name)
        r.set_anzahl_portionen(anzahl_portionen)
        r.set_rezept_ersteller(rezept_ersteller)
        r.set_id(1)

        with RezeptMapper() as mapper:
            return mapper.insert(r)

    def get_all_rezepte(self):
        with RezeptMapper() as mapper:
            return mapper.find_all()


    """ Rezept-spezifische Methoden """


    def create_lebensmittel(self, lebensmittelname, aggregatszustand):
        """ Lebensmittel hinterlegen """
        lm = lebensmittelname()
        lm.set_lebensmittelname(lebensmittelname)
        lm.set_aggregatszustand(aggregatszustand)
        lm.set_id(1)

        with LebensmittelMapper() as mapper:
            return mapper.insert(lm)