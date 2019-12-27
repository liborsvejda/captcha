const fs = require("fs");
const unique = require("unique");

const IMAGES = [
    {"file":"captcha1.png", "code":"WXPGV"},
    {"file":"captcha2.png", "code":"DkXXP"},
    {"file":"captcha3.png", "code":"LSYXk"},
    {"file":"captcha4.png", "code":"N4WW"},
    {"file":"captcha5.png", "code":"NMXdVV"},
];

let list = new Array();

exports.apiCaptcha = function (req, res) {
    if (req.pathname.endsWith("/next")) {
        let listItem = {};
        listItem.imgId = Math.floor(Math.random() * IMAGES.length);
        listItem.attemptsLeft = 3; //max. 3 pokusy
        let imgUid = "cptch"+unique();
        list[imgUid] = listItem;
        let obj = {};
        obj.uid = imgUid;
        res.writeHead(200, {"Content-type": "application/json"});
        res.end(JSON.stringify(obj));
    } else if (req.pathname.endsWith("/img")) {
        let fileName = "_notfound_.png";
        let listItem = list[req.parameters.uid];
        if (listItem) {
            fileName = "res/captcha/" + IMAGES[listItem.imgId].file;
        }
        try {
            fs.readFile(fileName, function (err, data) {
                res.writeHead(200, {'Content-Type': 'image/png'});
                res.write(data);
                res.end();
            });
        } catch (e) {
            res.writeHead(404);
            res.end();
        }
    } else if (req.pathname.endsWith("/verify")) {
        let listItem = list[req.parameters.uid];
        let obj = {};
        if (!listItem) { //nenalezen
            obj.verified = false;
        } else if (listItem.attemptsLeft < 1) {
            obj.verified = false;
            obj.expired = true;
        } else {
            listItem.attemptsLeft--;
            if (req.parameters.cs) { //case sensitive
                obj.verified = (req.parameters.code === IMAGES[listItem.imgId].code);
            } else {
                obj.verified = (req.parameters.code.toLowerCase() === IMAGES[listItem.imgId].code.toLowerCase());
            }
            if (obj.verified === true) {
                listItem.attemptsLeft = 0; //po uspesne verifikaci se vyradi
            }
        }
        res.writeHead(200, {"Content-type": "application/json"});
        res.end(JSON.stringify(obj));
    }
}
