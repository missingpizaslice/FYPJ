import * as types from "./actionType";
import axios from "axios";

const API = "http://localhost:5000";

const doctorAdded = (msg) => ({
  type: types.ADD_DOCTOR,
  payload: msg,
});

const getDoctor = (doctor) => ({
  type: types.GET_SINGLE_DOCTOR,
  payload: doctor,
});

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
