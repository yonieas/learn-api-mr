import date from 'date-and-time';
import timezone from 'date-and-time/plugin/timezone';
date.plugin(timezone);

export class apiService {
    
    listPeriode = [0];
    cekStatus = [""];
    tgl = new Date();
    saveBody;
    body;
    dateTimeNow = date.formatTZ(this.tgl, 'YYYY-MM-DD HH:mm:ss', 'Asia/Jakarta');
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
            if (minutesNow === minutesBody) {
                compareTime = true;
                switch (shiftBody) {
                    case 1:
                        if (hoursBody >= 7 && hoursBody <= 14) {
                            if (hoursBody == 14 && minutesBody >= 1) {
                                this.cekStatus.splice(0,1,"gagal");    
                            } else {
                                this.cekStatus.splice(0,1,"sukses");
                            }
                        } else {
                            this.cekStatus.splice(0,1,"gagal");
                        }
                        break;
                    case 2:
                        if (hoursBody >= 14 && hoursBody <= 21) {
                            if (hoursBody == 21 && minutesBody >= 1) {
                                this.cekStatus.splice(0,1,"gagal");
                            } else {
                                this.cekStatus.splice(0,1,"sukses");
                            }
                        } else {
                            this.cekStatus.splice(0,1,"gagal");
                        }
                        break;
                    case 3:
                        if ((hoursBody >= 21 && hoursBody <= 23) || hoursBody < 7) {
                            this.cekStatus.splice(0,1,"sukses");
                        } else {
                            this.cekStatus.splice(0,1,"gagal");
                        }
                        break;
                
                    default:
                        break;
            }
        }
    }
        console.info(compareDate);
        console.info(compareTime);
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
            shift: this.listPeriode.map((value) => {
                return value
            }),
            datetime: this.saveBody
        });
    }
    
    getSop(req, res) {
        res.write(this.getJsonData());
        res.end();
    }
    
    createSop(req,res) {
        req.addListener("data", (data) => {
            this.body = JSON.parse(data.toString());
            this.listPeriode.splice(0,1,this.body.shift);
            const waktu = date.preparse(this.body.datetime, 'YYYY-MM-DD HH:mm:ss');
            const waktuServer = date.preparse(this.dateTimeNow, 'YYYY-MM-DD HH:mm:ss');
            this.compareDateTime(waktuServer.Y, waktuServer.M, waktuServer.D, waktuServer.H, waktuServer.m,
                waktu.Y, waktu.M, waktu.D, waktu.H, waktu.m, this.body.shift);
            this.saveBody = this.body.datetime;
            console.info(this.listPeriode);
            console.info(this.cekStatus);
            res.write(this.getJsonData());
            res.end();
        })
    }
}