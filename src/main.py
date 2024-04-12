from flask import Flask
from flask_restx import Api, Resource, fields
from flask_cors import CORS, cross_origin

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

# Hier werden für die Business-Objkte die JSON Strukturen definiert.
# TODO: define bos

@smartapi.route('/wg')
@smartapi.response(500, 'Serverseitiger Fehler')
class WgOperations(Resource):
    def get(self):
        """ Auslesen aller WG-Objekte. """
        #TODO: Implement get-method
        pass

    def post(self):
        """ Anlegen eines neuen WG-Objekts. """
        # TODO: Implement post-method
        pass

if __name__ == '__main__':
    app.run(debug=True)