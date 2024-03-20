import firebase_admin
import os
import pyrebase  # ! pip install pyrebase4 ikke pyrebase
from flask import (Flask, render_template,
                   send_from_directory, request, abort, jsonify)
from flask_cors import CORS
from firebase_admin import credentials, db, auth
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
import uuid


UPLOAD_FOLDER = 'backend\\img'
ALLOWED_EXTENSIONS = set(['jpg', 'png', 'jpeg'])


def allowedFile(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


load_dotenv()  # * Laster inn .env filen i environment

cred = credentials.Certificate("backend\\credentials.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': "https://eventkalender-d93af-default-rtdb.europe-west1.firebasedatabase.app/"
})


fyrebase = pyrebase.initialize_app({
    "apiKey": os.getenv("apiKey"),
    "authDomain": os.getenv("authDomain"),
    "databaseURL": os.getenv("databaseURL"),
    "projectId": os.getenv("projectId"),
    "storageBucket": os.getenv("storageBucket"),
    "messagingSenderId": os.getenv("messagingSenderId"),
    "appId": os.getenv("appId")
})


app = Flask(__name__, template_folder='../')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# ? Page endpoints


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
        print(e)
        return abort(500)


@app.route('/api/login', methods=['POST'])
def loginUser():
    auth = fyrebase.auth()
    data = request.json
    username = data.get('username')
    password = data.get('password')
    try:
        # Henter bruker fra firebase auth basert på brukernavn
        user = auth.sign_in_with_email_and_password(
            f"{username}@example.com", password)

        return user['localId']
    except Exception as e:
        print("Error logging in:", e)
        return abort(401)  # 401 error hvis det er feil brukernavn


@app.route('/api/test')
def test():
    return {"Success": True}


@app.route('/api/upload/image', methods=['POST'])
def imgUpload():
    
    if 'file' not in request.files:
        return abort(400)

    file = request.files.get('file')
    if file.filename == '':
        return abort(400)

    if file and allowedFile(file.filename):
        storage = fyrebase.storage() # firebase storage


        # Henter fil extension som png, jpeg osv
        original_filename = secure_filename(file.filename)
        file_extension = os.path.splitext(original_filename)[1].lower()

        # Genererer en unikt filnavn for bildet
        uuid_filename = str(uuid.uuid4()) + file_extension
        
        # Lagrer bildet
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], uuid_filename)
        file.save(save_path)
        storage.child(uuid_filename).put(save_path)
        os.remove(save_path)

    return jsonify({"message": "File uploaded successfully"}), 200


@app.route('/api/turer/add')
def registrerTur():
    ref = db.reference('/')
    # ref.child('turer').push(tur)


@app.route('/api/turer/<string:bruker>')
def getEvents(bruker=None):
    id = request.args.get('i')  # for å hente parameter fra requesten
    ref = db.reference('turer')
    if id:
        return ref.child(id).get()
    
    events = ref.get()
    return events if events else abort(404)



if __name__ == "__main__":
    app.run(port=8080, host="0.0.0.0", debug=True)
