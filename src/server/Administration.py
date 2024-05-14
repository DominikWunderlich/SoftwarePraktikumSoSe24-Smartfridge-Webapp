from server.bo.WG import WG
from server.db.WGMapper import WGMapper
from server.bo.Person import Person
from server.db.PersonMapper import PersonMapper
from server.bo.Rezept import Rezept
from server.db.RezeptMapper import RezeptMapper
from server.db.LebensmittelMapper import LebensmittelMapper
from server.bo.Lebensmittel import Lebensmittel
from server.bo.Masseinheit import Masseinheit
from server.bo.mengenanzahl import Mengenanzahl
from server.db.MaßeinheitMapper import MasseinheitMapper
from server.db.mengenmapper import MengenanzahlMapper
from server.bo.Kuehlschrank import Kuehlschrank
from server.db.KuehlschrankMapper import KuehlschrankMapper
import time
from server.bo.RezeptEnthaeltLebensmittel import RezeptEnthaeltLebensmittel
from server.db.RezeptEnthaeltLebensmittelMapper import RezeptEnthaeltLebensmittelMapper

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

    # Diese Methode überprüft, ob die aktuelle user der Wg_ersteller ist
    # Sie wird in der Updatewg methode und deletewgMethode verwendet
    def is_current_user_wg_admin(self, email):
        with WGMapper() as mapper:
            # print("Email:", email)
            wgs = mapper.find_by_email(email)
            # print("wgs", wgs)

        for wg in wgs:
            # print(wg)
            if wg.get_wg_ersteller() == email:
                return True

            return False

    """ Diese Methode updated die Wg auf der wgPage"""
    def update_wg_by_email(self, new_wg):
        with WGMapper() as mapper:
            mapper.update(new_wg)
            # print("new Wg", new_wg)
            return new_wg

    def delete_wg_by_name(self, key):
        with WGMapper() as mapper:
            mapper.find_wg_admin_by_email(key)
            mapper.delete(key)

    def get_wg_admin(self, email):
        with WGMapper() as mapper:
            return mapper.find_wg_admin_by_email(email)

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

    def get_user_by_google_id(self, id):
        """ Auslesen einer Account-Instanz anhand der GoogleID. """
        with PersonMapper() as mapper:
            return mapper.find_by_google_id(id)

    def save_person(self, account):
        """ Update einer Person-Instanz. """
        with PersonMapper() as mapper:
            mapper.update(account)

    """ Rezept-spezifische Methoden """

    def create_rezept(self, rezept_name, anzahl_portionen, rezept_ersteller, wg_name):
        """ Erstellen einer Rezept-Instanz. """
        r = Rezept()
        r.set_rezept_name(rezept_name)
        r.set_anzahl_portionen(anzahl_portionen)
        r.set_rezept_ersteller(rezept_ersteller)
        r.set_id(1)
        r.set_wg_name(wg_name)

        with RezeptMapper() as mapper:
            return mapper.insert(r)

    def get_all_rezepte(self):
        with RezeptMapper() as mapper:
            return mapper.find_all()

    def get_all_rezepte_by_wg_name(self, wg_name):
        with RezeptMapper() as mapper:
            return mapper.find_all_by_wg_name(wg_name)

    def get_rezept_by_id(self, rezept_id):
        with RezeptMapper() as mapper:
            return mapper.find_by_rezept_id(rezept_id)

    """ Lebensmittel-spezifische Methoden """

    def create_menge(self, menge):
        # Erstellen eines Mengenobjekts. Dieses Objekt wird für die Erstellung eines
        # Lebensmitels benötigt.
        amount = Mengenanzahl()
        amount.set_menge(menge)
        amount.set_id(1)

        with MengenanzahlMapper() as mapper:
            return mapper.insert(amount)

    def create_measurement(self, name, faktor):
        """ Erstellen einer Maßeinheit.  """
        m = Masseinheit()
        m.set_masseinheit(name)
        m.set_umrechnungsfaktor(faktor)

        with MasseinheitMapper() as mapper:
            return mapper.insert(m)

    def create_lebensmittel(self, name, meinheit, menge):
        # Zuerst benötigen wir die zugehörige ID der Maßeinheit. "meinheit" stellt dabei die Eingabe
        # des Users dar (gr, kg, l, ...).
        time.sleep(3)
        with MasseinheitMapper() as mapper:
            m_id = mapper.find_by_name(meinheit)
            masseinheit_id = m_id.get_id()

        # Nun benötigen wir die ID der Menge. "menge" steht dabei für die Eingabe des Users (100, 1, 500, ...)
        with MengenanzahlMapper() as mmapper:
            mengen_id = mmapper.find_by_menge(menge)
            menge_id = mengen_id.get_id()

        # Jetzt haben wir alle Informationen im das Lebensmittel-Objekt korrekt zu erzeugen und in die DB zu speichern.
        food = Lebensmittel()
        food.set_id(1)
        food.set_lebensmittelname(name)
        food.set_masseinheit(masseinheit_id)
        food.set_mengenanzahl(menge_id)

        time.sleep(3)
        with LebensmittelMapper() as lmapper:
            return lmapper.insert(food)

    def get_lebensmittel_id_by_lebensmname_masseinhid_mengeid(self, name, meinheit, menge):
        # Zuerst benötigen wir die zugehörige ID der Maßeinheit. "meinheit" stellt dabei die Eingabe
        # des Users dar (gr, kg, l, ...).
        time.sleep(3)
        with MasseinheitMapper() as mapper:
            m_id = mapper.find_by_name(meinheit)
            masseinheit_id = m_id.get_id()

        #so bekomme ich die id von der Maßeinheit

        # Nun benötigen wir die ID der Menge. "menge" steht dabei für die Eingabe des Users (100, 1, 500, ...)
        with MengenanzahlMapper() as mmapper:
            mengen_id = mmapper.find_by_menge(menge)
            menge_id = mengen_id.get_id()

        #so bekomme ich die id von der Menge
        name=name
        #den namen hab ich schon, den namen gebe ich ja ein


        with LebensmittelMapper() as lmapper:
            l_id = lmapper.find_id_by_name_mengen_id_and_masseinheit_id(name, masseinheit_id, menge_id)
            return l_id

    #so bekomme ich die id von dem Lebensmittel

    #die id vom rezept bekomm ich ja im frontend schon, also hab ich schon

    #wenn ich die beiden hab kann ich folgende Methode aufrufen und damit ein lebensmittel zum rezept hinzufügen
    def add_lebensmittel_to_rezept(self, rezept_id, lebensmittel_name, masseinheit, menge):
        l_id = self.get_lebensmittel_id_by_lebensmname_masseinhid_mengeid(lebensmittel_name, masseinheit, menge)
        print("in der add_lebensmittel_to_rezept Methode")
        print(l_id)
        if l_id is not None:
            rezept_enthaelt_lebensmittel = RezeptEnthaeltLebensmittel()
            print(rezept_enthaelt_lebensmittel)
            rezept_enthaelt_lebensmittel.set_rezept_id(rezept_id)
            rezept_enthaelt_lebensmittel.set_lebensmittel_id(l_id)
            print(rezept_enthaelt_lebensmittel)
            print(rezept_enthaelt_lebensmittel.id)
            print(rezept_enthaelt_lebensmittel.rezept_id)
            print(rezept_enthaelt_lebensmittel.lebensmittel_id)

            with RezeptEnthaeltLebensmittelMapper() as mapper:
                return mapper.insert(rezept_enthaelt_lebensmittel)
        else:
            return None

    def create_and_add_lebensmittel_to_rezept(self, rezept_id, lebensmittel_name, masseinheit, menge):
        # Zuerst die Menge erstellen
        menge_id = self.create_menge(menge)
        print(f"das  hier!!!!!!!!!!!! {menge_id}")
        #Das menge_id ist False, wenns die menge schon gibt und None wenn sie neu ist

        if menge_id is not "halleluja":
            # Dann die Maßeinheit erstellen
            faktor = 1  # Hier kann ein Standardfaktor verwendet werden, da er in dieser Methode nicht spezifiziert wurde
            masseinheit_id = self.create_measurement(masseinheit, faktor)
            print(f"das  hier2!!!!!!!!!!!! {masseinheit_id}")

            if masseinheit_id is not "halleluja":
                lebensmittel_id = self.create_lebensmittel(lebensmittel_name, masseinheit, menge)
                print(f"das hier2,5!!!!!!!!!{lebensmittel_name}")
                print(f"das hier3!!!!!!!!!!!{lebensmittel_id}")
                # Lebensmittel erstellen und hinzufügen
                if lebensmittel_id is not "halleluja":
                    print("komm ich bis hier her? Zeile 253")
                    print(rezept_id)
                    print(lebensmittel_id)
                    print(lebensmittel_name)
                    print(masseinheit)
                    print(menge)
                    print("Zeile 259")
                    result = self.add_lebensmittel_to_rezept(rezept_id, lebensmittel_name, masseinheit, menge)
                    print("Admin.py Zeile 249")
                    print(rezept_id)
                    print(lebensmittel_name)
                    print(masseinheit)
                    print(menge)
                    print(result)
                    if result is not "halleluja":
                        print("Lebensmittel wurde erfolgreich zum Rezept hinzugefügt!")
                        return True
                else:
                    print("Fehler beim Hinzufügen des Lebensmittels zum Rezept.")
                    return False
            else:
                print("Fehler beim Erstellen der Maßeinheit.")
                return False
        else:
            print("Fehler beim Erstellen der Menge.")
            return False

    """Kuehlschrank-spezifische Methoden """

    def get_lebensmittel_by_kuehlschrank_id(self, kuehlschrank):
        with KuehlschrankMapper() as mapper:
            return mapper.find_lebensmittel_by_kuehlschrank_id(kuehlschrank)



