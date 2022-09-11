import date from 'date-and-time';
import timezone from 'date-and-time/plugin/timezone';
date.plugin(timezone);

export class apiService {
    tgl = new Date();
    dateTimeNow = date.formatTZ(this.tgl, 'YYYY-MM-DD HH:mm:ss', 'Asia/Jakarta');
    cekShift = [0];
    cekStatus = [""];
    saveBodyDateTime;
    sendStatus = (status) =>{
        return this.cekStatus.splice(0,1, status);
    }
    compareDateTime = (yearNow, monthNow, dateNow, hoursNow, minutesNow, yearBody, monthBody, dateBody, hoursBody, minutesBody, shiftBody) => {
        let compareDate = false;
        let compareTime = false;
        if (yearNow === yearBody) {
            if (monthNow === monthBody) {
                if (dateNow === dateBody) {
                    compareDate = true;
                }
            }
        }
        
        if (hoursNow === hoursBody) {
            if (minutesBody >= minutesNow - 2 && minutesBody <= minutesNow + 2) { //bug di pergantian jam menit 00
                compareTime = true;
                switch (shiftBody) {
                    case 1:
                        if (hoursBody >= 7 && hoursBody <= 14) {
                            if (hoursBody == 14 && minutesBody >= 1) {
                                // this.cekStatus.splice(0,1,"gagal");
                                this.sendStatus("gagal");    
                            } else {
                                // this.cekStatus.splice(0,1,"sukses");
                                this.sendStatus("sukses");
                            }
                        } else {
                            // this.cekStatus.splice(0,1,"gagal");
                            this.sendStatus("gagal");
                        }
                        break;
                    case 2:
                        if (hoursBody >= 14 && hoursBody <= 21) {
                            if (hoursBody == 21 && minutesBody >= 1) {
                                // this.cekStatus.splice(0,1,"gagal");
                                this.sendStatus("gagal");
                            } else {
                                // this.cekStatus.splice(0,1,"sukses");
                                this.sendStatus("sukses");
                            }
                        } else {
                            // this.cekStatus.splice(0,1,"gagal");
                            this.sendStatus("gagal");
                        }
                    break;
                    case 3:
                        if ((hoursBody >= 21 && hoursBody <= 23) || hoursBody < 7) {
                        // this.cekStatus.splice(0,1,"sukses");
                        this.sendStatus("sukses");
                    } else {
                        // this.cekStatus.splice(0,1,"gagal");
                        this.sendStatus("gagal");
                    }
                    break;
                
                    default:
                        this.sendStatus("parameter unregocnized")
                        break;
                }
            } else {
                this.sendStatus("gagal");
            }
        }
        console.info(compareDate);
        console.info(compareTime);
        console.info(minutesNow - 2);
        console.info(minutesNow + 2);
    };
    
    getRootJson(req, res) {
        res.write(JSON.stringify({
            datetime: this.dateTimeNow,
        }));
        res.end();
    }
    
    getJsonData() {
        return JSON.stringify({
            status: this.cekStatus.map((value) => {
                return value
            }),
            shift: this.cekShift.map((value) => {
                return value
            }),
            datetime: this.dateTimeNow
        });
    }
    
    getSop(req, res) {
        res.write(this.getJsonData());
        res.end();
    }
    
    createSop(req,res) {
        req.addListener("data", (data) => {
            const body = JSON.parse(data.toString());
            this.cekShift.splice(0,1,body.shift);
            const waktu = date.preparse(body.datetime, 'YYYY-MM-DD HH:mm:ss');
            const waktuServer = date.preparse(this.dateTimeNow, 'YYYY-MM-DD HH:mm:ss');
            this.compareDateTime(waktuServer.Y, waktuServer.M, waktuServer.D, waktuServer.H, waktuServer.m,
                waktu.Y, waktu.M, waktu.D, waktu.H, waktu.m, body.shift);
            this.saveBodyDateTime = body.datetime;
            console.info(this.saveBodyDateTime);
            res.write(this.getJsonData());
            res.end();
        })
    }
}