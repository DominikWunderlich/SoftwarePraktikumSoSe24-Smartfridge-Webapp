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
from server.bo.Einkaufsliste import Einkaufsliste

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


    # Die Methode ist überflüssig, wird nicht mehr verwendet
    def delete_wg_by_name(self, key):
        with WGMapper() as mapper:
            mapper.find_wg_admin_by_email(key)
            mapper.delete(key)

    def get_wg_id_by_email(self, email):
        with WGMapper() as mapper:
            return mapper.find_wg_id_by_email(email)

    def add_new_wg_bewohner_by_email(self, current_user, wg_id, new_user):
        with WGMapper() as mapper:
            is_admin = mapper.check_if_current_user_is_wg_admin_using_email_and_wg_id(current_user, wg_id)

            if is_admin:
                with WGMapper():
                    mapper.add_wg_bewohner(new_user, wg_id)
                    #print("Bewohner hinzugefügt")
                    return True

            else:
                #print("Bewohner nicht hinzugefügt")
                return False

    def delete_wg_bewohner_by_email(self, current_user, wg_id, new_user):
        with WGMapper() as mapper:
            is_admin = mapper.check_if_current_user_is_wg_admin_using_email_and_wg_id(current_user, wg_id)

            if is_admin:
                with WGMapper():
                    mapper.delete_wg_bewohner(new_user, wg_id)
                    #print("Bewohner enfernt")
                    return True

            else:
                print("Bewohner nicht entfernt")
                return False

    """ Diese Methode löscht die wg und den kuehlschrankinhalt"""
    def delete_wg_and_kuehlschrank(self, wg_id):
        with WGMapper() as mapper:
            mapper.delete_wg_and_kuehlschrank(wg_id)

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

    def create_rezept(self, rezept_name, anzahl_portionen, rezept_ersteller, wg_name, rezept_anleitung):
        """ Erstellen einer Rezept-Instanz. """
        r = Rezept()
        r.set_rezept_name(rezept_name)
        r.set_anzahl_portionen(anzahl_portionen)
        r.set_rezept_ersteller(rezept_ersteller)
        r.set_id(1)
        r.set_wg_name(wg_name)
        r.set_rezept_anleitung(rezept_anleitung)

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

    """Rezept löschen"""
    def delete_rezept_by_id(self, rezept_id):
        with RezeptMapper() as mapper:
            return mapper.delete(rezept_id)
        
    def is_current_user_rezept_admin(self, email):
        with RezeptMapper() as mapper:
            print("Email:", email)
            rzt = mapper.find_rezept_admin_by_email(email)
            print("rzt", rzt)

        for rz in rzt:
            print(rz)
            if rz.get_rezept_ersteller() == email:
                return True

            return False
       
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
            return lmapper.update(food)

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
                mengen_id = self.create_menge(menge)
            else:
                mengen_id = mengen_id.get_id()

        # with MengenanzahlMapper() as m2mapper:
        #     amenge = m2mapper.find_by_menge(menge)
        #     menge_id = amenge.get_id()

            print("Beende mengenmapper")

        # Jetzt haben wir alle Informationen im das Lebensmittel-Objekt korrekt zu erzeugen und in die DB zu speichern.
        food = Lebensmittel()
        # Hier wird die Lebensmittel_id auf 1 gesetzt
        food.set_id(1)
        food.set_lebensmittelname(name)
        food.set_masseinheit(masseinheit_id)
        food.set_mengenanzahl(mengen_id)

        print(f" Das ist das erstellte Lebensmittel: {food}")

        time.sleep(1)
        with LebensmittelMapper() as lmapper:
            lmapper.insert(food)
            print(f" Das ist 'food' vor dem return im create_lebensmittel_from_fridge: {food} .")
            return food


    def get_lebensmittel_by_lebensmittel_name(self, lebensmittel_name, kid):
        with LebensmittelMapper() as mapper:
            return mapper.find_by_lebensmittelname(lebensmittel_name, kid)

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


        # Dann die Maßeinheit erstellen
        faktor = 1  # Hier kann ein Standardfaktor verwendet werden, da er in dieser Methode nicht spezifiziert wurde
        masseinheit_id = self.create_measurement(masseinheit, faktor)
        print(f"das  hier2!!!!!!!!!!!! {masseinheit_id}")


        lebensmittel_id = self.create_lebensmittel(lebensmittel_name, masseinheit, menge)
        print(f"das hier2,5!!!!!!!!!{lebensmittel_name}")
        print(f"das hier3!!!!!!!!!!!{lebensmittel_id}")

        # Lebensmittel erstellen und hinzufügen
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
        print("Lebensmittel wurde erfolgreich zum Rezept hinzugefügt!")
        return True

    def get_lebensmittel_by_rezept_id(self, rezept_id):
        with RezeptEnthaeltLebensmittelMapper() as mapper:
            return mapper.find_lebensmittel_by_rezept_id(rezept_id)
    """Auslesen aller Lebensmittel """

    def getAllLebensmittelangabe(self):
        with LebensmittelMapper() as mapper:
            return mapper.find_all()

    def get_lebensmittel_by_id(self, id):
        with LebensmittelMapper() as mapper:
            return mapper.find_by_id(id)

    """Kuehlschrank-spezifische Methoden """

    def find_kuehlschrank_id(self, email):
        with WGMapper() as wmapper:
            obj = wmapper.find_by_email(email)
            obj_id = obj[0].get_id()
            return obj_id

    def get_lebensmittel_by_kuehlschrank_id(self, kuehlschrank):
        with LebensmittelMapper() as mapper:
            return mapper.find_lebensmittel_by_kuehlschrank_id(kuehlschrank)

    def get_rezept_id_by_wg_name(self, wg_name):
        with RezeptMapper() as mapper:
            return mapper.find_all_by_wg_name(wg_name)

    def add_food_to_fridge(self, kuehlschrank_id, lebensmittel):  # Input = Karotte, 1, Kilogramm
        """
        Diese Methode stellt das hinzufügen von Lebensmitteln dar. Ausgangspunkt ist das befüllen des Kühl-/ Vorrats-
        schrankes.
        :param kuehlschrank_id: Ist die ID der WG / des dazugehörigen Kühlschranks.
        :param lebensmittel: Ist das Lebensmittel das hinzugefügt werden soll.
        """
        # Zuerst werden die zugehörigen Lebensmittel des Kühlschranks geholt.
        fridge = self.get_lebensmittel_by_kuehlschrank_id(kuehlschrank_id)  # Output: [(k_id/l_obj), (k_id2/l_obj2)]
        print(f"DEBUG add_food_to_fridge -- Das ist der fridge mit den Lebensmittel: {fridge}")

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
            updated_food = elem[0].increase_food_quantity(lebensmittel.get_mengenanzahl(), lebensmittel.get_masseinheit(), quantity, unit)
            new_food_obj = self.update_lebensmittel(updated_food.get_lebensmittelname(), updated_food.get_masseinheit(),
                                                    updated_food.get_mengenanzahl(), kuehlschrank_id, None)
            # a = self.update_lebensmittel(new_food_obj)

            return new_food_obj

    def remove_food_from_fridge_with_recipe(self, kuehlschrank_id, rezept_id):
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
                # TODO: Case behandeln, wenn von einem Lebensmittel genug vorhanden sind, aber danach nicht
                # Stand jetzt zieht er auch bei dem die geügend vorhanden sind bereits ab und gibt danch die Einkaufsliste aus
                # mit den fehlenden Lebensmitteln
                print("Lebensmittelname im Rezept", elem.get_lebensmittelname())
                print("Lebensmittelname im Kühlschrank", x.get_lebensmittelname())
                if elem.get_lebensmittelname() == x.get_lebensmittelname():
                    new_amount = x.decrease_food_quantity(required_amount, required_unit)
                    print(f"Das ist das Lebensmittel nach dem, die decrease-Methode angewandt wurde {new_amount}")

                    if new_amount.get_mengenanzahl() > 0:
                        print("if Pfad")
                        # Create new food objects with amount and update the kuehlschrankinhalt
                        # Lebensmittel_id im Kühschhrank finden um, dann mit einem neuen zu ersetzen
                        old_food_id = x.get_id()

                        # Neues lebensmittelobjekt mit neuer menge erstellen
                        new_food_obj = self.create_lebensmittel_from_fridge(new_amount.get_lebensmittelname(),
                                                                            new_amount.get_masseinheit(),
                                                                            new_amount.get_mengenanzahl())

                        print(f"Das ist new_food_obj nach dem erfolgreichen Decrease {new_food_obj}")
                        # Lebensmittel id vom neuen Lebensmittelobjekt ausgeben
                        new_food_obj_id = new_food_obj.get_id()
                        fridge_updates.append((old_food_id,new_food_obj_id, kuehlschrank_id))

                    elif new_amount.get_mengenanzahl() == 0:
                        # DELETE Lebensmittel aus kuehlschrankinhalt where Menge nach Decrease == 0
                        print("elif1 pfad")
                        # Lebensmittel aus dem kühlschrank löschen, da die Menge 0 ist
                        print(f" Das Lebesnmittel hat nach dem Decrease die menge 0 {x}")
                        delete_food_id = x.get_id()
                        print(f"Die ID des zu entfernenden lebensmittels {delete_food_id}")
                        print(f"Die ID die kuehlschrank_id {kuehlschrank_id}")
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
            with KuehlschrankMapper() as mapper:
                for old_food_id, new_food_obj_id, kuehlschrank_id in fridge_updates:
                    print(f"Updating: old_food_id={old_food_id}, new_food_obj_id={new_food_obj_id}")
                    mapper.update(old_food_id, new_food_obj_id, kuehlschrank_id)

                for kuehlschrank_id, delete_food_id in fridge_deletions:
                    print(f"Deleting: kuehlschrank_id={kuehlschrank_id}, delete_food_id={delete_food_id}")
                    mapper.delete(kuehlschrank_id, delete_food_id)

        return shopping_list_with_correct_amounts

    """ Diese Methode ermöglicht das direkte Löschen eines Lebensmittels aus dem Kuehlschrank"""
    def remove_food_from_fridge(self, kuehlschrank_id, lebensmittel_id):
        with KuehlschrankMapper() as mapper:
            mapper.delete(kuehlschrank_id, lebensmittel_id)

    def get_lebensmittel_by_rezept_id2(self, rezept):
        with RezeptEnthaeltLebensmittelMapper() as mapper:
            return mapper.find_lebensmittel_by_rezept_id(rezept)

    def find_verfuegbare_rezepte(self, wg_name, kuehlschrank_id):
        food_id_in_fridge = set()  # Set für die Lebensmittel im Kühlschrank
        rezept_set = set()  # Set für alle Rezepte die gekocht werden können

        # Lebensmittel_id aus einem Kühlschrank in ein Set speichern
        fridge = self.get_lebensmittel_by_kuehlschrank_id(kuehlschrank_id)
        for f_elem in fridge:
            food_id_in_fridge.add(f_elem.get_id())
        print("Kühsclhrank Lebensmittel", food_id_in_fridge)

        # Rezept_id aus einer WG in eine Liste speichern
        recipes_id = self.get_rezept_id_by_wg_name(wg_name)

        # Für jede Rezept_ID die Lebensmittel ausgeben
        for rezept in recipes_id:
            lebensmittel_by_rezept_liste = self.get_lebensmittel_by_rezept_id2(rezept.get_id())
            # Lebensmittel eines Rezepts in eine Liste speichern

            for elem in lebensmittel_by_rezept_liste:
                rezept_required_amount = elem.get_mengenanzahl()
                rezept_required_unit = elem.get_masseinheit()

                for x in fridge:
                    if elem.get_lebensmittelname() == x.get_lebensmittelname():
                        new_amount = x.decrease_food_quantity(rezept_required_amount, rezept_required_unit)
                        # decrease Funktion um Differenz der Menge aus Kühlschrank und Rezept zu berechnen

                        if new_amount.get_mengenanzahl() > 0:
                            rezept_set.add(rezept.get_id())
                            # Set wird mit rezept_ids gefüllt

                        elif new_amount.get_mengenanzahl() == 0:
                            rezept_set.add(rezept.get_id())

                        else:
                            pass

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
