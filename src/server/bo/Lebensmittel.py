from server.bo.BusinessObject import BusinessObject as bo


class Lebensmittel(bo):
    def __init__(self):
        super().__init__()
        self.lebensmittelname = ""
        self.masseinheit = 0
        self.mengenanzahl = 0
        self.kuehlschrank_id = None
        self.rezept_id = None

    def get_lebensmittelname(self):
        """Auslesen des Lebensmittelnamens."""
        return self.lebensmittelname

    def set_lebensmittelname(self, name):
        """Setzen des Lebensmittelnamens."""
        self.lebensmittelname = name

    def get_masseinheit(self):
        """Auslesen des maßeinheit."""
        return self.masseinheit

    def set_masseinheit(self, m):
        """Setzen des maßeinheit."""
        self.masseinheit = m

    def set_mengenanzahl(self, m):
        self.mengenanzahl = m

    def get_mengenanzahl(self):
        return self.mengenanzahl

    def get_kuehlschrank_id(self):
        return self.kuehlschrank_id

    def set_kuelschrank_id(self, kuehlschrank_id):
        self.kuehlschrank_id = kuehlschrank_id

    def get_rezept_id(self):
        return self.rezept_id

    def set_rezept_id(self, rezept_id):
        self.rezept_id = rezept_id

    def decrease_food_quantity(self, required_amount, required_unit):
        """ Diese Methode repräsentiert den Verbrauch von Lebensmittel.
         @:param new_quantity: verbrauchte Menge des Lebensmittels.
         @:param new_unit: neue Maßeinheit des Lebensmittels.
         """

        conversion_factors = {
            'liter': 1000,
            'milliliter': 1,
            'kilogramm': 1000,
            'gramm': 1
            # Hier weitere Faktoren anlegen.
        }

        # Umrechnen der "neuen" Menge.
        new_calculated_qnty = required_amount * conversion_factors[required_unit]
        print(F"Das ist die new_calculated_qnty {new_calculated_qnty}")

        # Neue Menge berechnen
        current_quantity = self.mengenanzahl * conversion_factors[self.masseinheit]
        print(F"Das ist die current_quantity {current_quantity}")
        updated_qnty = current_quantity - new_calculated_qnty
        print(F"Das ist die updated_qnty {updated_qnty}")

        updated_quantity = updated_qnty / conversion_factors[self.masseinheit]
        print(F"Das ist die updated_quantity {updated_quantity}")

        # Auf ursprüngliche Maßeinheit zurück
        current_unit = self.masseinheit
        self.mengenanzahl = updated_quantity
        self.masseinheit = current_unit

        # if updated_quantity >= 0:
        #     ## TODO: test ob das so klappt
        #     self.masseinheit = self.masseinheit
        # else:
        #     self.masseinheit = required_unit

        return self

    def increase_food_quantity(self, add_quantity, add_unit, curr_quantity, curr_unit):
        # 13 , Gramm
        """ Diese Methode repräsentiert das Hinzufügen von Lebensmittel.
                 @:param add_quantity: neue Menge des Lebensmittels.
                 @:param add_unit: neue Maßeinheit des Lebensmittels.
                 """

        conversion_factors = {
            'liter': 1000,
            'milliliter': 1,
            'kilogramm': 1000,
            'gramm': 1,
            # Hier weitere Faktoren anlegen.
        }

        #print(f"Das ist meine add_quantity {add_quantity} & conversion_factors: {conversion_factors[add_unit]}]")
        new_calculated_qnty = add_quantity * conversion_factors[add_unit]
        current_quantity = curr_quantity * conversion_factors[curr_unit]
        total_quantity = current_quantity + new_calculated_qnty
        total_qnty = total_quantity / conversion_factors[curr_unit]
        self.mengenanzahl = total_qnty
        self.masseinheit = curr_unit
        # Das Objekt gibt als Maßeinheit die id zurück, das führt zu Problemen bei der erstellung des lebensmittels

        return self

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return \
            f"LebensmittelObjekt: Lebensmittelname={self.get_lebensmittelname()}, " \
            f"Maßeinheit_id={self.get_masseinheit()}, " \
            f"Mengenanzahl_id={self.get_mengenanzahl()}, " \
            f"Kuehlschrank_id ={self.kuehlschrank_id}, " \
            f"Rezept_id={self.rezept_id}"

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Lebensmittel-Objekt."""
        lm = Lebensmittel()
        lm.set_id(dictionary["id"])
        lm.set_lebensmittelname(dictionary["lebensmittelName"])
        lm.set_masseinheit(dictionary["masseinheit"])
        lm.set_mengenanzahl(dictionary["menge"])
        lm.set_kuelschrank_id(dictionary["kuehlschrankId"])
        lm.set_rezept_id(dictionary["rezeptId"])
        return lm


# # Beispiel 1 Lebensmittel verbrauchen:
# print("Beginne mit beispiel 1: Lebensmittel verbrauchen")
# milch = Lebensmittel()
# milch.set_lebensmittelname("Milch")
# milch.set_masseinheit("Liter")
# milch.set_mengenanzahl(1)
# print(f"Output: Milch 1 Liter {milch}")
# milch.decrease_food_quantity(200, "Milliliter")
# print(f"Output: Milch 800 ml {milch}")
#
# # Beispiel 2 Lebensmittel verbrauchen:
# print("Beginne mit beispiel 2: Lebensmittel verbrauchen")
# brot = Lebensmittel()
# brot.set_lebensmittelname("brot")
# brot.set_masseinheit("Gramm")
# brot.set_mengenanzahl(500)
# print(f"Output: Brot 500g {brot}")
# brot.decrease_food_quantity(600, "Gramm")
# print(f"Output: Brot 0g {brot}")
#
# # Beispiel 3 Lebensmittel hinzufügen:
# print("Beginne mit beispiel 3: Lebensmittel hinzufügen")
# apfel = Lebensmittel()
# apfel.set_lebensmittelname("Äpfel")
# apfel.set_masseinheit("Gramm")
# apfel.set_mengenanzahl(500)
# print(f"Output: Apfel 500g {apfel}")
# apfel.increase_food_quantity(600, "Gramm")
# print(f"Output: Apfel 1,1kg {apfel}")

""" 
Info:  wenn wir Lebensmittel hinzufügen, rufen wir "increase_food..." auf. Bei Verbrauchen rufen wir
"decrease_food_..." auf. 
"""
