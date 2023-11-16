import * as types from "./actionType";
import axios from "axios";

const API = "http://localhost:5000";

const doctorAdded = (msg) => ({
  type: types.ADD_DOCTOR,
  payload: msg,
});

const auth_msg_model = (msg) => ({
  type: types.auth_model,
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

export const clearMessage = (msg) => ({
  type: types.CLEAR_MSG,
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

const FramesGet = (frames) => ({
  type: types.GET_FRAMES,
  payload: frames,
})


// ==================== Actions ====================

export const loginAuth = (login) => {
  return function (dispatch) {
    axios
      .post(`${API}/api/authenticate`, login)
      .then((resp) => {
        console.log(resp)
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

export const getDoctors = () => {
  return function (dispatch) {
    axios
      .get(`${API}/api/doctor`)
      .then((resp) => {
        dispatch(doctorGet(resp.data));
      })
      .catch((err) => console.log(err));
  };
};


export const addPatientModel = (name) => {
  return function (dispatch){
    console.log(name)
    axios
      .post(`${API}/start_opencv`, name)
      .then((resp) => {
        if (resp.data.msg) {
        dispatch(auth_msg_model(resp.data.msg));
        }
      })
      .catch((err) => console.log(err));
  };
};


export const getRecords = (id, date) => {
  return function (dispatch) {
    // You can include the date in the API request if needed
    axios
      .get(`${API}/api/record/${id}`, {
        params: { date: date } // Include the date as a query parameter if needed
      })
      .then((resp) => {
        console.log(resp.data);
        dispatch(RecordsGet(resp.data));
      })
      .catch((err) => console.log(err));
  };
};

export const getFrames = (data) => {
  return function (dispatch) {
    axios
      .get(`${API}/start_opencv`,data)
      .then((resp) => {
        dispatch(FramesGet(resp.data));
      })
      .catch((err) => console.log(err));
  };
};

export const passwordUpdate = (data) => {
  return function (dispatch) {
    axios
      .post(`${API}/api/updatePassword`, data)
      .then((resp) => {
        dispatch(patientAdded(resp.data.msg));
      })
      .catch((err) => console.log(err));
  };
};
