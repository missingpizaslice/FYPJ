from flask import Flask, request, jsonify
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS
import re

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost/painanalysisdb'
mongo = PyMongo(app)

CORS(app)

doctorCollection = mongo.db.doctors
patientCollection = mongo.db.patients
recordsCollection = mongo.db.records

# ========================================================================================================

# Doctors CRUD

@app.route("/api/doctor", methods=["POST"])
def createDoctor():
    nameRegex = r'^[a-zA-Z\s]+$'
    emailRegex = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    staffNumberRegex = r'^sn\d{5}$'
    passwordRegex = r'^.{12,}$'

    emailValid = True

    if re.match(emailRegex, request.json["email"]):
        emailValid = True
    else:
        emailValid = False
        return jsonify({"msg": "the email is invalid"})

    if re.match(nameRegex , request.json["name"]):
        emailValid = True
    else:
        emailValid = False
        return jsonify({"msg": "the name is invalid"})

    if re.match(staffNumberRegex, request.json["staffNumber"]):
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
        
    if (emailValid):
        id = doctorCollection.insert_one({
        "name": request.json["name"],
        "email": request.json["email"],
        "password": request.json["password"],
        "staffNumber": request.json["staffNumber"]
    }).inserted_id
    return jsonify({"id": str(ObjectId(id)), "msg": "new doctor has been added successfully"})
    

@app.route("/api/doctor", methods=["GET"])
def getArrayofDoctors():
    doctors = []
    for doc in doctorCollection.find():
        doctors.append({
            "id": str(ObjectId(doc["_id"])),
            "name": doc["name"],
            "email": doc["email"],
            "password": doc["password"],
            "staffNumber": doc["staffNumber"]
        })
    return jsonify(doctors)

@app.route("/api/doctor/<id>", methods=["GET"])
def getdoctorbyemail(id):
    doctor = doctorCollection.find_one({"email": id})
    if doctor:
        return jsonify({
            "id": str(ObjectId(doctor["_id"])),
            "name": doctor["name"],
            "email": doctor["email"],
            "password": doctor["password"],
            "staffNumber": doctor["staffNumber"]
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
            "password": doctor["password"],
            "staffNumber": doctor["staffNumber"]
        })
    else:
        return jsonify({"msg": "the account does not exist"})

# temporarily disabled
# @app.route("/api/doctors/<id>", methods=["DELETE"])
# def deleteOneDoctor(id):
#     doctorCollection.delete_one({"_id": ObjectId(id)})
#     return jsonify({"msg": "doctor account deleted successfully"})

@app.route("/api/doctor/<id>", methods=["PUT"])
def updateDoctorDetails(id):
    doctorCollection.update_one({"_id": ObjectId(id)}, {"$set": {
        "name": request.json["name"],
        "email": request.json["email"],
        "password": request.json["password"],
        "staffNumber": request.json["staffNumber"]
    }})
    return jsonify({"msg": "doctor details updated successfully"})

# ========================================================================================================

# patient CRUD

@app.route("/api/patient", methods=["POST"])
def createPatient():
    id = patientCollection.insert_one({
        "doctorID": request.json["doctorID"],
        "name": request.json["name"]
    }).inserted_id
    return jsonify({"id": str(ObjectId(id)), "msg": "new patient has been added successfully"})

@app.route("/api/patient", methods=["GET"])
def getArrayofPatients():
    patients = []
    for patient in patientCollection.find():
        patients.append({
            "id": str(ObjectId(patient["_id"])),
            "doctorID": patient["doctorID"],
            "name": patient["name"]
        })
    return jsonify(patients)

@app.route("/api/patient/<id>", methods=["GET"])
def getPatientsbyDoctor(id):
    patients = []
    for patient in patientCollection.find({"doctorID": id}):
        patients.append({
            "id": str(ObjectId(patient["_id"])),
            "doctorID": patient["doctorID"],
            "name": patient["name"]
        })
    return jsonify(patients)

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

@app.route("/api/patient/<id>", methods=["PUT"])
def updatePatientDetails(id):
    patientCollection.update_one({"_id": ObjectId(id)}, {"$set": {
        "doctorID": request.json["doctorID"],
        "name": request.json["name"]
    }})
    return jsonify({"msg": "patient details updated successfully"})


if __name__ == "__main__":
    app.run(debug=True)