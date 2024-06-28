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
from server.db.KuehlschrankMapper import KuehlschrankMapper
import time

class Administration(object):
    def __init__(self):
        pass

    """ WG-spezifische Methoden """

    def create_wg(self, wg_name, wg_ersteller):
        """ Erstellen einer WG-Instanz. """
        self.initialize_units()
        w = WG()
        w.set_wg_name(wg_name)
        w.set_wg_ersteller(wg_ersteller)
        w.set_id(1)

        with WGMapper() as mapper:
            mapper.insert(w)
            wg_id = w.get_id()

        with KuehlschrankMapper() as mapper:
            mapper.create_kuehlschrank(wg_id)

        with PersonMapper() as mapper:
            wg_ersteller = w.get_wg_ersteller()
            mapper.insert_wg_id_to_wg_ersteller(wg_id, wg_ersteller)


    def get_wg_by_name(self, key):
        """ Auslesen einer WG Instanz nach Name """
        with WGMapper() as mapper:
            return mapper.find_by_key(key)

    def check_if_current_user_is_wg_admin(self, email, wg_id):
        with WGMapper() as mapper:
            is_admin = mapper.check_if_current_user_is_wg_admin_using_email_and_wg_id(email, wg_id)

            if is_admin:
                return True

            else:
                return False

    def get_wg_id_by_email(self, email):
        with PersonMapper() as mapper:
            wg_id = mapper.find_wg_id_by_email(email)
            return wg_id

    def get_wg_by_wg_id(self, wg_id):
        with WGMapper() as mapper:
            return mapper.find_wg_by_wg_id(wg_id)

    """ Diese Methode löscht die wg und den kuehlschrank"""
    def delete_wg(self, wg_id):
        with PersonMapper() as mapper:
            mapper.delete_all_wg_id_person(wg_id)

        with RezeptMapper() as rmapper:
            rezepte = rmapper.find_all_by_wg_id(wg_id)

            for rezept in rezepte:
                rezept.get_id()
                with LebensmittelMapper() as lmapper:
                    lmapper.delete_by_rezept_id(rezept.get_id())

                rmapper.delete(rezept.get_id())

        with LebensmittelMapper() as mapper:
            mapper.delete_by_kuehlschrank_id(wg_id)

        with KuehlschrankMapper() as mapper:
            mapper.delete(wg_id)

        with WGMapper() as mapper:
            mapper.delete_wg(wg_id)

    def get_wg_admin(self, wg_id):
        with WGMapper() as mapper:
            wg_admin = mapper.find_wg_admin_by_email(wg_id)

        with PersonMapper() as mapper:
            person = mapper.find_by_email(wg_admin[0].get_wg_ersteller())
            return person

    """ User Methoden """
    def create_user(self, email, username, firstname, lastname, googleid, wg_id):
        """ Erstellen des Objektes. """
        p = Person()
        p.set_email(email),
        p.set_benutzername(username),
        p.set_vorname(firstname),
        p.set_nachname(lastname),
        p.set_google_id(googleid),
        p.set_wg_id(wg_id)

        with PersonMapper() as mapper:
            if mapper.find_by_email(email):
                # Wenn es bereits ein Objekt in der DB gibt
                return
            else:
                return mapper.insert(p)

    def check_if_user_is_in_wg(self, googleid):
        """ Überprüfung, ob ein User bereits einer WG zugeordnet ist. """
        with PersonMapper() as mapper:
            person = mapper.find_by_google_id(googleid)

            if person.get_wg_id() is not None:
                return person
            else:
                return "Person noch keiner WG zugegörig"


    def get_user_by_google_id(self, id):
        """ Auslesen einer Account-Instanz anhand der GoogleID. """
        with PersonMapper() as mapper:
            return mapper.find_by_google_id(id)

    def save_person(self, account):
        """ Update einer Person-Instanz. """
        with PersonMapper() as mapper:
            mapper.update(account)

    def get_user_by_email(self, email):
        """ Auslesen einer Account-Instanz anhand der Email. """
        with PersonMapper() as mapper:
            return mapper.find_by_email(email)

    def delete_user(self, p):
        """ Löschen einer Person. """
        with PersonMapper() as mapper:
            mapper.delete(p)

    def delete_user_from_system(self, p):
        """
        Löschen einer Person und alle erstellten Rezepte. Wenn der User auch Admin einer WG ist,
        so wird auch diese gelöscht.
        """

        # Zuerst suchen wir alle Rezepte, welche die Person erstellt hat.
        recipe_list = self.find_all_rezepte_by_user(p)
        for recipe in recipe_list:
            self.delete_lebensmittel_by_recipe_id(recipe.get_id())

        # Alle angelegten Rezepte der Person löschen
        self.delete_rezepte(p.get_email())

        # Jetzt prüfen wir, ob die Person Admin einer WG ist.
        isadmin = self.check_if_current_user_is_wg_admin(p.get_email(), p.get_wg_id())
        if isadmin:
            # Wenn die Person ein Admin ist, wird die gesamte WG gelöscht.
            self.delete_wg(p.get_wg_id())

        # Zuletzt löschen wir auch noch die Person aus unserem System
        self.delete_user(p)

    """ Rezept-spezifische Methoden """

    def get_anzahl_portionen_of_recipe_by_rezept_id(self, rezept_id):
        with RezeptMapper() as mapper:
            alte_anzahl_portionen = mapper.find_anzahl_portionen_by_rezept_id(rezept_id)
            #In dieser Variablen wird die alte anzahl portionen des rezepts gespeichert
         
            print(alte_anzahl_portionen)
          
            return alte_anzahl_portionen
    def change_anzahl_portionen_in_rezept_tabelle(self, rezept_id, new_portionen):
        print(new_portionen)
        print(rezept_id)
        with RezeptMapper() as mapper:
            mapper.update_anzahl_portionen(rezept_id, new_portionen)
            return

    def get_alte_anzahl_portionen_und_change_to_neue_anzahl_portionen(self, rezept_id, new_portionen):
        # Alte Anzahl Portionen abrufen
        alte_anzahl_portionen = self.get_anzahl_portionen_of_recipe_by_rezept_id(rezept_id)

        # Anzahl Portionen aktualisieren
        self.change_anzahl_portionen_in_rezept_tabelle(rezept_id, new_portionen)

        # Neue Anzahl Portionen abrufen
        neue_anzahl_portionen = self.get_anzahl_portionen_of_recipe_by_rezept_id(rezept_id)

        # Rückgabe der alten und neuen Anzahl Portionen
        print(alte_anzahl_portionen)
        print(neue_anzahl_portionen)
        return alte_anzahl_portionen, neue_anzahl_portionen

    def get_alle_lebensmittel_by_rezept_id(self, rezept_id):
        lebensmittel = self.get_lebensmittel_by_rezept_id(rezept_id)
        print(lebensmittel)
        return lebensmittel

    # Diese Methode macht
    # 1. sie erhält die rezept_id und die neue anzahl Portionen
    # 2. Sie speichert den aktuellen anzahl_portionen Wert des rezepts in einer variablen
    # 3. sie ändert die Tabelle Rezept Spalte anzahl_portionen Wert auf den neuen, mitgegebenen
    # 4. Sie speichert den neuen anzahl_portionen Wert des rezepts in einer variablen
    # 5. Sie macht eine DB abfrage und erhält alle Einträge aus der Lebensmittel Tabelle die eine
    #   bestimmte rezept_id haben als liste
    # 6. für jedes Listenobjekt wird die mengenanzahl des Lebensmittels ermittelt
    #   und so der neue mengenwert berechnet: neue_menge = (alte_menge / alte_anzahl_portionen) * neue_anzahl_portionen
    # 7. dann wird die create_menge Methode benutzt
    # 8. dann wird die update_menge_in_lebensmittel_in_rezept Methode benutzt um in der Tabelle
    #   Lebensmittel die Spalte mengenanzahl_id zu updaten

    def berechne_neuen_mengen_wert(self, rezept_id, new_portionen):
        alte_anzahl_portionen = self.get_anzahl_portionen_of_recipe_by_rezept_id(rezept_id)

        # Konvertiere alte_anzahl_portionen und new_portionen in numerische Typen
        alte_anzahl_portionen = float(alte_anzahl_portionen)
        new_portionen = float(new_portionen)

        # Anzahl Portionen aktualisieren
        self.change_anzahl_portionen_in_rezept_tabelle(rezept_id, new_portionen)

        # Neue Anzahl Portionen abrufen
        neue_anzahl_portionen = self.get_anzahl_portionen_of_recipe_by_rezept_id(rezept_id)

        # Konvertiere neue_anzahl_portionen in numerischen Typ
        neue_anzahl_portionen = float(neue_anzahl_portionen)

        # Rückgabe der alten und neuen Anzahl Portionen
        print(alte_anzahl_portionen)
        print(neue_anzahl_portionen)

        # Alle Lebensmittel für das Rezept abrufen
        lebensmittel_list = self.get_alle_lebensmittel_by_rezept_id(rezept_id)

        for lebensmittel in lebensmittel_list:
            alte_menge = lebensmittel.get_mengenanzahl()
            print(alte_menge)
            print(alte_anzahl_portionen)
            print(neue_anzahl_portionen)
            neue_menge = (alte_menge / alte_anzahl_portionen) * neue_anzahl_portionen
            print(neue_menge)
            neue_menge_obj = self.create_menge2(neue_menge)
            print(neue_menge_obj) 
            self.update_menge_in_lebensmittel_in_rezept(lebensmittel, neue_menge_obj)


        return alte_anzahl_portionen, neue_anzahl_portionen

    def update_menge_in_lebensmittel_in_rezept(self, lebensmittel, neue_menge):
        print(neue_menge) #hier steht die id von der neuen menge
        print(lebensmittel)
        print(lebensmittel.get_id())
        with LebensmittelMapper() as mapper:
            mapper.update_menge(lebensmittel, neue_menge)

    def create_rezept(self, rezept_name, anzahl_portionen, rezept_ersteller, wg_id, rezept_anleitung):
        """ Erstellen einer Rezept-Instanz. """
        r = Rezept()
        r.set_rezept_name(rezept_name)
        r.set_anzahl_portionen(anzahl_portionen)
        r.set_rezept_ersteller(rezept_ersteller)
        r.set_id(1)
        r.set_wg_id(wg_id)
        r.set_rezept_anleitung(rezept_anleitung)

        with RezeptMapper() as mapper:
            return mapper.insert(r)

    def get_all_rezepte(self):
        with RezeptMapper() as mapper:
            return mapper.find_all()

    def save_rezept(self, rezept):
        with RezeptMapper() as mapper:
            return mapper.update(rezept)

    def get_all_rezepte_by_wg_id(self, wg_id):
        with RezeptMapper() as mapper:
            return mapper.find_all_by_wg_id(wg_id)

    def get_rezept_by_id(self, rezept_id):
        with RezeptMapper() as mapper:
            return mapper.find_by_rezept_id(rezept_id)

    def find_all_rezepte_by_user(self, p):
        """ Auslesen aller Rezepte, die eine Person erstellt hat. """
        with RezeptMapper() as mapper:
            return mapper.find_by_key(p)

    def delete_rezepte(self, email):
        """ Löschen von Rezepten basierend auf der E-Mail des Erstellers. """
        with RezeptMapper() as mapper:
            return mapper.delete_by_email(email)

    """Rezept löschen"""
  # Diese Methode überprüft, ob die aktuelle user der Wg_ersteller ist
    # Sie wird in der Updatewg methode und deletewgMethode verwendet
    def is_current_user_rezept_admin(self, email, rezept_id):
        with RezeptMapper() as mapper:
            rzt = mapper.find_rezept_admin_by_email(email, rezept_id)

        for rz in rzt:
            if rz.get_rezept_ersteller() == email:
                return True

            return False

    def check_if_current_user_is_rerzept_admin(self, email, rezept_id):
        with RezeptMapper() as mapper:
            is_admin = mapper.check_if_current_user_is_rezept_admin_using_email_and_wg_id(email, rezept_id)

            if is_admin:
                return True

            else:
                return False

    def delete_lebensmittel_by_recipe_id(self, recipe_id):
        """ Löschen eines Lebensmittels anhand der Rezept-ID. """
        with LebensmittelMapper() as mapper:
            mapper.delete_by_rezept_id(recipe_id)


    def delete_rezept_by_id(self, rezept_id):
        with LebensmittelMapper() as mapper:
            mapper.delete_by_rezept_id(rezept_id)

        with RezeptMapper() as mapper:
            return mapper.delete(rezept_id)

    """ Lebensmittel-spezifische Methoden """

    def create_menge(self, menge):
        # Erstellen eines Mengenobjekts. Dieses Objekt wird für die Erstellung eines
        # Lebensmitels benötigt.
        amount = Mengenanzahl()
        amount.set_menge(menge)
        amount.set_id(1)

        with MengenanzahlMapper() as mapper:
            return mapper.insert(amount)

    def create_menge2(self, menge):
        # Erstellen eines Mengenobjekts. Dieses Objekt wird für die Erstellung eines
        # Lebensmitels benötigt.
        amount = Mengenanzahl()
        amount.set_menge(menge)
        amount.set_id(1)

        with MengenanzahlMapper() as mapper:
            return mapper.insert2(amount)

    def create_menge_and_return_id(self, menge):
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

    def initialize_units(self):
        with MasseinheitMapper() as mapper:
            is_dict = mapper.find_all()
            if is_dict:
                return is_dict

            conversion_factors = {
                'liter': 1000,
                'kilogramm': 1000,
                'gramm': 1,
                'l': 1000,
                'milliliter': 1,
                'ml': 1,
                'kg': 1000,
                'gr': 1,
                'unzen': 28.3495,
                'oz': 3495,
                'pfund': 453.592,
                'lb': 453.592
            }

            for key, value in conversion_factors.items():
                m = Masseinheit()
                m.set_id(1)
                m.set_masseinheit(key)
                m.set_umrechnungsfaktor(value)

                with MasseinheitMapper() as mmapper:
                    mmapper.insert(m)

    def build_unit_dict(self):
        # Zuerst holen wir uns alle vorhandenen Maßeinheiten
        with MasseinheitMapper() as mapper:
            objs = mapper.find_all() # Liste mit Maßeinheiten
            print(objs)

        conversion_factors = {}
        for unit in objs:
            u = unit.get_masseinheit()
            factor = unit.get_umrechnungsfaktor()
            conversion_factors[u] = float(factor)

        return conversion_factors  # Dict mit Key-Value paaren aus DB


    """Auslesen aller Masseinheiten """

    def getMasseinheitAll(self):
        with MasseinheitMapper() as mapper:
            return mapper.find_all()

    def create_lebensmittel(self, name, meinheit, menge, kuehlschrank_id, rezept_id):
        """ Erstellen eines Lebensmittels, das noch nicht im System existiert. """
        # Zuerst benötigen wir die zugehörige ID der Maßeinheit. "meinheit" stellt dabei die Eingabe
        # des Users dar (gr, kg, l, ...).
        print(f"name = {name}")
        print(f"name = {meinheit}")
        print(f"name = {menge}")
        print(f"name = {kuehlschrank_id}")
        print(f"name = {rezept_id}")
        with MasseinheitMapper() as mapper:
            m_id = mapper.find_by_name(meinheit)

            if m_id is None:
                masseinheit_id = self.create_measurement(meinheit, 0)
            else:
                masseinheit_id = m_id.get_id()

        # Nun benötigen wir die ID der Menge. "menge" steht dabei für die Eingabe des Users (100, 1, 500, ...)
        with MengenanzahlMapper() as mmapper:
            mengen_id = mmapper.find_by_menge(menge)
            if mengen_id is None:
                mengen_id = self.create_menge(menge)
            else:
                mengen_id = mengen_id.get_id()


        # Jetzt haben wir alle Informationen im das Lebensmittel-Objekt korrekt zu erzeugen und in die DB zu speichern.
        food = Lebensmittel()
        # Hier wird die Lebensmittel_id auf 1 gesetzt
        food.set_id(1)
        food.set_lebensmittelname(name)
        food.set_masseinheit(masseinheit_id)
        food.set_mengenanzahl(mengen_id)
        food.set_kuelschrank_id(kuehlschrank_id)
        food.set_rezept_id(rezept_id)


        print(f" Das ist das erstellte Lebensmittel: {food}")

        time.sleep(1)
        with LebensmittelMapper() as lmapper:
            return lmapper.insert(food)

    """ Diese Methode updated vorhandene Lebensmittel im Kuehlschrank, wenn die Menge geändert wird """
    def update_lebensmittel(self, name, meinheit, menge, kuehlschrank_id, rezept_id):
        # Zuerst benötigen wir die zugehörige ID der Maßeinheit. "meinheit" stellt dabei die Eingabe
        # des Users dar (gr, kg, l, ...).
        print(f"name = {name}")
        print(f"name = {meinheit}")
        print(f"name = {menge}")
        print(f"name = {kuehlschrank_id}")
        print(f"name = {rezept_id}")
        with MasseinheitMapper() as mapper:
            m_id = mapper.find_by_name(meinheit)

            if m_id is None:
                masseinheit_id = self.create_measurement(meinheit, 0)
            else:
                masseinheit_id = m_id.get_id()

        # Nun benötigen wir die ID der Menge. "menge" steht dabei für die Eingabe des Users (100, 1, 500, ...)
        with MengenanzahlMapper() as mmapper:
            mengen_id = mmapper.find_by_menge(menge)
            if mengen_id is None:
                mengen_id = self.create_menge(menge)
            else:
                mengen_id = mengen_id.get_id()


        # Jetzt haben wir alle Informationen im das Lebensmittel-Objekt korrekt zu erzeugen und in die DB zu speichern.
        food = Lebensmittel()
        # Hier wird die Lebensmittel_id auf 1 gesetzt
        food.set_id(1)
        food.set_lebensmittelname(name)
        food.set_masseinheit(masseinheit_id)
        food.set_mengenanzahl(mengen_id)
        food.set_kuelschrank_id(kuehlschrank_id)
        food.set_rezept_id(rezept_id)


        print(f" Das ist das erstellte Lebensmittel: {food}")

        time.sleep(1)
        with LebensmittelMapper() as lmapper:
            return lmapper.update(food)
    def update_lebensmittel2(self, name, meinheit, menge, kuehlschrank_id, rezept_id):
        """ Erstellen eines Lebensmittels, das noch nicht im System existiert. """
        # Zuerst benötigen wir die zugehörige ID der Maßeinheit. "meinheit" stellt dabei die Eingabe
        # des Users dar (gr, kg, l, ...).
        print(f"name = {name}")
        print(f"name = {meinheit}")
        print(f"name = {menge}")
        print(f"name = {kuehlschrank_id}")
        print(f"name = {rezept_id}")
        with MasseinheitMapper() as mapper:
            m_id = mapper.find_by_name(meinheit)

            if m_id is None:
                masseinheit_id = self.create_measurement(meinheit, 0)
            else:
                masseinheit_id = m_id.get_id()

        # Nun benötigen wir die ID der Menge. "menge" steht dabei für die Eingabe des Users (100, 1, 500, ...)
        with MengenanzahlMapper() as mmapper:
            mengen_id = mmapper.find_by_menge(menge)
            if mengen_id is None:
                mengen_id = self.create_menge(menge)
            else:
                mengen_id = mengen_id.get_id()


        # Jetzt haben wir alle Informationen im das Lebensmittel-Objekt korrekt zu erzeugen und in die DB zu speichern.
        food = Lebensmittel()
        # Hier wird die Lebensmittel_id auf 1 gesetzt
        food.set_id(1)
        food.set_lebensmittelname(name)
        food.set_masseinheit(masseinheit_id)
        food.set_mengenanzahl(mengen_id)
        food.set_kuelschrank_id(kuehlschrank_id)
        food.set_rezept_id(rezept_id)


        print(f" Das ist das erstellte Lebensmittel: {food}")

        time.sleep(1)
        with LebensmittelMapper() as lmapper:
            return lmapper.update3(food)

    def find_foodobj(self, lebensmittel_id):
        with LebensmittelMapper() as mapper:
            obj = mapper.find_by_id(lebensmittel_id)
            obj_name = obj.get_lebensmittelname()
            return obj_name

    def update_lebensmittel_obj(self, name, meinheit, menge, kuehlschrank_id, rezept_id, old_food_id):

        with MasseinheitMapper() as mapper:
            m_id = mapper.find_by_name(meinheit)

            if m_id is None:
                masseinheit_id = self.create_measurement(meinheit, 0)
            else:
                masseinheit_id = m_id.get_id()

        # Nun benötigen wir die ID der Menge. "menge" steht dabei für die Eingabe des Users (100, 1, 500, ...)
        with MengenanzahlMapper() as mmapper:
            mengen_id = mmapper.find_by_menge(menge)
            if mengen_id is None:
                mengen_id = self.create_menge(menge)
            else:
                mengen_id = mengen_id.get_id()


        # Jetzt haben wir alle Informationen im das Lebensmittel-Objekt korrekt zu erzeugen und in die DB zu speichern.
        food = Lebensmittel()
        # Hier wird die Lebensmittel_id auf 1 gesetzt
        food.set_id(1)
        food.set_lebensmittelname(name)
        food.set_masseinheit(masseinheit_id)
        food.set_mengenanzahl(mengen_id)
        food.set_kuelschrank_id(kuehlschrank_id)
        food.set_rezept_id(rezept_id)

        time.sleep(1)
        with LebensmittelMapper() as lmapper:
            return lmapper.update_foodobj(food, old_food_id)

    def update_lebensmittel_objekt(self, name, meinheit, menge, kuehlschrank_id, rezept_id, old_food_id):

        with MasseinheitMapper() as mapper:
            m_id = mapper.find_by_name(meinheit)

            if m_id is None:
                masseinheit_id = self.create_measurement(meinheit, 0)
            else:
                masseinheit_id = m_id.get_id()

        # Nun benötigen wir die ID der Menge. "menge" steht dabei für die Eingabe des Users (100, 1, 500, ...)
        with MengenanzahlMapper() as mmapper:
            mengen_id = mmapper.find_by_menge(menge)
            if mengen_id is None:
                mengen_id = self.create_menge(menge)
            else:
                mengen_id = mengen_id.get_id()


        # Jetzt haben wir alle Informationen im das Lebensmittel-Objekt korrekt zu erzeugen und in die DB zu speichern.
        food = Lebensmittel()
        # Hier wird die Lebensmittel_id auf 1 gesetzt
        food.set_id(1)
        food.set_lebensmittelname(name)
        food.set_masseinheit(masseinheit_id)
        food.set_mengenanzahl(mengen_id)
        food.set_kuelschrank_id(kuehlschrank_id)
        food.set_rezept_id(rezept_id)

        time.sleep(1)
        with LebensmittelMapper() as lmapper:
            return lmapper.update_foodobj_rezept(food, old_food_id)


    def update_food_in_fridge(self, name, meinheit, menge, kuehlschrank_id, rezept_id):
        """ Diese Methode aktualisiert vorhandene Lebensmittel im Kühlschrank, wenn sich die Lebensmittelname, Menge, Masseinheit ändert. """
        # Zuerst suchen wir das Lebensmittel im Kühlschrank
        with LebensmittelMapper() as lmapper:
            existing_food = lmapper.find_by_name_and_fridge_id(name, kuehlschrank_id)

        if existing_food:
            # Das Lebensmittel existiert bereits im Kühlschrank, daher aktualisieren wir nur die Menge
            existing_food.set_mengenanzahl(menge)
            print(f"Die Menge von {name} im Kühlschrank wurde auf {menge} aktualisiert.")
            time.sleep(1)
            with LebensmittelMapper() as lmapper:
                return lmapper.update(existing_food)
        else:
            # Wenn das Lebensmittel nicht gefunden wurde, geben wir eine entsprechende Meldung aus
            print(f"{name} wurde nicht im Kühlschrank gefunden.")
            return None


    def create_lebensmittel_from_fridge(self, name, meinheit, menge, kuehlschrank_id, rezept_id):
        """ Erstellen eines Lebensmittels, das noch nicht im System existiert. """
        # Zuerst benötigen wir die zugehörige ID der Maßeinheit. "meinheit" stellt dabei die Eingabe
        # des Users dar (gr, kg, l, ...).
        print(f"name = {name}")
        print(f"name = {meinheit}")
        print(f"name = {menge}")
        print(f"name = {kuehlschrank_id}")
        print(f"name = {rezept_id}")
        with MasseinheitMapper() as mapper:
            m_id = mapper.find_by_name(meinheit)

            if m_id is None:
                masseinheit_id = self.create_measurement(meinheit, 0)
            else:
                masseinheit_id = m_id.get_id()
            print("Beende maßeinheitmapper")

        # Nun benötigen wir die ID der Menge. "menge" steht dabei für die Eingabe des Users (100, 1, 500, ...)
        with MengenanzahlMapper() as mmapper:
            mengen_id = mmapper.find_by_menge(menge)
            if mengen_id is None:
                mengen_id = self.create_menge(menge)
            else:
                mengen_id = mengen_id.get_id()

        # Jetzt haben wir alle Informationen im das Lebensmittel-Objekt korrekt zu erzeugen und in die DB zu speichern.
        food = Lebensmittel()
        # Hier wird die Lebensmittel_id auf 1 gesetzt
        food.set_id(1)
        food.set_lebensmittelname(name)
        food.set_masseinheit(masseinheit_id)
        food.set_mengenanzahl(mengen_id)
        food.set_kuelschrank_id(kuehlschrank_id)
        food.set_rezept_id(rezept_id)

        print(f" Das ist das erstellte Lebensmittel: {food}")

        time.sleep(1)
        return food


    def get_lebensmittel_by_lebensmittel_name(self, lebensmittel_name, kid):
        with LebensmittelMapper() as mapper:
            return mapper.find_by_lebensmittelname(lebensmittel_name, kid)

    def get_lebensmittel_by_lebensmittel_name2(self, lebensmittel_name, rid):
        with LebensmittelMapper() as mapper:
            return mapper.find_by_lebensmittelname2(lebensmittel_name, rid)

    def get_menge_by_id(self, mengen_id):
        with MengenanzahlMapper() as mapper:
            return mapper.find_by_key(mengen_id)

    def get_masseinheit_by_id(self, masseinheit_id):
        with MasseinheitMapper() as mapper:
            return mapper.find_by_key(masseinheit_id)

    def get_lebensmittel_by_rezept_id(self, rezept_id):
        with RezeptMapper() as mapper:
            return mapper.find_lebensmittel_by_rezept_id(rezept_id)

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


    """Auslesen aller Lebensmittel """
    def add_food_to_recipe(self, rezept_id, lebensmittel):  # Input = Karotte, 1, Kilogramm
        # Zuerst werden die zugehörigen Lebensmittel des Kühlschranks geholt.
        fridge = self.get_lebensmittel_by_rezept_id(rezept_id)  # Output: [(k_id/l_obj), (k_id2/l_obj2)]
        # Als nächstes prüfen wir ob der gesuchte Lebensmittelname bereits im rezept ist.

        # Auslesen der vorhanden Maßeinheiten inklusive ihrer Umrechnungsfaktoren.
        measurements = self.build_unit_dict()

        lebenmittel_name = lebensmittel.get_lebensmittelname()
        print("LName: ", lebenmittel_name)
        print("LName2: ", lebensmittel.get_lebensmittelname())

        names = []
        for elem in fridge:
            name = elem.get_lebensmittelname()
            names.append(name)

        if lebenmittel_name not in names:
            # Wenn das Lebensmittel NICHT im Rezept ist, dann wird es hier angelegt und hinzugefügt.
            self.create_lebensmittel(lebensmittel.get_lebensmittelname(),
                                     lebensmittel.get_masseinheit(),
                                     lebensmittel.get_mengenanzahl(),
                                     lebensmittel.get_kuehlschrank_id(),
                                     lebensmittel.get_rezept_id())

        else:
            # Wenn ein Lebensmittel bereits im rezept ist, erhöhen wir den Bestand

            # 1. Vorhandenes Lebensmittel mit dem gesuchten Namen auslesen.
            elem = self.get_lebensmittel_by_lebensmittel_name2(lebenmittel_name, rezept_id)

            # 2. Menge und Maßeinheit auslesen.
            quantity_obj = self.get_menge_by_id(elem[0].get_mengenanzahl())
            quantity = quantity_obj.get_menge()
            unit_obj = self.get_masseinheit_by_id(elem[0].get_masseinheit())
            unit = unit_obj.get_masseinheit()

            # 3. Lebensmittel updaten bzw. neu erstellen
            updated_food = elem[0].increase_food_quantity(lebensmittel.get_mengenanzahl(), lebensmittel.get_masseinheit(), quantity, unit, measurements)
            new_food_obj = self.update_lebensmittel2(updated_food.get_lebensmittelname(), updated_food.get_masseinheit(),
                                                    updated_food.get_mengenanzahl(), None, rezept_id)

            return new_food_obj
    def getAllLebensmittelangabe(self):
        with LebensmittelMapper() as mapper:
            return mapper.find_all()

    def get_lebensmittel_by_id(self, id):
        with LebensmittelMapper() as mapper:
            return mapper.find_by_id(id)

    """Kuehlschrank-spezifische Methoden """

    def find_kuehlschrank_id(self, email):
        with PersonMapper() as mapper:
            obj = mapper.find_wg_id_by_email(email)
            return obj

    def get_lebensmittel_by_kuehlschrank_id(self, kuehlschrank):
        with LebensmittelMapper() as mapper:
            return mapper.find_lebensmittel_by_kuehlschrank_id(kuehlschrank)

    def get_rezept_id_by_wg_id(self, wg_id):
        with RezeptMapper() as mapper:
            return mapper.find_all_by_wg_id(wg_id)

    def add_food_to_fridge(self, kuehlschrank_id, lebensmittel):  # Input = Karotte, 1, Kilogramm
        """
        Diese Methode stellt das hinzufügen von Lebensmitteln dar. Ausgangspunkt ist das befüllen des Kühl-/ Vorrats-
        schrankes.
        :param kuehlschrank_id: Ist die ID der WG / des dazugehörigen Kühlschranks.
        :param lebensmittel: Ist das Lebensmittel das hinzugefügt werden soll.
        """
        # Auslesen der vorhanden Maßeinheiten inklusive ihrer Umrechnungsfaktoren.
        measurements = self.build_unit_dict()
        # Zuerst werden die zugehörigen Lebensmittel des Kühlschranks geholt.
        fridge = self.get_lebensmittel_by_kuehlschrank_id(kuehlschrank_id)  # Output: [(k_id/l_obj), (k_id2/l_obj2)]

        # Als nächstes prüfen wir ob der gesuchte Lebensmittelname bereits im Vorratsschrank ist.
        lebenmittel_name = lebensmittel.get_lebensmittelname()

        names = []
        for elem in fridge:
            name = elem.get_lebensmittelname()
            names.append(name)

        if lebenmittel_name not in names:
            print("...starting add_food_to_fridge: if-Zweig")
            # Wenn das Lebensmittel NICHT im Kühlschrank ist, dann wird es hier angelegt und hinzugefügt.
            self.create_lebensmittel(lebensmittel.get_lebensmittelname(),
                                     lebensmittel.get_masseinheit(),
                                     lebensmittel.get_mengenanzahl(),
                                     lebensmittel.get_kuehlschrank_id(),
                                     lebensmittel.get_rezept_id())

        else:
            # Wenn ein Lebensmittel bereits im Kühlschrank ist, erhöhen wir den Bestand und fügen es dem Vorrats-
            # schrank hinzu.
            print("...starting add_food_to_fridge: else-Zweig")

            # 1. Vorhandenes Lebensmittel mit dem gesuchten Namen auslesen.
            elem = self.get_lebensmittel_by_lebensmittel_name(lebenmittel_name, kuehlschrank_id)

            # 2. Menge und Maßeinheit auslesen.
            quantity_obj = self.get_menge_by_id(elem[0].get_mengenanzahl())
            quantity = quantity_obj.get_menge()
            unit_obj = self.get_masseinheit_by_id(elem[0].get_masseinheit())
            unit = unit_obj.get_masseinheit()

            # 3. Lebensmittel updaten bzw. neu erstellen
            updated_food = elem[0].increase_food_quantity(lebensmittel.get_mengenanzahl(), lebensmittel.get_masseinheit(), quantity, unit, measurements)
            new_food_obj = self.update_lebensmittel(updated_food.get_lebensmittelname(), updated_food.get_masseinheit(),
                                                    updated_food.get_mengenanzahl(), kuehlschrank_id, None)

            return new_food_obj

    def remove_food_from_fridge_with_recipe(self, kuehlschrank_id, rezept_id):
        # Auslesen der vorhanden Maßeinheiten inklusive ihrer Umrechnungsfaktoren.
        measurements = self.build_unit_dict()
        # Zugehörige Lebensmittel des Kühlschranks finden
        print(f"...starting remove_food_from_fridge")
        fridge = self.get_lebensmittel_by_kuehlschrank_id(kuehlschrank_id)

        # Benötigte Lebensmittel aus dem Rezept entziehen
        required_lebensmittel = self.get_lebensmittel_by_rezept_id(rezept_id)
        print(f"Lebensmittel aus dem Rezept {required_lebensmittel}")

        # Leere shopping_list erstellen
        shopping_list = []
        # Leere Liste für Shopping_list erstellen, in welcher nur die positive Menge angezeigt wird
        shopping_list_with_correct_amounts = []

        # Leere Listen die mit den Tupeln gefüllt werden sollen, die entweder geupdated oder gelöscht werden sollen.
        fridge_updates = []
        fridge_deletions = []

        for elem in required_lebensmittel:
            food_exist = False
            required_amount = elem.get_mengenanzahl()
            required_unit = elem.get_masseinheit()
            print(f"required amount: {required_amount}")
            print(f"required unit: {required_unit}")
            for x in fridge:
                print("Lebensmittelname im Rezept", elem.get_lebensmittelname())
                print("Lebensmittelname im Kühlschrank", x.get_lebensmittelname())
                if elem.get_lebensmittelname() == x.get_lebensmittelname():
                    new_amount = x.decrease_food_quantity(required_amount, required_unit, measurements)
                    print(f"Das ist das Lebensmittel nach dem, die decrease-Methode angewandt wurde {new_amount}")

                    if new_amount.get_mengenanzahl() > 0:
                        print("if Pfad")
                        # Create new food objects with amount and update the kuehlschrankinhalt
                        # Lebensmittel_id im Kühschhrank finden um, dann mit einem neuen zu ersetzen
                        old_food_id = x.get_id()

                        # Neues lebensmittelobjekt mit neuer menge erstellen
                        new_food_obj = self.create_lebensmittel_from_fridge(new_amount.get_lebensmittelname(),
                                                                            new_amount.get_masseinheit(),
                                                                            new_amount.get_mengenanzahl(),
                                                                            new_amount.get_kuehlschrank_id(),
                                                                            new_amount.get_rezept_id())

                        print(f"Das ist new_food_obj nach dem erfolgreichen Decrease {new_food_obj}")
                        # Lebensmittel id vom neuen Lebensmittelobjekt ausgeben
                        fridge_updates.append(new_food_obj)

                    elif new_amount.get_mengenanzahl() == 0:
                        # DELETE Lebensmittel aus kuehlschrankinhalt where Menge nach Decrease == 0
                        print("elif1 pfad")
                        # Lebensmittel aus dem kühlschrank löschen, da die Menge 0 ist
                        print(f" Das Lebesnmittel hat nach dem Decrease die menge 0 {x}")
                        delete_food_id = x.get_id()
                        print(f"Die ID des zu entfernenden lebensmittels {delete_food_id}")
                        fridge_deletions.append((kuehlschrank_id, delete_food_id))

                    elif new_amount.get_mengenanzahl() < 0:
                        # Wenn die Menge nach dem Decrease < 0 ist, dann soll das Lebensmittel als einkaufsliste ausgegeben werden
                        print(f"Du musss dieses Lebensmittel einkaufen elif pfad {new_amount}")
                        # Das Lebensmittel an die Shopponglist anhängen
                        shopping_list.append(new_amount)
                        print(f"Das ist die shopping Liste {new_amount}")

                    food_exist = True
                    break

                # wenn dieses Lebensmittel nicht im Kühlschrank
            if not food_exist:
                print(f"Du muss dieses Lebensmittel noch einkaufen letzer else Pfad {elem}")
                # Das Lebensmittel an die Shopping_list hinzufügen
                shopping_list.append(elem)

        # Shopping List inklusive Minus Werte für die Menge
        print(f"Das ist die Shoppinglist mit Minus Werten {shopping_list}")

        # Shopping List Minus Werte mittels python abs() function in positive Werte umwandeln
        for lebensmittel in shopping_list:
            positive_amount = abs(lebensmittel.get_mengenanzahl())
            lebensmittel.set_mengenanzahl(positive_amount)
            shopping_list_with_correct_amounts.append(lebensmittel)

        print(f"Das ist die Shoppinglist mit Plus Werten {shopping_list_with_correct_amounts}")

        # Wir updaten die Lebensmittel im Kühlschrank nur wenn wir alle Lebensmittel vorrätig haben.
        if not shopping_list:
            with LebensmittelMapper() as mapper:
                for obj in fridge_updates:
                    mapper.update(obj)

                for kuehlschrank_id, delete_food_id in fridge_deletions:
                    print(f"Deleting: kuehlschrank_id={kuehlschrank_id}, delete_food_id={delete_food_id}")
                    mapper.delete(delete_food_id, kuehlschrank_id)

        return shopping_list_with_correct_amounts

    """ Diese Methode ermöglicht das direkte Löschen eines Lebensmittels aus dem Kuehlschrank"""
    def remove_food_from_fridge(self, kuehlschrank_id, lebensmittel_id):
        with LebensmittelMapper() as mapper:
            mapper.delete_from_fridge(kuehlschrank_id, lebensmittel_id)

    def remove_food_from_rezept(self, rezept_id, lebensmittel_id):
        with KuehlschrankMapper() as mapper:
            mapper.delete_with_rezept_id(rezept_id, lebensmittel_id)

    def get_lebensmittel_by_rezept_id2(self, rezept):
        with LebensmittelMapper() as mapper:
            return mapper.find_by_key(rezept)

    def find_verfuegbare_rezepte(self, wg_id, kuehlschrank_id):
        measurements = self.build_unit_dict()
        food_id_in_fridge = set()  # Set für die Lebensmittel im Kühlschrank
        rezept_set = set()  # Set für alle Rezepte die gekocht werden können

        # Lebensmittel_id aus einem Kühlschrank in ein Set speichern
        fridge = self.get_lebensmittel_by_kuehlschrank_id(kuehlschrank_id)
        for f_elem in fridge:
            food_id_in_fridge.add(f_elem.get_id())
        print("Kühsclhrank Lebensmittel", food_id_in_fridge)

        # Rezept_id aus einer WG in eine Liste speichern
        recipes_id = self.get_rezept_id_by_wg_id(wg_id)

        # Für jede Rezept_ID die Lebensmittel ausgeben
        for rezept in recipes_id:
            lebensmittel_by_rezept_liste = self.get_lebensmittel_by_rezept_id2(rezept.get_id())
            # Lebensmittel eines Rezepts in eine Liste speichern
            can_cook = True
            for elem in lebensmittel_by_rezept_liste:
                rezept_required_amount = elem.get_mengenanzahl()
                rezept_required_unit = elem.get_masseinheit()

                for x in fridge:
                    if elem.get_lebensmittelname() == x.get_lebensmittelname():
                        new_amount = x.decrease_food_quantity(rezept_required_amount, rezept_required_unit, measurements)
                        # decrease Funktion um Differenz der Menge aus Kühlschrank und Rezept zu berechnen

                        if new_amount.get_mengenanzahl() < 0:
                            can_cook = False
                        break
                else:
                    can_cook = False

                if not can_cook:
                    break

            if can_cook:
                rezept_set.add(rezept.get_id())
        rezept_liste = list(rezept_set)
        # Set wird in Liste umgewandelt (könnte man eig auch direkt als Liste machen lol)
        ganze_rezepte = []
        for rezept in rezept_liste:
            x = self.get_rezepte_by_rezept_id(rezept)
            # durch die Methode wird für x das ganze RezeptObjekt gespeichert
            ganze_rezepte.append(x)

        return ganze_rezepte

    def get_rezepte_by_rezept_id(self, rezept_id):
        with RezeptMapper() as mapper:
            return mapper.find_by_rezept_id2(rezept_id)


    def find_person_by_wg_bewohner(self, wg_id, wg_ersteller):
        with PersonMapper() as mapper:
            return mapper.find_all_by_wg_id(wg_id, wg_ersteller)

    def add_person_to_wg(self, wg_id, email):
        # Es wird geprüft, ob die Person bereits in einer WG ist.
        # Falls nicht, kann die Person einer anderen WG hinzugefügt werden.
        with PersonMapper() as mapper:
            WgId = mapper.find_wg_id_by_email(email)

            if not WgId:
                with PersonMapper() as mapper2:
                    return mapper2.update_wg_id_person(wg_id, email)
            else:
                pass

    def delete_person_from_wg(self, wg_id, person_id):
        with PersonMapper() as mapper:
            ersteller_mail = mapper.find_email_by_person_id(person_id)

        with RezeptMapper() as mapper:
            rezept_id = mapper.find_rezept_id_by_ersteller(ersteller_mail)

        if rezept_id is None:
            pass
        else:
            with LebensmittelMapper() as mapper:
                mapper.delete_by_rezept_id(rezept_id)

            with RezeptMapper() as mapper:
                mapper.delete(rezept_id)

        with PersonMapper() as mapper:
            return mapper.delete_wg_id_person(wg_id, person_id)
