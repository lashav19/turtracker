from flask import (Flask, render_template, 
                   send_from_directory, request, 
                   abort)
from flask_cors import CORS
from firebase_setup import *


app = Flask(__name__, template_folder='../')
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory("../", filename)

@app.route('/api/turer/')
def getEvents(id=None):
    id = request.args.get('i') #for å hente parameter fra post requests
    ref = db.reference('events')
    if id:
        events = ref.child(id).get()
        return events

    events = ref.get()
    if events:
        return events
    else:
        abort(404)
