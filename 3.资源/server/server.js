const express = require('express');
const expressWS = require('express-ws');
const cors = require('cors');
const axios = require('axios');

const app = express();
expressWS(app);
app.use(cors());


app.get('/api/payment/weixin/createNative/:orderId', (request, response) => {
    const { orderId } = request.params;
    const { token } = request.headers;
    console.log(orderId, token);
    response.send('请求成功')
});

function sendJSON(ws, data) {
    ws.send(JSON.stringify(data))
}

app.ws('/api/payment/weixin/queryPayStatus', (ws, request) => {
    const { orderId, token } = request.query;

    sendJSON(ws, {
        type: 1,
        data: "建立持续通信成功"
    })

    ws.on('message', function (msg) {
        if (msg === "reqPayStatus") {
            sendJSON(ws, {
                type: 1,
                data: "连接持续中..."
            })
        }
    })

    getPayStatus();
    let timer = null;

    async function getPayStatus(){
        const result = await axios.get(`http://sph-h5-api.atguigu.cn/api/payment/weixin/queryPayStatus/${orderId}`,{
            headers:{
                token
            }
        })
        if(result.data.code===205){
            timer = setTimeout(getPayStatus, 1000)
        }else{

            sendJSON(ws,{
                type:2,
                data:"支付成功"
            });
        }
    }

    ws.on('close', async function (e) {
        clearInterval(timer)
        timer = undefined;
    })
})

app.listen(3000, (error) => {
    if (error) {
        console.log('错误信息:' + error);
    } else {
        console.log('服务器运行于http://localhost:3000');
    }
})