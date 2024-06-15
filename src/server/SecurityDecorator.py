from flask import request
from google.auth.transport import requests
import google.oauth2.id_token
from server.Administration import Administration


def secured(function):

    firebase_request_adapter = requests.Request()

    def wrapper(*args, **kwargs):
        # Holt sich den token, von dem Cookie und speichert sich diesen in id_token
        id_token = request.cookies.get("token")

        error_message = None
        claims = None
        objects = None

        if id_token:
            try:
                """
                Verifiziert den Token mit der Firebase Auth API. Dies passiert jedes Mal, wenn eine Seite geladen wird.
                Dies ist zwar recht arbeitsintensiv, jedoch für unsere Anwendung in Ordnung.
                """
                claims = google.oauth2.id_token.verify_firebase_token(
                    id_token, firebase_request_adapter)

                if claims is not None:
                    adm = Administration()

                    google_user_id = claims.get("user_id")
                    email = claims.get("email")
                    name = claims.get("name")


                    # Auslesen der Person-Instanz
                    account = adm.get_user_by_google_id(google_user_id)

                    if account is not None:

                        """
                        Wenn der Account bei uns schon bekannt ist, wurde diese google_user_id schon verwendet. 
                        Dabei gehen wir davon aus, dass sich die google_user_id nicht verändern kann.
                        Jedoch können sich andere Teile, wie der Name oder die E-Mailadresse, verändern. 
                        Um Fehler zu vermeiden, updaten wir in unserem System einmal diese beiden Objekte.
                        """

                        account.set_email(email)
                        account.set_benutzername(name)


                    else:

                        """
                        Dies tritt auf, wenn der Anwender mit der google_user_id noch nicht in unserem System war.
                        Daher legen wir ein neues Account-Objekt an und übergeben in dieses den Namen, die E-Mailadresse
                        und die google_user_id.
                        """

                        account = adm.create_user(email, name, None, None, google_user_id, None)

                    print(request.method, request.path, "angefragt durch:", name, email)

                    objects = function(*args, **kwargs)
                    return objects

                else:
                    return " ", 401  # UNAUTHORIZED

            except ValueError as exc:
                error_message = str(exc)
                return exc, 401 # UNAUTHORIZED

        return " ", 401 # UNAUTHORIZED

    return wrapper