from flask import Flask, request, jsonify
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS

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
    id = doctorCollection.insert_one({
        "name": request.json["name"],
        "email": request.json["email"],
        "password": request.json["password"],
        "staffNumber": request.json["staffNumber"]
    }).inserted_id
    return jsonify({"id": str(ObjectId(id)), "msg": "new doctor has been added successfully"})

@app.route("/api/doctor", methods=["GET"])
def getArrayofDoctors():
    users = []
    for doc in doctorCollection.find():
        users.append({
            "id": str(ObjectId(doc["_id"])),
            "name": doc["name"],
            "email": doc["email"],
            "password": doc["password"],
            "staffNumber": doc["staffNumber"]
        })
    return jsonify(users)

@app.route("/api/doctor/<id>", methods=["GET"])
def getOneDoctor(id):
    doctor = doctorCollection.find_one({"_id": ObjectId(id)})
    return jsonify({
        "id": str(ObjectId(doctor["_id"])),
        "name": doctor["name"],
        "email": doctor["email"],
        "password": doctor["password"],
        "staffNumber": doctor["staffNumber"]
    })

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
    return jsonify({"id": str(ObjectId(id)), "msg": "new doctor has been added successfully"})

@app.route("/api/patient", methods=["GET"])
def getArrayofPatients():
    users = []
    for doc in patientCollection.find():
        users.append({
            "id": str(ObjectId(doc["_id"])),
            "doctorID": doc["doctorID"],
            "name": doc["name"]
        })
    return jsonify(users)

@app.route("/api/patient/<id>", methods=["GET"])
def getOnePatient(id):
    doctor = patientCollection.find_one({"_id": ObjectId(id)})
    return jsonify({
        "id": str(ObjectId(doctor["_id"])),
        "doctorID": doctor["doctorID"],
        "name": doctor["name"]
    })

# temporarily disabled
# @app.route("/api/patient/<id>", methods=["DELETE"])
# def deleteOnePatient(id):
#     patientCollection.delete_one({"_id": ObjectId(id)})
#     return jsonify({"msg": "doctor account deleted successfully"})

@app.route("/api/patient/<id>", methods=["PUT"])
def updatePatientDetails(id):
    patientCollection.update_one({"_id": ObjectId(id)}, {"$set": {
        "doctorID": request.json["doctorID"],
        "name": request.json["name"]
    }})
    return jsonify({"msg": "doctor details updated successfully"})


if __name__ == "__main__":
    app.run(debug=True)