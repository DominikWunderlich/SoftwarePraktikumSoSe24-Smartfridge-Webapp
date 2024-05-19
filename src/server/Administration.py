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


    """Auslesen aller Masseinheiten """

    def getMasseinheitAll(self):
        with MasseinheitMapper() as mapper:
            return mapper.find_all()

    def create_lebensmittel(self, name, meinheit, menge):
        """ Erstellen eines Lebensmittels, das noch nicht im System existiert. """
        # Zuerst benötigen wir die zugehörige ID der Maßeinheit. "meinheit" stellt dabei die Eingabe
        # des Users dar (gr, kg, l, ...).
        time.sleep(3)
        print(f"name = {name}")
        print(f"name = {meinheit}")
        print(f"name = {menge}")
        with MasseinheitMapper() as mapper:
            m_id = mapper.find_by_name(meinheit)
            masseinheit_id = m_id.get_id()
            print("Beende maßeinheitmapper")

        # Nun benötigen wir die ID der Menge. "menge" steht dabei für die Eingabe des Users (100, 1, 500, ...)
        with MengenanzahlMapper() as mmapper:
            mengen_id = mmapper.find_by_menge(menge)
            print(F" Mengen_id {mengen_id}")
            menge_id = mengen_id.get_id()

            print("Beende mengenmapper")

        # Jetzt haben wir alle Informationen im das Lebensmittel-Objekt korrekt zu erzeugen und in die DB zu speichern.
        food = Lebensmittel()
        # Hier wird die Lebensmittel_id auf 1 gesetzt
        food.set_id(1)
        food.set_lebensmittelname(name)
        food.set_masseinheit(masseinheit_id)
        food.set_mengenanzahl(menge_id)

        print(f" Das ist das erstellte Lebensmittel: {food}")

        time.sleep(3)
        with LebensmittelMapper() as lmapper:
            return lmapper.insert(food)

    def create_lebensmittel_from_fridge(self, name, meinheit, menge):
        """ Erstellen eines Lebensmittels, das noch nicht im System existiert. """
        # Zuerst benötigen wir die zugehörige ID der Maßeinheit. "meinheit" stellt dabei die Eingabe
        # des Users dar (gr, kg, l, ...).
        print(f"name = {name}")
        print(f"name = {meinheit}")
        print(f"name = {menge}")
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
                self.create_menge(menge)
            else:
                menge_id = mengen_id.get_id()

        with MengenanzahlMapper() as m2mapper:
            amenge = m2mapper.find_by_menge(menge)
            menge_id = amenge.get_id()

            print("Beende mengenmapper")

        # Jetzt haben wir alle Informationen im das Lebensmittel-Objekt korrekt zu erzeugen und in die DB zu speichern.
        food = Lebensmittel()
        # Hier wird die Lebensmittel_id auf 1 gesetzt
        food.set_id(1)
        food.set_lebensmittelname(name)
        food.set_masseinheit(masseinheit_id)
        food.set_mengenanzahl(menge_id)

        print(f" Das ist das erstellte Lebensmittel: {food}")

        time.sleep(3)
        with LebensmittelMapper() as lmapper:
            lmapper.insert(food)
            print(f" Das ist 'food' vor dem return im create_lebensmittel_from_fridge: {food} .")
            return food


    def get_lebensmittel_by_lebensmittel_name(self, lebensmittel_name):
        with LebensmittelMapper() as mapper:
            return mapper.find_by_lebensmittelname(lebensmittel_name)

    def get_menge_by_id(self, mengen_id):
        with MengenanzahlMapper() as mapper:
            return mapper.find_by_key(mengen_id)

    def get_masseinheit_by_id(self, masseinheit_id):
        with MasseinheitMapper() as mapper:
            return mapper.find_by_key(masseinheit_id)

    def get_lebensmittel_by_rezept_id(self, rezept_id):
        with RezeptEnthaeltLebensmittelMapper() as mapper:
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


    """Auslesen aller Lebensmittel """

    def getAllLebensmittelangabe(self):
        with LebensmittelMapper() as mapper:
            return mapper.find_all()


    def get_lebensmittel_by_id(self, id):
        with LebensmittelMapper() as mapper:
            return mapper.find_by_id(id)


    """Kuehlschrank-spezifische Methoden """

    def get_lebensmittel_by_kuehlschrank_id(self, kuehlschrank):
        with KuehlschrankMapper() as mapper:
            return mapper.find_lebensmittel_by_kuehlschrank_id(kuehlschrank)

    def find_common_objects(self, elem, kuehlschrank_inhalt):
        common_objects = []

        for item in kuehlschrank_inhalt:
            item_id = item.get_id()

            for obj in elem:
                if obj.get_id() == item_id:
                    common_objects.append(obj)
                    break

        return common_objects

    def add_food_to_fridge(self, kuehlschrank_id, lebensmittel): # lebensmittel = Karotte, 1, Kilogramm
        # Zugehörige Lebensmittel des Kühlschranks finden
        fridge = self.get_lebensmittel_by_kuehlschrank_id(kuehlschrank_id) # Output: [(k_id/l_obj), (k_id/L-obj2)]

        # Idee: prüfen ob Lebensmittelname bereits im fridge liegt
        lebenmittel_name = lebensmittel.get_lebensmittelname()
        # TODO: Handling, wenn der Kühlschrankinhalt leer ist
        names = []
        for elem in fridge:
            name = elem.get_lebensmittelname()
            names.append(name)

        if lebenmittel_name not in names:
            print("...starting add_food_to_fridge: if-Zweig")
            # Wenn das Lebensmittel NICHT im Kühlschrank ist, dann geht es hier weiter
            self.create_measurement(lebensmittel.get_masseinheit(), 0)
            self.create_menge(lebensmittel.get_mengenanzahl())
            print(f"{lebensmittel.get_lebensmittelname()} , {lebensmittel.get_masseinheit()}, {lebensmittel.get_mengenanzahl()}")
            created_lebensmittel = self.create_lebensmittel(lebensmittel.get_lebensmittelname(),
                                                            lebensmittel.get_masseinheit(),
                                                            lebensmittel.get_mengenanzahl())
            print(f"Das ist das erstellte Lebensmittel in add_food: {created_lebensmittel}")
            with KuehlschrankMapper() as mapper:
                print(F"Lebensmittel id in admin: {created_lebensmittel.get_id()} {created_lebensmittel.get_lebensmittelname()}")
                mapper.insert(kuehlschrank_id, created_lebensmittel)

        else:
            # Wenn ein Lebensmittel im Kühlschrank ist, sind wir im Else-Zweig
            print("...starting add_food_to_fridge: else-Zweig")
            # 1. find all lebensmittel with the given name "karotte"
            elem = self.get_lebensmittel_by_lebensmittel_name(lebenmittel_name)
            print(f" das ist elem: {elem}")
            # 2. check which lebensmittel are in the fridge
            kuehlschrank_inhalt = self.get_lebensmittel_by_kuehlschrank_id(kuehlschrank_id)
            print(f"kuehlschrank_inhalt[0].get_id() {kuehlschrank_inhalt[0].get_id()}")
            # 3. compare karotten_id mit der karotten_id, die ich im kühlschrank habe. -> das ist mein gesuchtes Objekt
            found_obj = self.find_common_objects(elem, kuehlschrank_inhalt)
            print(found_obj)
            print(f"das sollte jetzt die id 2 sein: {found_obj[0].get_id()}")



            quantity_obj = self.get_menge_by_id(found_obj[0].get_mengenanzahl())
            quantity = quantity_obj.get_menge()
            unit_obj = self.get_masseinheit_by_id(found_obj[0].get_masseinheit())
            unit = unit_obj.get_masseinheit()

            updated_food = found_obj[0].increase_food_quantity(lebensmittel.get_mengenanzahl(), lebensmittel.get_masseinheit(), quantity, unit)
            new_food_obj = self.create_lebensmittel_from_fridge(updated_food.get_lebensmittelname(), updated_food.get_masseinheit(),
                                    updated_food.get_mengenanzahl())

            new_food_obj_id = new_food_obj.get_id()
            print(f"Das ist die  id von neue food objekt: {new_food_obj_id}")


            old_food_id = found_obj[0].get_id()
            # Update kühlschrank
            with KuehlschrankMapper() as mapper:
                print(f"Das ist die old_food_id {old_food_id}")
                print(f"Das ist die updated_food id {updated_food.get_id()}")
                mapper.update(old_food_id, new_food_obj_id)

    def remove_food_from_fridge(self, kuehlschrank_id, rezept_id):  # rezept_id fehlt# lebensmittel = Karotte, 1, Kilogramm
        # Zugehörige Lebensmittel des Kühlschranks finden
        fridge = self.get_lebensmittel_by_kuehlschrank_id(kuehlschrank_id)  # Output: [(k_id/l_id), (k_id/l_id)]
        # Lebensmittel_id der Lebensmittel in eine Liste speichern
        food_id_in_fridge = []
        for elem in fridge:
            food_id_in_fridge.append(elem.get_id())

        print(f" Das sind die Lebensmittel_ids in meinem Kühlschrank {food_id_in_fridge}")

        # Benötigte Lebensmittel aus dem Rezept entziehen
        print(f"Das ist die Rezept_id {rezept_id}")
        required_lebensmittel = self.get_lebensmittel_by_rezept_id(rezept_id)  # Output: [lebensmittel1, lebensmittel2]
        required_lebensmittel_id_in_rezept = []
        for elem in required_lebensmittel:
            required_lebensmittel_id_in_rezept.append(elem.get_id())
        print(f" Das sind die Lebensmittel_ids aus meinem Rezept {required_lebensmittel_id_in_rezept}")

        # Die Lebensmittel_id wird verwendet um zuerst zu prüfen, ob dieses zu entfernende Lebensmittel in der gesamten Konstellation schon im kuehlschrank vorhanden ist
        # wenn ja dann einfach rauslöschen
        # Vergleichen, ob alle Lebensmittel_ids aus dem Rezept im Fridge enthalten sind
        if all(elem in food_id_in_fridge for elem in required_lebensmittel_id_in_rezept):
            print("wir sind im if-Zweig")
            # für jede lebensmittel_id im rezept wird anhand der kuehlschrank_id, das Lebensmittel aus dem Kuehlshrankinhalt entfernt
            for elem in required_lebensmittel_id_in_rezept:
                with KuehlschrankMapper() as mapper:
                    mapper.delete(kuehlschrank_id, elem)

        # Wenn nicht alle Lebensmittel in der benötigten Konstellation gefunden werden, dann überprüfen wir
        # ob wir das Lebensmittel überhaupt im Kühlschrank haben
        else:
            print("wir sind im else-Zweig")
            # Hier speichern wir die Lebensmittelnamen
            names = []
            for elem in required_lebensmittel:
                name = elem.get_lebensmittelname()
                names.append(name)

            print(f"Lebesnmittelnames im Rezept {names}")

            # 1. find all lebensmittel in recipe with the given names
            ingredient_from_recipe_name = []
            for x in required_lebensmittel:
                print(f" das ist der Lebensmittelname für das Rezept: {x}")
                name = x.get_lebensmittelname()
                ingredient_from_recipe_name.append(name)

            # 2. check which lebensmittel are in the fridge
            kuehlschrank_inhalt = self.get_lebensmittel_by_kuehlschrank_id(kuehlschrank_id) # []
            kuehlschrank_inhalt_names = []
            for y in kuehlschrank_inhalt:
                print(f" das ist der Lebensmittelname aus dem Kühlschrank: {y}")
                name = y.get_lebensmittelname()
                kuehlschrank_inhalt_names.append(name)

            # 3. Compare, if the needed ingredient is in the fridge:
            print(f"Das sind die benötigten Lebensmittel aus dem Rezept: {ingredient_from_recipe_name}")
            print(f"Das sind die vorhandenen Lebensmittel aus dem Kühlschrank: {kuehlschrank_inhalt_names}")
            # Convert list to sets for comparison
            recipe_ingredients_set = set(ingredient_from_recipe_name)
            fridge_contents_set = set(kuehlschrank_inhalt_names)
            # Find missing ingredients
            missing_ingredients = recipe_ingredients_set - fridge_contents_set
            # Check if there are missing ingredients
            if missing_ingredients:
                print(f"Du musst noch folgende Lebensmittel einkaufen: {missing_ingredients}")
            else:
                pass
            """ @Johnny: bis hierhin prüfen wir nur ob die Lebensmittelnamen vollständig sind oder nicht. 
            Das ist ein erster Ansatz, aber wir müssen eigtl. überprüfen ob die Lebensmittel auch in der benötigten
            Menge oder mehr verfügbar sind. 
            """

            # print(found_obj)
            # print(f"das sollte jetzt die id 2 sein: {found_obj[0].get_id()}")
            # pass

            # TODO: Meien idee fürn Else-Pfad: alle Lebensmittel anhand des Namens holen wie im add_food und dann auf dieses gefundenne object die decrease methode anwenden
            # selbes Prinzip wie beim add food
            # eventuell ncoh ein else Pfad, wenn es das lebensmittel anhand des namens nicht findet dann einkaufsliste rauswerfen











