from flask import (Flask, render_template, 
                   send_from_directory, request, 
                   abort, jsonify)
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, db, auth


cred = credentials.Certificate("backend\\credentials.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': "https://eventkalender-d93af-default-rtdb.europe-west1.firebasedatabase.app/"
})

app = Flask(__name__, template_folder='../')
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        return 'POST'
    
    return render_template('login.html')

@app.route('/api/register', methods=['POST'])
def registerUser():

        data = request.json
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
    data = request.json
    username = data.get('username')
    password = data.get('password')
    try:

        user = auth.get_user_by_email(f"{username}@example.com")
        firebase_user = auth.get_user(user.uid)


        return firebase_user.uid if firebase_user.password == password else abort(401)
    except Exception as e:
        # Handle error (username not found or incorrect password)
        print("Error logging in:", e)
        return None

@app.route('/register', methods=['GET'])
def register():

    return render_template('register.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory("../", filename)

@app.route('/api/turer/add')
def registrerTur():

    ref = db.reference('/')
    #ref.child('turer').push(tur)
@app.route('/api/turer/')
def getEvents(id=None):
    id = request.args.get('i') #for å hente parameter fra post requests
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