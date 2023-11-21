from flask import Flask, request, jsonify,Response,redirect,url_for,render_template
from flask_pymongo import PyMongo, ObjectId
# from check import open_opencv_window
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import re
import hashlib
from datetime import datetime, timedelta
# from cryptography.fernet import Fernet
# from cryptography.hazmat.primitives import hashes
# from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
# from cryptography.hazmat.backends import default_backend
# from base64 import urlsafe_b64encode, urlsafe_b64decode


import cv2
import mediapipe as mp
import numpy as np
from transform_2d import est_similarity_trans, similarity_trans
from keypoints_extract import keypoints_extract
## library for inference

import os
import datetime
import time
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
import torchvision.transforms as transforms
from torch.autograd import Variable
import tensorflow as tf
from sklearn.metrics import accuracy_score
# from data import data_preprocess, data_trans
from modelbase import STA_LSTM as Net
from sklearn.metrics import confusion_matrix

app = Flask(__name__)
bcrypt = Bcrypt(app)
app.config['MONGO_URI'] = 'mongodb://localhost/painanalysisdb'
mongo = PyMongo(app)

CORS(app)

doctorCollection = mongo.db.doctors
patientCollection = mongo.db.patients
recordsCollection = mongo.db.records
nameCollection = mongo.db.names

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
        
# get staff members information by email

# authenticate a staff member on login
@app.route("/api/authenticate", methods=["POST"])
def authenticateDoctor():
    email = request.json["email"].lower()
    doctor = doctorCollection.find_one({"email": email})
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

def createRecord(username, activity,duration,text,current_time):
        id = recordsCollection.insert_one({
            "patientID": username,
            "activity":activity,
            "duration":duration,
            "painlevel": text,
            "datetime": current_time
        })

@app.route("/api/record/<id>", methods=["GET"])
def getArrayofRecords(id):
    print(id)
    date = request.args.get("date") 
    print(date)
    records = []
    if date == "LastWeek":
        # Calculate the date range for the last week
        end_date = datetime.datetime.now()
        formatted_date = end_date.strftime("%m/%d/%Y")
        print(formatted_date)
        start_date = (end_date - timedelta(days=7)).strftime("%m/%d/%Y")
        print(start_date)
        # Use the date range in your MongoDB query
        for record in recordsCollection.find({
            "patientID": id,
            "datetime": {
                "$gte": start_date,
                "$lt": formatted_date
            },
            "painlevel": {
                "$nin": ["No face detected", "System calibration completed","JUST CHECKING","System Calibration Completed"]
            }
        }):
            records.append({
                "id": str(ObjectId(record["_id"])),
                "patientID": record["patientID"],
                "datetime": record["datetime"],
                "painlevel": record["painlevel"],
                "activity": record["activity"],
                "duration": record["duration"],
            })

            records = sorted(records, key=lambda x: datetime.datetime.strptime(x["datetime"], "%m/%d/%Y"))
    elif date == "LastThreeMonths":
        # Calculate the date range for the last 3 months
        end_date = datetime.datetime.now()
        formatted_date = end_date.strftime("%m/%d/%Y")
        print(formatted_date)
        start_date = (end_date - datetime.timedelta(days=90)).strftime("%m/%d/%Y")
        print(start_date)

        # Use the date range in your MongoDB query
        for record in recordsCollection.find({
            "patientID": id,
            "datetime": {
                "$gte": start_date,
                "$lt": formatted_date
            },
            "painlevel": {
                "$nin": ["No face detected", "System calibration completed", "JUST CHECKING", "System Calibration Completed"]
            }
        }):
            datetime_str = record["datetime"]
            datetime_object = datetime.datetime.strptime(datetime_str, '%m/%d/%Y')
            month_only = datetime_object.strftime('%m')

            records.append({
                "id": str(ObjectId(record["_id"])),
                "patientID": record["patientID"],
                "datetime": month_only,
                "painlevel": record["painlevel"],
                "activity": record["activity"],
                "duration": record["duration"],
            })
            records = sorted(records, key=lambda x: datetime.datetime.strptime(x["datetime"], "%m"))
    elif date == "All":
        # Retrieve all records without date filtering
        for record in recordsCollection.find({"patientID": id}):
            # Check if the painlevel is not "no face detected" or "System calibration completed"
            if record["painlevel"] not in ["No face detected", "System calibration completed","System Calibration Completed"]:
                records.append({
                    "id": str(ObjectId(record["_id"])),
                    "patientID": record["patientID"],
                    "datetime": record["datetime"],
                    "painlevel": record["painlevel"],
                    "activity": record["activity"],
                    "duration": record["duration"]
                })
        records = sorted(records, key=lambda x: datetime.datetime.strptime(x["datetime"], "%m/%d/%Y"))
    return jsonify(records)

@app.route('/start_opencv', methods=['POST'])
def start_opencv():
    username = request.json["name"]
    print(username)
    patient_name = patientCollection.find_one({"username": username})
    if patient_name:
        activity = request.json["activity"]
        duration = request.json["duration"]
        nameCollection.insert_one({
            "name": username,
            "activity":activity,
            "duration":duration
        })
        training_required,net = check_users(username)
        if training_required:
            return jsonify({"msg": "Account exists without model"})
        else:
            return jsonify({"msg": "Account exists with model"})
    else:
        return jsonify({"msg": "the account does not exist"})
    
@app.route('/webcam', methods=['GET'])
def webcam():
    records = nameCollection.find()
    data_list = []
    for record in records:
        username = record.get("name")
        activity = record.get("activity")
        duration = record.get("duration")
        data_list.append([username, activity, duration])
    print(data_list)
    return Response(generate_frames(data_list[-1][0], data_list[-1][1], data_list[-1][2]), mimetype='multipart/x-mixed-replace; boundary=frame')
    

def check_users(username):
    try:
        net = torch.load("src\\model\\" + username + "_personalized_train.pth")
        print("Welcome back, {}!".format(username))
        training_required = False
    except FileNotFoundError:
        print("Your profile is not found in the system. Personalized calibration is required.")
        net = torch.load('src\\SGH_26to100_b2_e100.pth')
        training_required = True

    return training_required,net

@app.route('/check_user', methods=['POST'])
def check_user():
    print("Your profile is not found in the system. Personalized calibration is required.")
    net = torch.load('src\\SGH_26to100_b2_e100.pth')
    username = request.json["name"]
    base = 2
    IN_DIM = int(936 * 60 / base)  # always use 60 / base number to get the final datapoints, e.g. 60 / base_2 = 30
    SEQUENCE_LENGTH = int(60 / base)  # 2

    LSTM_IN_DIM = int(IN_DIM / SEQUENCE_LENGTH)
    LSTM_HIDDEN_DIM = 64  # 32 #64

    OUT_DIM = 3
    text = "System Calibration Completed"

    LEARNING_RATE = 0.05  # learning rate
    WEIGHT_DECAY = 1e-6  # not used as the number of epoches is only 8 or 10
    EPOCHES = 20 ## 10 epoches can reach 100%
    USE_GPU = False
    optimizer = optim.Adam(net.parameters(), lr=LEARNING_RATE, weight_decay=WEIGHT_DECAY)

    # 学习率根据训练的次数进行调整
    adjust_lr = optim.lr_scheduler.MultiStepLR(optimizer,
                                            milestones=[i * 10 for i in range(EPOCHES // 10)],
                                            gamma=0.5)

    # 定义训练损失函数&测试误差函数
    # loss_criterion = nn.SmoothL1Loss()
    loss_criterion = nn.MSELoss()
    error_criterion = nn.L1Loss()  # MSELoss()

    ### freeze all layers, except the last one


    for name,param in net.named_parameters():
        if name not in ['T_A.weight', 'T_A.bias','layer_out.weight']:
            param.requires_grad = False

    def train(inputs, groundtruths):
        net.train()
        loss_list = []
        inputs = inputs
        groundtruths = groundtruths
        optimizer.zero_grad()
        # 获得网络输出结果
        out = net(inputs)
        # 根据真值计算损失函数的值
        loss = loss_criterion(out, groundtruths)
        out = out.detach().numpy()
        groundtruths = groundtruths.detach().numpy()
        correct_pred = tf.equal(tf.argmax(out, 1), tf.argmax(groundtruths, 1))
        acc = tf.reduce_mean(tf.cast(correct_pred, tf.float32))

        # 通过优化器优化网络
        loss.backward()
        optimizer.step()
        loss_list.append(loss.item())

        return loss_list, acc
    
    cv2.imshow("pain", 3)
    train_data_pain = keypoints_extract('Pain', 8)
    cv2.imshow("No pain",3)
    train_data_nopain = keypoints_extract('No pain', 8)

    train_data = np.vstack([train_data_pain, train_data_nopain])
    train_data = train_data.astype(np.float32)
    train_data = torch.from_numpy(train_data)
    inputs = Variable(train_data)
    ground_truth_pain = np.zeros(shape=(8, 3))
    ground_truth_pain[:, 0] = 1
    ground_truth_nopain = np.zeros(shape=(8, 3))
    ground_truth_nopain[:, -1] = 1
    train_groundtruth = np.vstack([ground_truth_pain, ground_truth_nopain])
    train_groundtruth = train_groundtruth.astype(np.float32)
    train_groundtruth = torch.from_numpy(train_groundtruth)
    train_data = Variable(train_data)
    train_groundtruth = Variable(train_groundtruth)
    #msg_display("pain", 3)
    ## start training
    train_start = time.time()
    loss_recorder = []

    print('starting training... ')

    for epoch in range(EPOCHES):
        print(epoch)

        loss_list, acc = train(train_data, train_groundtruth)

        loss_recorder.append(np.mean(loss_list))

        acc = acc * 100.0
        adjust_lr.step()

        print('\nepoch = %d \nloss = %.5f, accuracy = %2.5f' % (epoch + 1, np.mean(loss_list), acc))
    """
        if (epoch % 5 == 0):
            test_start = time.time()
            acc, average_error = test()

            acc = acc * 100.0
            print('Loss = %.5f, Test accuracy is = %2.5f' % (average_error, acc.numpy()))
    """

    print('training time = {}s'.format(int((time.time() - train_start))))



    torch.save(net, "src\\model\\" + username + "_personalized_train.pth")
    text = "System calibration completed"

    return jsonify({"msg": "Training Done"})

    
def generate_frames(username,activity,duration):
    net = torch.load("src\\model\\" + username + "_personalized_train.pth")
    net.eval()
    text = "System Calibration Completed"

    mp_face_mesh = mp.solutions.face_mesh
    mp_drawing = mp.solutions.drawing_utils
    mp_drawing_styles = mp.solutions.drawing_styles

    cap = cv2.VideoCapture(0)

    i = 0
    keypoints_frame = np.zeros(shape=(1, 28080))

    with mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=False,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5) as face_mesh:
        while cap.isOpened():
            success, image = cap.read()
            if not success:
                break

            image.flags.writeable = False
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            results = face_mesh.process(image)

            image.flags.writeable = True
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

            if results.multi_face_landmarks:
                for face_landmarks in results.multi_face_landmarks:
                    x1 = face_landmarks.landmark[10].x
                    y1 = face_landmarks.landmark[10].y
                    x2 = face_landmarks.landmark[152].x
                    y2 = face_landmarks.landmark[152].y
                    T = est_similarity_trans(x1, y1, x2, y2)

                    for lm in face_landmarks.landmark:
                        new_xy = similarity_trans(lm.x, lm.y, T)
                        keypoints_frame[0, i] = new_xy[0][0]
                        i += 1
                        keypoints_frame[0, i] = new_xy[0][1]
                        i += 1

                        if i == 28080:
                            keypoints_frame = keypoints_frame.astype(np.float32)
                            tensor1 = torch.from_numpy(keypoints_frame)
                            inputs = Variable(tensor1)
                            out = net(inputs)
                            max_val, index = torch.max(out, dim=1)

                            if index[0] == 0:
                                text = "Pain"
                            elif index[0] == 1:
                                text = "Mild pain"
                            else:
                                text = "No pain"

                            i = 0
                            break

                    mp_drawing.draw_landmarks(
                        image=image,
                        landmark_list=face_landmarks,
                        connections=mp_face_mesh.FACEMESH_TESSELATION,
                        landmark_drawing_spec=None,
                        connection_drawing_spec=mp_drawing_styles.get_default_face_mesh_tesselation_style())
            else:
                text = 'No face detected'

            image = cv2.flip(image, 1)
            print(text)
            cv2.putText(image, text, (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_4)
            current_time = datetime.datetime.now().strftime("%m/%d/%Y")
            createRecord(username, activity,duration,text,"10/07/2023")
            ret, buffer = cv2.imencode('.jpg', image)
            if not ret:
                break
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            
        
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True, use_reloader=False)