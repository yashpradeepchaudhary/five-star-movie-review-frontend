import axios from "axios"; //It is a npm package which we can use to talk to our backend api

const client = axios.create({baseURL: "http://localhost:8000/api"});
export default client;