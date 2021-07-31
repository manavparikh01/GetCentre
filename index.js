const express = require('express');
const app = express();
const request = require('request');
const ejs = require('ejs');
const path = require('path');
const { response } = require('express');

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/centers', (req, res) => {
    res.render('slots');
})

app.post('/centers', async(req, res) => {
    console.log(req.body);
    var pincode = req.body.slots;
    var today = new Date();
    var datenow = today.getDate()+'-0'+(today.getMonth()+1)+'-'+today.getFullYear();
    console.log(datenow);
    var url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${pincode}&date=${datenow}`;
    request({ url: url }, (error, response) => {
        const data = JSON.parse(response.body);
        if (data.centers) {
            const centerdata = data.centers;
            res.render('centers', { pincode, centerdata});
        } else {
            res.redirect('/centers');
        }
        

        //console.log(centerdata);
        // for (let center of centerdata) {
        //     console.log(center.center_id);
        // }
        //console.log(data);

    })
})

app.get('/centers/:pincode/:center_id', (req, res) => {
    const { pincode, center_id } = req.params;
    var today = new Date();
    var datenow = today.getDate()+'-0'+(today.getMonth()+1)+'-'+today.getFullYear();
    console.log(datenow);
    var url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${pincode}&date=${datenow}`;
    request({ url: url }, (error, response) => {
        const data = JSON.parse(response.body);
        if (data.centers) {
            const centerdata = data.centers;
            for (let center of centerdata) {
                if (center.center_id == center_id) {
                    res.render('vaccinationdates', { center })
                }
                else {
                    res.render('centers', { pincode, center })
                }
            }
        } else {
            res.redirect('/centers');
        }
    })
})

app.listen(port, () => {
    console.log('the server is at your service')
})