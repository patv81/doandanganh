const express = require("express");
const app = express();
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let port = 3000;

const readLastLines = require('read-last-lines');

app.use("/static", express.static(__dirname + "/static"));
app.set("view engine", "ejs");

const mqtt = require('mqtt');
const current = new Date()
var init = {}

var server = app.listen(port, function () {
    console.log("helloworld")
    // let file = current.toLocaleDateString('vn-VN').replace(/\//g, '-')+'.txt';
    let urlTempHumid = path.join(__dirname, 'static', 'file', 'temp-humid', current.toLocaleDateString('vn-VN').replace(/\//g, '-') + '.txt');
    let urlTempHumidfol = path.join(__dirname, 'static', 'file', 'temp-humid')
    let urlDRV = path.join(__dirname, 'static', 'file', 'drv', current.toLocaleDateString('vn-VN').replace(/\//g, '-') + '.txt');
    let urlDRVfol = path.join(__dirname, 'static', 'file', 'drv')
    // readLastLines.read(urlTempHumid, 1)
    //     .then((lines) => {
    //         data = JSON.parse(lines);
    //         init.temp = data.data.split("-")[0];
    //         init.humid = data.data.split("-")[1];
    //         init.time = data.time
    //         console.log(data)
    //     });
    readLastLines.read(urlDRV, 1)
        .then((lines) => {
            data = JSON.parse(lines);
            console.log(data)
        }).catch((error) => {
            console.log("error rooi")
            const getMostRecentFile = (dir) => {
                const files = orderReccentFiles(dir);
                return files.length ? files[0] : undefined;
            };
            const orderReccentFiles = (dir) => {
                return fs.readdirSync(dir)
                    .filter((file) => fs.lstatSync(path.join(dir, file)).isFile())
                    .map((file) => ({ file, mtime: fs.lstatSync(path.join(dir, file)).mtime }))
                    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
            };
            lastfile = getMostRecentFile(urlDRVfol).file;
            lastfileurl = path.join(__dirname, 'static', 'file', 'drv', lastfile);
            console.log(lastfileurl)

            // readLastLines.read(lastfileurl, 1)
            //     .then((lines) => {
            //         data = JSON.parse(lines);
            //         console.log(data)
            //         init.drv.data = data.data
            //         init.drv.time =
            // })
        });
})

app.on('listening', function () {
    console.log('The server is running!');
});

const io = require('socket.io')(server);
app.get('/test', function (req, res) {
    res.render('user/test');
})
app.get('/', function (req, res) {
    res.render('user/dashboard')
})
app.get('/t2', function (req, res) {
    res.render('user/t2')
})
const client = mqtt.connect("mqtt://io.adafruit.com", {
    protocolVersion: 3,
    clientId: 'my-device',
    username: 'ligemos',
    password: 'aio_bDjB19gteGG0sy3jNrCtbnRKZruA'
})
// http://dadn.esp32thanhdanh.link/
// const client = mqtt.connect("mqtt://io.adafruit.com", {
//     protocolVersion: 3,
//     clientId: 'Pham-Hoa',
//     username: 'CSE_BBC',
//     password: 'aio_aaXQ56Mtv3RWWwps1wWDPCWdq8S6'
// })
// const client2 = mqtt.connect("mqtt://io.adafruit.com", {
//     protocolVersion: 3,
//     clientId: 'Pham-Hoa',
//     username: 'CSE_BBC1',
//     password: 'aio_uUDl88Sq5jw4MFWMByHYXX3jvlUm'
// })


io.on('connection', function (socket) {
    console.log("make socket connection", socket.id)
    socket.on("info-drv", formData => {
        // socket.broadcast.emit('infos', formDate);
        console.log("inside conection io.on info-drv", formData);
        data = {
            "id": "10",
            "name": "DRV_PWM",
            "data": formData,
            "unit": ""
        }
        console.log('socket.on(info-drv)', data);

        client.publish('ligemos/feeds/bk-iot-drv', JSON.stringify(data), { qos: 2, retain: true }, function (err) {
            if (err) {
                console.log("error publish", err);
            }
        });
    })
})




client.subscribe('ligemos/feeds/test', function (err) {
    if (err) {
        console.log(err)
    }
})
client.subscribe('ligemos/feeds/bk-iot-drv', function (err) {
    if (err) {
        console.log(err)
    }
})

client.on('connect', function () {
})

client.on('message', function (topic, message) {
    // message is Buffer
    let data = message.toString();
    if (topic == "ligemos/feeds/test") {

        let time = new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });
        io.emit('info-temp-humid', { data: data, time: time });

        let url = path.join(__dirname, 'static', 'file', 'temp-humid', current.toLocaleDateString('vn-VN').replace(/\//g, '-') + '.txt');
        data = JSON.parse(data);
        data.time = time
        fs.appendFile(url, JSON.stringify(data) + '\n', function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    }
    else if (topic == "ligemos/feeds/bk-iot-drv") {
        console.log("data", data);
        let time = new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });
        io.emit('front-end-info-drv', { data: data, time: time });
        let url = path.join(__dirname, 'static', 'file', 'drv', current.toLocaleDateString('vn-VN').replace(/\//g, '-') + '.txt');
        data = JSON.parse(data);
        data.time = time
        fs.appendFile(url, JSON.stringify(data) + '\n', function (err) {
            if (err) throw err;
            console.log('Saved drv!');
        });
    }

})

client.on("error", function (error) {
    console.log("ERROR: ", error);
});

client.on('offline', function () {
    console.log("offline");
});

client.on('reconnect', function () {
    console.log("reconnect");
});


// ////////////////////////////////////////////////////////

// const express = require("express");
// const app = express();
// const fs = require('fs');
// const path = require('path');
// const axios = require('axios');
// require('dotenv').config();

// let port = 3000;
// let KEY = '';

// app.use("/static", express.static(__dirname + "/static"));
// app.set("view engine", "ejs");

// const mqtt = require('mqtt');
// const current = new Date()


// var server = app.listen(port, function () {
//     console.log("helloworld")
// })
// const io = require('socket.io')(server);
// app.get('/test', function (req, res) {
//     res.render('user/test');
// })
// app.get('/', function (req, res) {
//     res.render('user/dashboard')
// })
// app.get('/t2', function (req, res) {
//     res.render('user/t2')
// })
app.get('/log', function (req, res) {
    testFolder = path.join(__dirname, 'static', 'file', 'temp-humid');

    let files = fs.readdir(testFolder, (err, files) => {
        console.log(files)
        res.render('user/log', { files: files });
    });
})
// // const client = mqtt.connect("mqtt://io.adafruit.com", {
// //     protocolVersion: 3,
// //     clientId: 'my-device',
// //     username: 'ligemos',
// //     password: 'aio_bDjB19gteGG0sy3jNrCtbnRKZruA'
// // })
// // http://dadn.esp32thanhdanh.link/
// let client = mqtt.connect("mqtt://io.adafruit.com", {
//     protocolVersion: 3,
//     clientId: 'Pham-Hoa',
//     username: 'CSE_BBC',
//     password: 'aio_YWqQ75LLnzE66cGrbMWNhCka1Xhb'
//     // password:KEY,
// })
// const client2 = mqtt.connect("mqtt://io.adafruit.com", {
//     protocolVersion: 3,
//     clientId: 'Pham-Hoa',
//     username: 'CSE_BBC1',
//     password: 'aio_uUDl88Sq5jw4MFWMByHYXX3jvlUm'
// })


// io.on('connection', function (socket) {
//     console.log("make socket connection", socket.id)
//     socket.on("info-drv", formData => {
//         // socket.broadcast.emit('infos', formDate);
//         console.log("inside conection io.on info-drv", formData);
//         data = {
//             "id": "10",
//             "name": "DRV_PWM",
//             "data": formData,
//             "unit": ""
//         }
//         console.log('socket.on(info-drv)', data);

//         client.publish('CSE_BBC/feeds/bk-iot-drv', JSON.stringify(data), { qos: 2, retain: true }, function (err) {
//             if (err) {
//                 console.log("error publish", err);
//             }else{
//                 console.log("oublish drv")
//             }
//         });
//     })
// })




// client.subscribe('CSE_BBC/feeds/bk-iot-temp-humid', function (err) {
//     if (err) {
//         console.log(err)
//     }
// })
// client.subscribe('CSE_BBC/feeds/bk-iot-drv', function (err) {
//     if (err) {
//         console.log(err)
//     }
// })

// client.on('connect', function () {
// })

// client.on('message', function (topic, message, packet) {
//     // message is Buffer
//     let data = message.toString();
//     if (topic == "CSE_BBC/feeds/bk-iot-temp-humid") {

//         let time = new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });
//         io.emit('info-temp-humid', { data: data, time: time });

//         let url = path.join(__dirname, 'static', 'file', 'temp-humid', current.toLocaleDateString('vn-VN').replace(/\//g, '-') + '.txt');
//         data = JSON.parse(data);
//         data.time = time
//         fs.appendFile(url, JSON.stringify(data) + '\n', function (err) {
//             if (err) throw err;
//             console.log('Saved!');
//         });
//     }
//     else if (topic == "CSE_BBC/feeds/bk-iot-drv") {
//         console.log("data", data);
//         let time = new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });
//         io.emit('front-end-info-drv', { data: data, time: time });
//         let url = path.join(__dirname, 'static', 'file', 'drv', current.toLocaleDateString('vn-VN').replace(/\//g, '-') + '.txt');
//         data = JSON.parse(data);
//         data.time = time
//         fs.appendFile(url, JSON.stringify(data) + '\n', function (err) {
//             if (err) throw err;
//             console.log('Saved drv! :' ,'retain ', packet.retain );
//         });
//     }

// })

// client.on("error", function (error) {
//     console.log("ERROR: ", error);
// });

// client.on('offline', function () {
//     console.log("offline");
// });

// client.on('reconnect', function () {
//     console.log("reconnect");
//     axios.get("http://dadn.esp32thanhdanh.link/")
//     .then(res => res.data)
//     .then(res=>{
//         KEY = res.keyBBC;
//         client.options.password= res.keyBBC;
//     });
//     console.log(KEY);

// });