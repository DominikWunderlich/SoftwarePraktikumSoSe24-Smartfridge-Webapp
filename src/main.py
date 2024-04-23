from flask import Flask
from flask_restx import Api, Resource, fields
from flask_cors import CORS, cross_origin

from server.Administration import Administration
from server.bo.BusinessObject import BusinessObject
from server.bo.WG import WG
from server.bo.Person import Person

app = Flask(__name__)


@app.route("/")
def index():
    print("HELLO")
    return app.send_static_file("index.html")


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
    'wg_name': fields.String(attribute='wg_name', description='Name einer Wohngemeinschaft'),
    'wg_bewohner': fields.String(attribute='wg_bewohner', description='Teilnehmerliste einer WG'),
    'wg_ersteller': fields.String(attribute='wg_ersteller', description='Admin einer WG')
})

person = api.inherit('Person', bo, {
    'email': fields.String(attribute='email', description='E-Mail-Adresse eines Users'),
    'benutzername': fields.String(attribute='benutername', description='Username eines Users'),
    'vorname': fields.String(attribute='vorname', description='Vorname eines Users'),
    'nachname': fields.String(attribute='nachname', description='Nachname eines Users'),
    'google_id': fields.String(attribute='google_id', description='Google-ID eines Users')
})


@smartapi.route('/wg')
@smartapi.response(500, 'Serverseitiger Fehler')
class WgOperations(Resource):
    @smartapi.expect(wg)
    @smartapi.marshal_with(wg)
    def post(self):
        """ Anlegen eines neuen WG-Objekts. """
        adm = Administration()
        proposal = WG.from_dict(api.payload)
        print(api.payload)

        if proposal is not None:
            result = adm.create_wg(
                proposal.get_wg_name(),
                proposal.get_wg_ersteller(),
                proposal.get_wg_bewohner())
            print(result, "hi")
            return result, 200
        else:
            print("Else Pfad")
            return 'Fehler in WG-Operations post methode', 500


@smartapi.route('/wg/<wg_name>')
@smartapi.response(500, 'Serverseitiger Fehler')
@smartapi.param('wg_name', 'Die Name der WG')
class WgGetOperations(Resource):
    #@secured
    def get(self, wg_name):
        """ Auslesen eines BlockNote-Objekts """

        adm = Administration()
        wg_page = adm.get_wg_by_name(wg_name)
        print(wg_page)

        if wg_page is not None:
            return wg_page
        else:
            return '', 500

    def delete(self, wg_name):
        adm = Administration()
        adm.get_wg_by_name(wg_name)
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
        print(f"This is the api.payload arrived in the backend (BEFORE proposal bein created): {api.payload}")
        proposal = Person.from_dict(api.payload)
        print(f"This is the Proposal created in the backend: {proposal}")

        if proposal is not None:
            result = adm.create_user(
                proposal.get_email(),
                proposal.get_benutzername(),
                proposal.get_vorname(),
                proposal.get_nachname(),
                proposal.get_google_id()
            )
            print(f"Übergebenes result-objekt zu Administration: {result}")
            return result, 200
        else:
            print("Else Pfad")
            return 'Fehler in User-Operations post methode', 500


if __name__ == '__main__':
    app.run(debug=True)