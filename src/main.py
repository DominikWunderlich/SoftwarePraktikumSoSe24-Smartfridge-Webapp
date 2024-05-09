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

app = Flask(__name__)


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
})

lebensmittel = api.inherit('Lebensmittel', bo, {
    'lebensmittel_name': fields.String(attribute='lebensmittelName', description='Name des Lebensmittels'),
    'masseinheit': fields.String(attribute='masseinheit', description='Maßeinheit des Lebenmittels'),
    'mengenanzahl': fields.Integer(attribute='mengenanzahl', description='Menge des Lebensmittels'),
})

menge = api.inherit('Menge', bo, {
    'menge': fields.Integer(attribute='menge', description='MengenObjekt')
})

masseinheit = api.inherit('Masseinheit', bo, {
    'masseinheitsname': fields.String(attribute='masseinheitsname', description='Name einer Maßeinheit'),
    'umrechnungsfaktor': fields.Float(attribute='umrechnungsfaktor', description='Umrechnungsfaktor einer Maßeinheit')
})

@app.route("/")
def index():
    print("HELLO")
    return app.send_static_file("index.html")


@smartapi.route('/wg')
@smartapi.response(500, 'Serverseitiger Fehler')
class WgOperations(Resource):
    @smartapi.expect(wg)
    @smartapi.marshal_with(wg)
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
    def get(self, email):
        adm = Administration()
        wg_p = adm.getWGByEmail(email)

        if wg_p is not None:
            return wg_p
        else:
            return '', 500

    # Update wg on wgPage
    @smartapi.expect(wg)
    @smartapi.marshal_with(wg)
    def put(self, email):
        adm = Administration()
        proposal = WG.from_dict(api.payload)
        print("Main.py", api.payload)

        if proposal is not None:
            result = adm.update_wg_by_email(email, proposal)
            print("Ergebnis:", result)
            return result



@smartapi.route('/wg/<wg_name>')
@smartapi.response(500, 'Serverseitiger Fehler')
@smartapi.param('wg_name', 'Die Name der WG')
class WgGetOperations(Resource):
    #@secured
    @smartapi.marshal_with(wg)
    def get(self, wg_name):
        """ Auslesen eines WG-Objekts """

        adm = Administration()
        wg_page = adm.get_wg_by_name(wg_name)

        if wg_page is not None:
            return wg_page
        else:
            return '', 500

    """Wg über den Namen löschen"""
    def delete(self, wg_name):
        adm = Administration()
        adm.get_wg_by_name(wg_name)
        adm.delete_wg_by_name(wg_name)
        return "", 200

""" User related API Endpoints """
@smartapi.route('/login')
@smartapi.response(500, 'Serverseitiger Fehler')
class UserOperations(Resource):
    @smartapi.expect(person)
    @smartapi.marshal_with(person)
    def post(self):
        """ Anlegen eines neuen User-Objekts. """
        adm = Administration()
        proposal = Person.from_dict(api.payload)


        if proposal is not None:
            result = adm.create_user(
                proposal.get_email(),
                proposal.get_benutzername(),
                proposal.get_vorname(),
                proposal.get_nachname(),
                proposal.get_google_id()
            )
            return result, 200
        else:
            return 'Fehler in User-Operations post methode', 500

@smartapi.route('/login/<string:google_id>')
@smartapi.response(500, 'Serverseitiger-Fehler')
@smartapi.param("google_id", 'Die Google-ID des Profil-Objekts')
class ProfileOperations(Resource):
    @smartapi.marshal_with(person)
    def get(self, google_id):
        """ Auslesen eines bestimmten Profil-Objekts. """
        adm = Administration()
        p = adm.redirect_user(google_id)
        return p

@smartapi.route('/rezept')
@smartapi.response(500, 'Serverseitiger Fehler')
class RezeptOperations(Resource):
    @smartapi.expect(rezept)
    @smartapi.marshal_with(rezept)
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
                proposal.get_wg_name())
            print(result, "hi")
            return result, 200
        else:
            print("Else Pfad")
            return 'Fehler in Rezept-Operations post methode', 500

#Notiz: Hier bin ich mir seeeehr unsicher ob das richtig gecodet ist
    @smartapi.marshal_with(rezept)
    def get(self):
        """ Auslesen aller Rezept-Objekte"""

        adm = Administration()
        rezepte = adm.get_all_rezepte()  # Methode, um alle Rezepte abzurufen
        print(rezepte)

        if rezepte is not None:
            return rezepte
        else:
            return '', 500

@smartapi.route('/rezept/<wg_name>')
@smartapi.response(500, 'Serverseitiger Fehler')
@smartapi.param('wg_name', 'Name der WG')
class getRezeptOperations(Resource):
    @smartapi.marshal_with(rezept)
    def get(self, wg_name):
        """ Auslesen aller Rezepte einer WG """

        adm = Administration()
        wg_page = adm.get_all_rezepte_by_wg_name(wg_name)

        if wg_page is not None:
            return wg_page
        else:
            return '', 500

""" Lebensmittel Calls """

@smartapi.route('/lebensmittelverwaltung')
@smartapi.response(500, 'Serverseitiger Fehler')
class LebensmittelOperation(Resource):
    @smartapi.expect(lebensmittel)
    @smartapi.marshal_with(lebensmittel)
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
                proposal.get_mengenanzahl()
            )
            return result, 200
        else:
            return 'Fehler in LebensmittelOperation post methode', 500

@smartapi.route('/menge')
@smartapi.response(500, "Serverseitiger-Fehler")
class MengenOperationen(Resource):
    @smartapi.expect(menge)
    @smartapi.marshal_with(menge)
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




if __name__ == '__main__':
    app.run(debug=True)