from flask import Flask, request, jsonify
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import re
import hashlib

# from cryptography.fernet import Fernet
# from cryptography.hazmat.primitives import hashes
# from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
# from cryptography.hazmat.backends import default_backend
# from base64 import urlsafe_b64encode, urlsafe_b64decode


app = Flask(__name__)
bcrypt = Bcrypt(app)
app.config['MONGO_URI'] = 'mongodb://localhost/painanalysisdb'
mongo = PyMongo(app)

CORS(app)

doctorCollection = mongo.db.doctors
patientCollection = mongo.db.patients
recordsCollection = mongo.db.records

# ========================================================================================================

# Staff Member CRUD

# create a new staff member
@app.route("/api/doctor", methods=["POST"])
def createDoctor():
    nameRegex = r'^[a-zA-Z\s]+$'
    emailRegex = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    staffNumberRegex = r'^sn\d{5}$'
    passwordRegex = r'^.{12,}$'

    emailValid = True

    doctor = doctorCollection.find_one({"email": request.json["email"]})

    if doctor:
        emailValid = False
        return jsonify({"msg": "the email is already in use"})

    if re.match(emailRegex, request.json["email"].lower()):
        emailValid = True
    else:
        emailValid = False
        return jsonify({"msg": "the email is invalid"})

    if re.match(nameRegex , request.json["name"].lower()):
        emailValid = True
    else:
        emailValid = False
        return jsonify({"msg": "the name is invalid"})

    if re.match(staffNumberRegex, request.json["staffNumber"].lower()):
        emailValid = True
    else:
        emailValid = False
        return jsonify({"msg": "the staff number is invalid"})
        
    if re.match(passwordRegex, request.json["password"]):
        emailValid = True
    else:
        emailValid = False
        return jsonify({"msg": "the password is invalid"})


    if request.json["password"] != request.json["confirmPassword"]:
        emailValid = False
        return jsonify({"msg": "the passwords do not match"})
    
    if request.json["staffType"] == "":
        emailValid = False
        return jsonify({"msg": "staff type cannot be empty"})
        
    if (emailValid):
        
        password = request.json["password"]
        pw_hashed = bcrypt.generate_password_hash(password)

        id = doctorCollection.insert_one({
        "name": request.json["name"].lower(),
        "email": request.json["email"].lower(),
        "password": pw_hashed,
        "staffNumber": request.json["staffNumber"].lower(),
        "staffType": request.json["staffType"].lower()
    }).inserted_id
    return jsonify({"id": str(ObjectId(id)), "msg": "new doctor has been added successfully"})
    
# get a list of all staff members
@app.route("/api/doctor", methods=["GET"])
def getArrayofDoctors():
    doctors = []
    for doc in doctorCollection.find():
        doctors.append({
            "id": str(ObjectId(doc["_id"])),
            "name": doc["name"],
            "email": doc["email"],
            "staffNumber": doc["staffNumber"],
            "staffType": doc["staffType"]
        })
    return jsonify(doctors)

# authenticate a staff member on login
@app.route("/api/authenticate", methods=["POST"])
def authenticateDoctor():
    doctor = doctorCollection.find_one({"email": request.json["email"]})
    if doctor:
        
        hashed_password = doctor["password"]
        password = request.json["password"]
        print(hashed_password)

        match =  bcrypt.check_password_hash(hashed_password, password)

        if match:
            return jsonify({
                "msg": "login successful",
                "doctor": {
                    "id": str(ObjectId(doctor["_id"])),
                    "name": doctor["name"],
                    "email": doctor["email"],
                    "staffNumber": doctor["staffNumber"],
                    "staffType": doctor["staffType"]
                }
            })
        else:
            return jsonify({"msg": "the password is incorrect"})
    else:
        return jsonify({"msg": "the account does not exist"})
        
# get staff members information by email
@app.route("/api/doctor/<id>", methods=["GET"])
def getdoctorbyemail(id):
    doctor = doctorCollection.find_one({"email": id})
    if doctor:
        return jsonify({
            "id": str(ObjectId(doctor["_id"])),
            "name": doctor["name"],
            "email": doctor["email"],
            "staffNumber": doctor["staffNumber"],
            "staffType": doctor["staffType"]
        })
    else:
        return jsonify({"msg": "the account does not exist"})

# get doctor information by id
@app.route("/api/doctorByID/<id>", methods=["GET"])
def getdoctorbyid(id):
    doctor = doctorCollection.find_one({"_id": ObjectId(id)})
    if doctor:
        return jsonify({
            "id": str(ObjectId(doctor["_id"])),
            "name": doctor["name"],
            "email": doctor["email"],
            "staffNumber": doctor["staffNumber"],
            "staffType": doctor["staffType"]
        })
    else:
        return jsonify({"msg": "the account does not exist"})

# temporarily disabled
# @app.route("/api/doctors/<id>", methods=["DELETE"])
# def deleteOneDoctor(id):
#     doctorCollection.delete_one({"_id": ObjectId(id)})
#     return jsonify({"msg": "doctor account deleted successfully"})

# update Doctor's password
@app.route("/api/updatePassword", methods=["POST"])
def updateDoctorDetails():

    passwordRegex = r'^.{12,}$'

    doctor = doctorCollection.find_one({"_id": ObjectId(request.json["doctor_id"])})

    if doctor == None:
        return jsonify({"msg": "Unknown error has occoured please try again later"})

    emailValid = True

    hashed_password = doctor["password"]
    password = request.json["currentPassword"]
    print(hashed_password)

    if not bcrypt.check_password_hash(hashed_password, password):
        emailValid = False
        return jsonify({"msg": "Current password is incorrect"})

    if request.json["currentPassword"] == "" or request.json["newPassword"] == "" or request.json["confirmNewPassword"] == "":
        emailValid = False
        return jsonify({"msg": "Please fill all fields"})

    if doctor["_id"] == request.json["newPassword"]:
        emailValid = False
        return jsonify({"msg": "New password cannot be the same as old password"})

    if request.json["newPassword"] != request.json["confirmNewPassword"]:
        emailValid = False
        return jsonify({"msg": "passwords do not match"})

    if re.match(passwordRegex, request.json["newPassword"]):
        emailValid = True
    else:
        emailValid = False
        return jsonify({"msg": "the password is invalid"})

    if (emailValid):
        
        password = request.json["newPassword"]
        pw_hashed = bcrypt.generate_password_hash(password)

        doctorCollection.update_one({"_id": ObjectId(request.json["doctor_id"])}, {"$set": {
            "password": pw_hashed
        }})
        return jsonify({"msg": "password successfully updated"})

# ========================================================================================================

# patient CRUD

# create a new patient
@app.route("/api/patient", methods=["POST"])
def createPatient():

    nameIsUnique = False

    validDate = True

    if request.json["name"] == "":
        validDate = False

    while nameIsUnique == False:
        username = hashlib.sha256(str(ObjectId()).encode()).hexdigest()[:7]
        alreadyExists = []
        for patient in patientCollection.find({"username": username}):
            alreadyExists.append(patient)
        if len(alreadyExists) == 0:
            nameIsUnique = True

    # key = Fernet.generate_key()
    # cipher_suite = Fernet(key)

    # encrypted_name = cipher_suite.encrypt(request.json["name"].encode()).decode()
    # encrypted_username = cipher_suite.encrypt(username.encode()).decode()

    if validDate == True:
        id = patientCollection.insert_one({
            "doctorID": request.json["doctorID"],
            "name": request.json["name"],
            "username": username,
            # "key": key
        }).inserted_id
        return jsonify({"id": str(ObjectId(id)), "msg": "New Patient Adeed Successfully. please provide the patient the following username: " + username + " for them to access the pain analysis system."})

# get a list of all patients
@app.route("/api/patient", methods=["GET"])
def getArrayofPatients():
    patients = []
    for patient in patientCollection.find():
        patients.append({
            "id": str(ObjectId(patient["_id"])),
            "doctorID": patient["doctorID"],
            "name": patient["name"],
            "username": patient["username"],
        })
    return jsonify(patients)

# get a list of patients by doctor id
@app.route("/api/patient/<id>", methods=["GET"])
def getPatientsbyDoctor(id):
    patients = []
    for patient in patientCollection.find({"doctorID": id}):
        # key = patient["key"]
        # cipher_suite = Fernet(key)
        # decrypted_name = cipher_suite.decrypt(patient["name"].encode()).decode()
        # decrypted_username = cipher_suite.decrypt(patient["username"].encode()).decode()
        patients.append({
            "id": str(ObjectId(patient["_id"])),
            "doctorID": patient["doctorID"],
            "name": patient["name"],
            "username": patient["username"],
        })
    return jsonify(patients)

@app.route("/api/search", methods=["POST"])
def searchPatientsbyDoctor():
    search_string = request.json['search']
    doctor_id = request.json['doctorID']
    patients = []
    for patient in patientCollection.find({
        "$and": [
            {"doctorID": doctor_id},
            {"$or": [
                {"username": {"$regex": f".*{search_string}.*", "$options" :'i'}},
                {"name": {"$regex": f".*{search_string}.*", "$options" :'i'}}
            ]}
        ]
    }):
        # key = patient["key"]
        # cipher_suite = Fernet(key)
        # decrypted_name = cipher_suite.decrypt(patient["name"].encode()).decode()
        # decrypted_username = cipher_suite.decrypt(patient["username"].encode()).decode()
        patients.append({
            "id": str(ObjectId(patient["_id"])),
            "doctorID": patient["doctorID"],
            "name": patient["name"],
            "username": patient["username"],
        })
    return jsonify(patients)

# get patient information by id
@app.route("/api/patientOne/<id>", methods=["GET"])
def getOnePatient(id):
    patient = patientCollection.find_one({"_id": ObjectId(id)})
    return jsonify({
        "id": str(ObjectId(patient["_id"])),
        "doctorID": patient["doctorID"],
        "name": patient["name"]
    })

# temporarily disabled
# @app.route("/api/patient/<id>", methods=["DELETE"])
# def deleteOnePatient(id):
#     patientCollection.delete_one({"_id": ObjectId(id)})
#     return jsonify({"msg": "patient account deleted successfully"})

# update patient details
@app.route("/api/patient/<id>", methods=["PUT"])
def updatePatientDetails(id):
    patientCollection.update_one({"_id": ObjectId(id)}, {"$set": {
        "doctorID": request.json["doctorID"],
        "name": request.json["name"]
    }})
    return jsonify({"msg": "patient details updated successfully"})

# ========================================================================================================

@app.route("/api/record", methods=["POST"])
def createRecord():
    id = recordsCollection.insert_one({
        "patientID": request.json["patientID"],
        "datetime": request.json["datetime"],
        "painlevel": request.json["painlevel"],
        "activity": request.json["activity"],
    }).inserted_id
    return jsonify({"id": str(ObjectId(id)), "msg": "new record has been added successfully"})

@app.route("/api/record/<id>", methods=["GET"])
def getArrayofRecords(id):
    records = []
    for record in recordsCollection.find({"patientID": id}):
        records.append({
            "id": str(ObjectId(record["_id"])),
            "patientID": record["patientID"],
            "datetime": record["datetime"],
            "painlevel": record["painlevel"],
            "activity": record["activity"],
        })
    return jsonify(records)

if __name__ == "__main__":
    app.run(debug=True)