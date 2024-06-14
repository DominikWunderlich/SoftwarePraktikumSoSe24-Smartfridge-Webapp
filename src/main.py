from flask import Flask
from flask_restx import Api, Resource, fields
from flask_cors import CORS, cross_origin

from server.Administration import Administration
from server.bo.BusinessObject import BusinessObject
from server.bo.WG import WG
from server.bo.Rezept import Rezept
from server.bo.Person import Person
from server.bo.Lebensmittel import Lebensmittel
from server.bo.mengenanzahl import Mengenanzahl
from server.bo.Masseinheit import Masseinheit

from server.SecurityDecorator import secured

app = Flask(__name__, static_folder="build", static_url_path='/')

# Auskommenteiert, swagger funktioniert wieder -> Benötigen wir das?
# @app.route("/")
# def index():
#     return app.send_static_file("index.html")
#
# @app.errorhandler(404)
# def not_found(e):
#     return app.send_static_file('index.html')

# Calls with /system/* are allowed.
CORS(app, resources=r'/system/*')

# Define API
api = Api(app, version='1.0', title='Eatsmarter', description='System-API')

# Namespace anlegen um Operationen unter bestimmten Präfix "/smartapi" zusammenzufassen.
smartapi = api.namespace('system', description='Funktionen der EatSmarterAPI')

""" Hier werden für die Business-Objkte die JSON Strukturen definiert."""
# BusinessObject dient als Basisklasse, auf der die weiteren Strukturen WG, Rezept, ... aufsetzen."""
bo = api.model('BusinessObject', {
    'id': fields.Integer(attribute='id', description='Der Unique Identifier eines Business Object'),
})

wg = api.inherit('WG', bo, {
    'wgName': fields.String(attribute='wg_name', description='Name einer Wohngemeinschaft'),
    'wgBewohner': fields.String(attribute='wg_bewohner', description='Teilnehmerliste einer WG'),
    'wgAdmin': fields.String(attribute='wg_ersteller', description='Admin einer WG')
})

person = api.inherit('Person', bo, {
    'email': fields.String(attribute='email', description='E-Mail-Adresse eines Users'),
    'userName': fields.String(attribute='benutzername', description='Username eines Users'),
    'firstName': fields.String(attribute='vorname', description='Vorname eines Users'),
    'lastName': fields.String(attribute='nachname', description='Nachname eines Users'),
    'googleId': fields.String(attribute='google_id', description='Google-ID eines Users')
})

rezept = api.inherit('Rezept', bo, {
    'rezeptName': fields.String(attribute='rezept_name', description='Name einer Rezeptes'),
    'anzahlPortionen': fields.String(attribute='anzahl_portionen', description='Rezept ist ausgelegt für so viele Personen'),
    'rezeptAdmin': fields.String(attribute='rezept_ersteller', description='Ersteller eines Rezepts'),
    'wgName': fields.String(attribute='wg_name', description='Name einer Wohngemeinschaft'),
    'rezeptAnleitung': fields.String(attribute='rezept_anleitung', description='Anleitung'),
})

lebensmittel = api.inherit('Lebensmittel', bo, {
    'lebensmittelName': fields.String(attribute='lebensmittelname', description='Name des Lebensmittels'),
    'masseinheit': fields.String(attribute='masseinheit', description='Maßeinheit des Lebenmittels'),
    'mengenanzahl': fields.Float(attribute='mengenanzahl', description='Mengen des Lebensmittels'),
    'kuehlschrankId': fields.Integer(default=None, attribute='kuehlschrank_id', description='KuehlschrankId des Lebensmittels'),
    'rezeptId': fields.Integer(default=None, attribute='rezept_id', description='RezeptId des Lebensmittels')
})

menge = api.inherit('Menge', bo, {
    'menge': fields.Float(attribute='menge', description='MengenObjekt')
})

masseinheit = api.inherit('Masseinheit', bo, {
    'masseinheitsname': fields.String(attribute='masseinheitsname', description='Name einer Maßeinheit'),
    'umrechnungsfaktor': fields.Float(attribute='umrechnungsfaktor', description='Umrechnungsfaktor einer Maßeinheit')
})

@smartapi.route('/wg')
@smartapi.response(500, 'Serverseitiger Fehler')
class WgOperations(Resource):
    @smartapi.expect(wg)
    @smartapi.marshal_with(wg)
    @secured
    def post(self):
        """ Anlegen eines neuen WG-Objekts. """
        adm = Administration()
        proposal = WG.from_dict(api.payload)

        if proposal is not None:
            result = adm.create_wg(
                proposal.get_wg_name(),
                proposal.get_wg_bewohner(),
                proposal.get_wg_ersteller())
            return result, 200
        else:
            return 'Fehler in WG-Operations post methode', 500


@smartapi.route('/wg/user/<email>')
@smartapi.response(500, 'Serverseitiger Fehler')
@smartapi.param('email', 'Die E-mail der aktuellen person')
class WgGetWgOperations(Resource):
    @smartapi.marshal_with(wg)
    @secured
    def get(self, email):
        adm = Administration()
        wg_p = adm.getWGByEmail(email)

        if wg_p is not None:
            return wg_p
        else:
            return '', 500

    def delete(self, email):
        adm = Administration()
        wgs = adm.getWGByEmail(email)

        for wg in wgs:
            wg_id = wg.get_id()
            adm.delete_wg_and_kuehlschrank(wg_id)
            #TODO: Alle Rezepte anhand der Wg id auch löschen?

@smartapi.route('/wg/user/wgAdmin/<email>')
@smartapi.response(500, 'Serverseitiger Fehler')
@smartapi.param('email', 'Die E-mail der aktuellen person')
class WgGetWgAdminWgOperations(Resource):
    def get(self, email):
        adm = Administration()
        # print("True in der Main.py?", adm.is_current_user_wg_admin(email))
        return adm.is_current_user_wg_admin(email)

@smartapi.route('/wg/<wg_name>')
@smartapi.response(500, 'Serverseitiger Fehler')
@smartapi.param('wg_name', 'Die Name der WG')
class WgGetOperations(Resource):
    #@secured
    @smartapi.marshal_with(wg)
    @secured
    def get(self, wg_name):
        """ Auslesen eines WG-Objekts """

        adm = Administration()
        wg_page = adm.get_wg_by_name(wg_name)

        if wg_page is not None:
            return wg_page
        else:
            return '', 500


# Wg bewohner hinzufügen
@smartapi.route('/wg/add/<current_user>/<new_user>')
@smartapi.response(500, 'Serverseitiger Fehler')
class WgUpdateOperations(Resource):
    def put(self, current_user, new_user):
        adm = Administration()
        wg_id = adm.get_wg_id_by_email(current_user)
        i = adm.add_new_wg_bewohner_by_email(current_user, wg_id, new_user)

        return i

# Wg Bewohner entfernen
@smartapi.route('/wg/delete/<current_user>/<new_user>')
@smartapi.response(500, 'Serverseitiger Fehler')
class WgUpdateOperations(Resource):
    def put(self, current_user, new_user):
        adm = Administration()
        wg_id = adm.get_wg_id_by_email(current_user)
        i = adm.delete_wg_bewohner_by_email(current_user, wg_id, new_user)

        return i


@smartapi.route('/kuehlschrankinhalt/<wg_id>')
@smartapi.response(500, 'Serverseitiger Fehler')
@smartapi.param("wgId")
class KuelschrankOperations(Resource):
    @secured
    @smartapi.expect(lebensmittel)
    @smartapi.marshal_with(lebensmittel)
    def post(self, wg_id):
        """
        Das ist der Endpunkt für das hinzufügen von Lebensmitteln in den Kühlschrank.
        Ist ein Lebensmittel bereits enthalten, wird es geupdatet!
        """
        adm = Administration()
        proposal = Lebensmittel.from_dict(api.payload)

        if proposal is not None:
            result = adm.add_food_to_fridge(wg_id, proposal)
            return result
    @smartapi.marshal_with(lebensmittel)
    def get(self, wg_id):
        """Auslesen eines Lebensmittel-Objekts"""

        adm = Administration()
        k_inhalt = adm.get_lebensmittel_by_kuehlschrank_id(wg_id)

        if k_inhalt is not None:
            return k_inhalt, 200
        else:
            return '', 500


@smartapi.route("/kuehlschrankinhalt/<wg_id>/<lebensmittel_id>")
@smartapi.response(500, 'Serverseitiger Fehler')
class KuelschrankLebensmittelOperations(Resource):
    def delete(self, wg_id, lebensmittel_id):
        kuehlschrank_id = wg_id

        adm = Administration()
        # print(f"main.py lebensmittel id {lebensmittel_id}")
        # print(f"main.py kuehlschrank id {kuehlschrank_id}")
        adm.remove_food_from_fridge(kuehlschrank_id, lebensmittel_id)

    @smartapi.expect(lebensmittel)
    @smartapi.marshal_with(lebensmittel)
    @secured
    def put(self, wg_id, lebensmittel_id):
        """
        Aktualisiert ein Lebensmittel.
        """
        adm = Administration()
        data = Lebensmittel.from_dict(api.payload)
        if data is not None:
            result = adm.update_lebensmittel(data.get_lebensmittelname(), data.get_masseinheit(),
                                             data.get_mengenanzahl(),data.get_kuehlschrank_id(), data.get_rezept_id())
            return result, 200
        else:
            return 'Fehler in User-Operations post methode', 500


@smartapi.route("/rezeptinhalt/<rezept_id>/<lebensmittel_id>")
@smartapi.response(500, 'Serverseitiger Fehler')
class RezeptLebensmittelOperations(Resource):
    def delete(self, rezept_id, lebensmittel_id):

        adm = Administration()
        adm.remove_food_from_rezept(rezept_id, lebensmittel_id)


""" User related API Endpoints """
@smartapi.route('/login')
@smartapi.response(500, 'Serverseitiger Fehler')
class UserOperations(Resource):
    @smartapi.expect(person)
    @smartapi.marshal_with(person)
    @secured
    def post(self):
        """ Anlegen eines neuen User-Objekts. """
        adm = Administration()
        proposal = Person.from_dict(api.payload)


        if proposal is not None:
            result = adm.save_person(proposal)
            return result, 200
        else:
            return 'Fehler in User-Operations post methode', 500

@smartapi.route('/login/<string:google_id>')
@smartapi.response(500, 'Serverseitiger-Fehler')
@smartapi.param("google_id", 'Die Google-ID des Profil-Objekts')
class ProfileOperations(Resource):
    @smartapi.marshal_with(person)
    @secured
    def get(self, google_id):
        """ Auslesen eines bestimmten Profil-Objekts. """
        adm = Administration()
        p = adm.redirect_user(google_id)
        return p

@smartapi.route('/login/check/<string:google_id>')
@smartapi.response(500, 'Serverseitiger-Fehler')
@smartapi.param("google_id", 'Die Google-ID des Profil-Objekts')
class ProfileCheckOperations(Resource):
    @smartapi.marshal_with(person)
    @secured
    def get(self, google_id):
        """ Auslesen eines bestimmten Profil-Objekts. """
        adm = Administration()
        p = adm.get_user_by_google_id(google_id)
        return p

@smartapi.route('/rezept')
@smartapi.response(500, 'Serverseitiger Fehler')
class RezeptOperations(Resource):
    @smartapi.expect(rezept)
    @smartapi.marshal_with(rezept)
    @secured
    def post(self):
        """ Anlegen eines neuen Rezept-Objekts. """
        adm = Administration()
        proposal = Rezept.from_dict(api.payload)
        print(api.payload)

        if proposal is not None:
            result = adm.create_rezept(
                proposal.get_rezept_name(),
                proposal.get_anzahl_portionen(),
                proposal.get_rezept_ersteller(),
                proposal.get_wg_name(),
                proposal.get_rezept_anleitung())
            print(result, "hi")
            return result, 200
        else:
            print("Else Pfad")
            return 'Fehler in Rezept-Operations post methode', 500

#Notiz: Hier bin ich mir seeeehr unsicher ob das richtig gecodet ist
    @smartapi.marshal_with(rezept)
    @secured
    def get(self):
        """ Auslesen aller Rezept-Objekte"""

        adm = Administration()
        rezepte = adm.get_all_rezepte()  # Methode, um alle Rezepte abzurufen
        print(rezepte)

        if rezepte is not None:
            return rezepte
        else:
            return '', 500

@smartapi.route('/rezeptt/<rezept_id>/lebensmittel')
@smartapi.response(500, 'Serverseitiger Fehler')
@smartapi.param('rezept_id', 'ID des Rezepts')
class AddLebensmittelToRezept(Resource):
    @smartapi.expect(lebensmittel)
    @smartapi.marshal_with(rezept)
    #@secured
    def post(self, rezept_id):
        """
        Das ist der Endpunkt für das hinzufügen von Lebensmitteln in den Kühlschrank.
        Ist ein Lebensmittel bereits enthalten, wird es geupdatet!
        """
        adm = Administration()
        proposal = Lebensmittel.from_dict(api.payload)

        if proposal is not None:
            print("Proposal", proposal)
            result = adm.add_food_to_recipe(rezept_id, proposal)
            return result

    @smartapi.marshal_with(lebensmittel)
    def get(self, rezept_id):
        """Auslesen von Lebensmittel-Objekten anhand der rezept_id"""

        adm = Administration()
        r_inhalt = adm.get_lebensmittel_by_rezept_id(rezept_id)

        if r_inhalt is not None:
            return r_inhalt, 200
        else:
            return '', 500

@smartapi.route('/rezept/<wg_name>')
@smartapi.response(500, 'Serverseitiger Fehler')
@smartapi.param('wg_name', 'Name der WG')
class getRezeptOperations(Resource):
    @smartapi.marshal_with(rezept)
    @secured
    def get(self, wg_name):
        """ Auslesen aller Rezepte einer WG """

        adm = Administration()
        wg_page = adm.get_all_rezepte_by_wg_name(wg_name)

        if wg_page is not None:
            return wg_page
        else:
            return '', 500

@smartapi.route('/rezept/einrezept/<rezept_id>')
@smartapi.response(500, 'Serverseitiger Fehler')
@smartapi.param('rezept_id', 'ID des Rezepts')
class getEinRezeptOperations(Resource):
    @smartapi.marshal_with(rezept)
    @secured
    def get(self, rezept_id):
        """ Auslesen aller Rezepte mit bestimmter id """
        print("hallo")
        print(rezept_id)

        adm = Administration()
        rezept_page = adm.get_rezept_by_id(rezept_id)
        print(rezept_id)
        print(rezept_page)
        print(rezept)
        print("halalalalal")
        print(rezept_page)


        if rezept_page is not None:
            return rezept_page
        else:
            return '', 500

@smartapi.route('/rezept/send/<rezept_id>/<email>')
@smartapi.response(500, 'Serverseitiger Fehler')
@smartapi.param('rezept_id', 'ID des Rezepts')
class rezeptIdToBackendOperations(Resource):
    @smartapi.marshal_with(lebensmittel)
    @secured
    def post(self, rezept_id, email):
        """ Rezept-ID im Terminal ausgeben """
        adm = Administration()
        k_id = adm.find_kuehlschrank_id(email)
        shoppinglist = adm.remove_food_from_fridge_with_recipe(k_id, rezept_id)
        return shoppinglist

"""Rezept löschen"""
@smartapi.route('/rezept/<rezept_id>')
@smartapi.response(500, 'Serverseitiger Fehler')
@smartapi.param('rezept_id', 'ID des Rezepts')
class DeleteEinRezeptOperations(Resource):
    #@secured
    def delete(self, rezept_id):
            adm = Administration()
            rezept = adm.get_rezept_by_id(rezept_id)
            print(adm.get_rezept_by_id(rezept_id))
            for rz in rezept:
                # print(wg)
                rz_id = rz.get_id()
                adm.delete_rezept_by_id(rz_id)

    def get(self, rezept_id):
        adm = Administration()
        rezepte = adm.get_rezepte_by_rezept_id(rezept_id)

        if rezepte is not None:
            return rezepte
        else:
            return '', 500


@smartapi.route('/rezept/user/<email>')
@smartapi.response(500, 'Serverseitiger Fehler')
@smartapi.param('email', 'Die E-mail der aktuellen person')
class GetRezeptAdminWgOperations(Resource):
    def get(self, email):
        adm = Administration()
        print("True in der Main.py?", adm.is_current_user_rezept_admin(email))
        return adm.is_current_user_rezept_admin(email)

""" Lebensmittel Calls """

@smartapi.route('/lebensmittelverwaltung')
@smartapi.response(500, 'Serverseitiger Fehler')
class LebensmittelOperation(Resource):
    @smartapi.expect(lebensmittel)
    @smartapi.marshal_with(lebensmittel)
    #@secured
    def post(self):
        """ Lebensmittel API Call zum Hinzufügen eines Lebensmittel Objekts. """
        adm = Administration()
        print(f"Lebensmittel payload im Backend (Flask): {api.payload}")
        proposal = Lebensmittel.from_dict(api.payload)
        print(f"Lebensmittel payload im Backend (Flask): {api.payload}")

        if proposal is not None:
            result = adm.create_lebensmittel(
                proposal.get_lebensmittelname(),
                proposal.get_masseinheit(),
                proposal.get_mengenanzahl(),
                proposal.get_kuehlschrank_id(),
                proposal.get_rezept_id()
            )
            return result, 200
        else:
            return 'Fehler in LebensmittelOperation post methode', 500

    @smartapi.marshal_list_with(lebensmittel)
    #@secured
    def get(self):
        """ Auslesen aller Lebensmittelobjekte-Objekte"""

        adm = Administration()
        lebensmittel_liste = adm.getAllLebensmittelangabe()  # Methode, um alle Lebensmitteln abzurufen

        if lebensmittel_liste is not None:
            return lebensmittel_liste
        else:
            return '', 500
        
@smartapi.route('/menge')
@smartapi.response(500, "Serverseitiger-Fehler")
class MengenOperationen(Resource):
    @smartapi.expect(menge)
    @smartapi.marshal_with(menge)
    @secured
    def post(self):
        """
        Methode gehört zum Lebensmittel API-Call und wird zur Vorbereitung benötigt.
        Wenn ein Lebensmittel hinzugefügt wird, werden 3 API-Calls aufgerufen. (Erstellen von
        Menge, Maßeinheit und Lebensmittel). Das ist der call für das Anlegen eines MengenObjekts.
        """
        adm = Administration()
        proposal = Mengenanzahl.from_dict(api.payload)
        print(f"Mengen payload im Backend (Flask): {api.payload}")

        if proposal is not None:
            res = adm.create_menge(
                proposal.get_menge()
            )
            return res, 200
        else:
            return "Fehler in MengenOperationen Post Methode", 500

@smartapi.route('/masseinheit')
@smartapi.response(500, "Serverseitiger-Fehler")
class MasseinheitOperation(Resource):
    @smartapi.expect(masseinheit)
    @smartapi.marshal_with(masseinheit)
    @secured
    def post(self):
        """
        Methode gehört zum Lebensmittel API-Call und wird zur Vorbereitung benötigt.
        Wenn ein Lebensmittel hinzugefügt wird, werden 3 API-Calls aufgerufen. (Erstellen von
        Menge, Maßeinheit und Lebensmittel). Das ist der call für das Anlegen einer Maßeinheit.
        """
        adm = Administration()
        print(f"Masseinheit payload im Backend (Flask): {api.payload}")
        proposal = Masseinheit.from_dict(api.payload)
        print(f"Masseinheit payload im Backend (Flask): {api.payload}")

        if proposal is not None:
            res = adm.create_measurement(
                proposal.get_masseinheit(),
                proposal.get_umrechnungsfaktor()
            )
            return res, 200
        else:
            return "Fehler in MengenOperationen Post Methode", 500
        

    @smartapi.expect(masseinheit)
    @smartapi.marshal_with(masseinheit)
    @secured
    def put(self):
        """
        Aktualisiert den Namen einer Maßeinheit.
        """
        adm = Administration()
        data = api.payload  # Zugriff auf die Daten aus der PUT-Anforderung
        id = data.get('id')
        new_name = data.get('new_name')

        if not id or not new_name:
            return {'message': "Fehlende ID oder neuer Maßeinheitsname."}, 400

        success = adm.update_measurement_name(id, new_name)
        if success:
            # Erfolgreiche Antwort im JSON-Format zurückgeben
            return {'message': f"Masseinheit mit ID '{id}' erfolgreich in '{new_name}' aktualisiert."}, 200
        else:
            return {'message': f"Aktualisierung des Maßeinheitsnamens mit ID '{id}' fehlgeschlagen."}, 500


    @smartapi.marshal_with(masseinheit)
    @secured
    def get(self):
        """ Auslesen aller masseinheit-Objekte"""

        adm = Administration()
        masseinheit = adm.getMasseinheitAll()  # Methode, um alle masseinheiten abzurufen
        print(masseinheit)

        if masseinheit is not None:
            return masseinheit
        else:
            return '', 500

    """Generator Calls"""
    @smartapi.route('/rezept/generator/<wg_name>/<kuehlschrank_id>')
    @smartapi.response(500, 'Serverseitiger Fehler')
    @smartapi.param('wg_name', 'Name der WG')
    class GeneratorOperations(Resource):
        # @secured
        @smartapi.marshal_list_with(rezept)
        def get(self, wg_name, kuehlschrank_id):
            """ Auslesen aller Rezepte durch Generator """

            adm = Administration()
            gen_rezepte = adm.find_verfuegbare_rezepte(wg_name, kuehlschrank_id)

            print(gen_rezepte)
            if gen_rezepte is not None:
                return gen_rezepte
            else:
                return '', 500


if __name__ == '__main__':
    app.run(debug=True)