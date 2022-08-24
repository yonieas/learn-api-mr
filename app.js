import http from "http";
import { apiService } from "./service.js";
let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
const service = new apiService();
const server = http.createServer((req, res) => {
    console.info(req.method);
    res.setHeader("Content-Type", "application/json");
    if (req.url === "/") {
        service.getRootJson(req,res);
    } 
    
    if(req.url === "/sop"){
        if (req.method === "GET") {
            service.getSop(req, res);
        }
        if (req.method === "POST") {
            service.createSop(req,res);
        }
    }

});

// server.listen(3000);
server.listen(port);