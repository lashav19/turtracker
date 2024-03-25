import firebase_admin
import os
import uuid
import pyrebase  # ! pip install pyrebase4 ikke pyrebase
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
from flask_cors import CORS
from firebase_admin import credentials, auth
from flask import (
    Flask, render_template,
    send_from_directory, request,
    abort, jsonify)


load_dotenv()  # * Laster inn .env filen i environment


fyrebase = pyrebase.initialize_app({
    "apiKey": os.getenv("apiKey"),
    "authDomain": os.getenv("authDomain"),
    "databaseURL": os.getenv("databaseURL"),
    "projectId": os.getenv("projectId"),
    "storageBucket": os.getenv("storageBucket"),
    "messagingSenderId": os.getenv("messagingSenderId"),
    "appId": os.getenv("appId")
})

cred = credentials.Certificate("backend\\credentials.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': "https://eventkalender-d93af-default-rtdb.europe-west1.firebasedatabase.app/"
})

db = fyrebase.database()

app = Flask(__name__, template_folder='../')
app.config['UPLOAD_FOLDER'] = 'backend\\img'


def uploadIMG(file):

    storage = fyrebase.storage()  # * firebase storage
    # * Henter fil extension som png, jpeg osv
    original_filename = secure_filename(file.filename)
    file_extension = os.path.splitext(original_filename)[1].lower()

    # * Genererer en unikt filnavn for bildet
    uuid_filename = str(uuid.uuid4()) + file_extension

    # * Lagrer bildet
    save_path = os.path.join(app.config['UPLOAD_FOLDER'], uuid_filename)
    file.save(save_path)
    storage.child(uuid_filename).put(save_path)
    os.remove(save_path)
    # * Henter URL'en for bildet
    image_url = storage.child(uuid_filename).get_url(None)
    return image_url

# ? Page / static endpoints


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/login', methods=['GET'])
def login():
    return render_template('login.html')


@app.route('/register', methods=['GET'])
def register():
    return render_template('register.html')


@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory("../", filename)


# ? Api endpoints
@app.route('/api/register', methods=['POST'])
def registerUser():
    data = request.json  # henter data som blir postet som et json objekt
    username = data.get('username')
    password = data.get('password')
    try:
        user = auth.create_user(
            email=f"{username}@example.com",
            password=password
        )
        return jsonify(user.uid)
    except Exception as e:
        print("error:", e)
        return abort(500)  # * returnerer


@app.route('/api/login', methods=['POST'])
def loginUser():
    auth = fyrebase.auth()  # * autentisering

    # * Henter brukernavn og passord fra request
    username = request.json.get('username')
    password = request.json.get('password')
    try:
        # * Henter bruker fra firebase auth basert på brukernavn
        user = auth.sign_in_with_email_and_password(
            f"{username}@example.com", password)

        # * Returnerer brukerID hvis den er successful
        return user.get('localId')
    except Exception as e:
        print("error:", e)
        # * 401 unauthorized error hvis det er feil brukernavn eller passord
        return abort(401)


@app.route('/api/turer/add', methods=['POST'])
def registrerTur():
    try:
        if 'file' not in request.files:  # * Sjekker om det er filer i requesten
            # * Gir tilbake en bad request error hvis det ikke er en fil som blir submittet
            return abort(400)

        file = request.files.get('file')
        topp = request.form.get('topp')
        topTime = request.form.get('end')
        bruker = request.form.get('uid')

        if file.filename == '':
            # * Gir en 406 Not acceptable error hvis filnavnet er tomt
            return abort(406)

        # * Hvis filen eksisterer så går den gjennom
        if file:
            image_url = uploadIMG(file)

            tur = {
                "topp": topp,
                "tid": topTime,
                "bilde": image_url
            }

            # * Lager en child issue av BrukerID sin tur i databasen
            db.child("Turer").child(bruker).push(tur)
            # ? returnerer 200 success når den
            return jsonify({"message": "Trip uploaded successfully"}), 200
    except Exception as e:
        return abort(500)  # * Returnerer server error hvis en feil oppstår


@app.route('/api/turer/<string:bruker>')
def getEvents(bruker=None):

    data = db.child("Turer").child(bruker).get().val()

    # * Hvis en bruker har data så får den data, ellers så får du ingenting
    return data if bruker and data else {"tur": None, "topp": None, "tid": None}


@app.route('/api/topper/get')
def getTur():
    db = fyrebase.database()
    data = db.child("Topper").get().val()
    # Return data as JSON response
    # * Returnerer data hvis den eksisterer, ellers så returnerer den 404 not found
    return jsonify(data) if data else abort(404)


if __name__ == "__main__":
    app.run(port=8080, host="0.0.0.0", debug=True)
