import axios from "axios";
export default axios.create({
    baseURL: "http://192.168.230.174:8081/api/songs"
});