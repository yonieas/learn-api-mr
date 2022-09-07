import date from 'date-and-time';
import timezone from 'date-and-time/plugin/timezone';
date.plugin(timezone);

export class apiService {
    
    listPeriode = [0];
    cekStatus = [""];
    tgl = new Date();
    saveBody;

    // compareDate = (yearNow, monthNow, dateNow, hoursNow, minutesNow, yearBody, monthBody, dateBody, hoursBody, minutesBody) => {

    // };

    getRootJson(req, res) {
        res.write(JSON.stringify({
            datetime: date.formatTZ(this.tgl, 'YYYY-MM-DD HH:mm:ss', 'Asia/Jakarta'),
            // datetimeLocal: date.format(this.tgl, 'YYYY-MM-DD HH:mm:ss')
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
            const body = JSON.parse(data.toString());
            this.listPeriode.splice(0,1,body.shift);
            const waktu = date.preparse(body.datetime, 'YYYY-MM-DD HH:mm:ss');
            if (body.shift === 1) {
                if (this.tgl.H && waktu.H >= 7) {
                    this.cekStatus.splice(0,1,"sukses");
                } else {
                    this.cekStatus.splice(0,1,"gagal");
                }
            }
            /*
            switch (body.shift) {
                case 1:
                    if (waktu.H >= 7 && waktu.H <= 14) {
                        if (waktu.H == 14 && waktu.m >= 1) {
                            this.cekStatus.splice(0,1,"gagal");    
                        } else {
                            this.cekStatus.splice(0,1,"sukses");
                        }
                    } else {
                        this.cekStatus.splice(0,1,"gagal");
                    }
                    break;
                case 2:
                    if (waktu.H >= 14 && waktu.H <= 21) {
                        if (waktu.H == 21 && waktu.m >= 1) {
                            this.cekStatus.splice(0,1,"gagal");
                        } else {
                            this.cekStatus.splice(0,1,"sukses");
                        }
                    } else {
                        this.cekStatus.splice(0,1,"gagal");
                    }
                    break;
                case 3:
                    if ((waktu.H >= 21 && waktu.H <= 23) || waktu.H < 7) {
                        this.cekStatus.splice(0,1,"sukses");
                    } else {
                        this.cekStatus.splice(0,1,"gagal");
                    }
                    break;
            
                default:
                    break;
            }
            */
            this.saveBody = body.datetime;
            console.info(this.listPeriode);
            console.info(this.cekStatus);
            res.write(this.getJsonData());
            res.end();
        })
    }
}

//