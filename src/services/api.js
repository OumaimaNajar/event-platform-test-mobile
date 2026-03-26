import axios from "axios";
import { API_URL } from "@env";

const API = axios.create({
  baseURL: API_URL,
});

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common.Authorization;
  }
};

export const getEvents = () => API.get("/events");
export const getEvent = (id) => API.get(`/events/${id}`);
export const signup = (data) => API.post("/auth/signup", data);
export const signin = (data) => API.post("/auth/signin", data);
export const registerToEvent = (id) => API.post(`/events/${id}/register`);
export const getClients = (id) => API.get(`/events/${id}/clients`);