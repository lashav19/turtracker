from flask import (Flask, render_template,
                   send_from_directory, request, abort, jsonify)
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, db, auth
import pyrebase  # pip install pyrebase4 ikke pyrebase

cred = credentials.Certificate("backend\\credentials.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': "https://eventkalender-d93af-default-rtdb.europe-west1.firebasedatabase.app/"
})

pyrebaseConfig = {
    "apiKey": "AIzaSyB1B14lAStNgDISeB8GhaeEgFIIKsZlIcI",
    "authDomain": "turtracker.firebaseapp.com",
    "databaseURL": "https://turtracker-default-rtdb.europe-west1.firebasedatabase.app",
    "projectId": "turtracker",
    "storageBucket": "turtracker.appspot.com",
    "messagingSenderId": "313773758046",
    "appId": "1:313773758046:web:256b6e16707c563d9786cf"
}

app = Flask(__name__, template_folder='../')

fyrebase = pyrebase.initialize_app(pyrebaseConfig)


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


@app.route('/api/turer/add')
def registrerTur():
    ref = db.reference('/')
    # ref.child('turer').push(tur)


@app.route('/api/turer/<string:bruker>')
def getEvents(id=None):
    id = request.args.get('i')  # for å hente parameter fra get requests
    ref = db.reference('turer')
    if id:
        events = ref.child(id).get()
        return events

    events = ref.get()
    if events:
        return events
    else:
        abort(404)


if __name__ == "__main__":
    app.run(port=8080, host="0.0.0.0", debug=True)
