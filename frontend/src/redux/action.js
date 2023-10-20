import * as types from "./actionType";
import axios from "axios";

const API = "http://localhost:5000";

const doctorAdded = (msg) => ({
  type: types.ADD_DOCTOR,
  payload: msg,
});

const patientAdded = (msg) => ({
  type: types.ADD_PATIENT,
  payload: msg,
});

const getDoctor = (doctor) => ({
  type: types.GET_SINGLE_DOCTOR,
  payload: doctor,
});

const patientGet = (patients) => ({
  type: types.GET_PATIENTS,
  payload: patients,
});

const doctorGet = (doctors) => ({
  type: types.GET_DOCTOR,
  payload: doctors,
});

const doctorAuthenticated = (data) => ({
  type: types.AUTHENTICATE,
  payload: data,
});

export const setMessage = (msg) => ({
  type: types.SET_MSG,
  payload: msg,
});

export const searchPatient = (patients) => ({
  type: types.SET_PATIENT_VALUE,
  payload: patients,
});

const RecordsGet = (records) => ({
  type: types.GET_RECORDS,
  payload: records,
})
// ==================== Actions ====================

export const loginAuth = (login) => {
  return function (dispatch) {
    axios
      .post(`${API}/api/authenticate`, login)
      .then((resp) => {
        dispatch(doctorAuthenticated(resp.data));
      })
      .catch((err) => console.log(err));
  };
};

export const addDoctor = (doctor) => {
  return function (dispatch) {
    axios
      .post(`${API}/api/doctor`, doctor)
      .then((resp) => {
        dispatch(doctorAdded(resp.data.msg));
      })
      .catch((err) => console.log(err));
  };
};

export const addPatient = (patient) => {
  return function (dispatch) {
    axios
      .post(`${API}/api/patient`, patient)
      .then((resp) => {
        dispatch(patientAdded(resp.data.msg));
        dispatch(getPatients(patient.doctorID));
      })
      .catch((err) => console.log(err));
  };
};

export const loadsingleDoctor = (id) => {
  return function (dispatch) {
    axios
      .get(`${API}/api/doctor/${id}`)
      .then((resp) => {
        dispatch(getDoctor(resp.data));
      })
      .catch((err) => console.log(err));
  };
};

export const getPatients = (id) => {
  return function (dispatch) {
    axios
      .get(`${API}/api/patient/${id}`)
      .then((resp) => {
        dispatch(patientGet(resp.data));
      })
      .catch((err) => console.log(err));
  };
};


export const addPatientModel = (name) => {
  return function (){
    console.log(name)
    axios
      .post(`${API}/start_opencv`, name)
      .catch((err) => console.log(err));
  };
};

export const getRecords = (id) => {
  return function (dispatch) {
    axios
      .get(`${API}/api/record/${id}`)
      .then((resp) => {
        dispatch(RecordsGet(resp.data));
      })
      .catch((err) => console.log(err));
  };
};
