import http from "http";
import { apiService } from "./service.js";
// const now = new Date();
// const tgl = date.format(now, 'YYYY/MM/DD HH:mm:ss');
// console.info(tgl);
// console.info(date.parse(tgl, 'YYYY/MM/DD HH:mm:ss', true));
const service = new apiService();
const server = http.createServer((req, res) => {
    console.info(req.method);
    res.setHeader("Content-Type", "application/json");

    if(req.url === "/sop"){
        if (req.method === "GET") {
            service.getSop(req, res);
        }
        if (req.method === "POST") {
            service.createSop(req,res);
        }
    }

});

server.listen(3000);