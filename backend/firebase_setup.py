import firebase_admin
from firebase_admin import credentials, db
import pyrebase

firebaseConfig = {
  "apiKey": "AIzaSyB1B14lAStNgDISeB8GhaeEgFIIKsZlIcI",
  'authDomain': "turtracker.firebaseapp.com",
  'databaseURL': "https://turtracker-default-rtdb.europe-west1.firebasedatabase.app",
  'projectId': "turtracker",
  'storageBucket': "turtracker.appspot.com",
  'messagingSenderId': "313773758046",
  'appId': "1:313773758046:web:256b6e16707c563d9786cf"
}

cred = credentials.Certificate("path/to/serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': "https://eventkalender-d93af-default-rtdb.europe-west1.firebasedatabase.app/"
})

firebase = pyrebase.initialize_app(firebaseConfig)