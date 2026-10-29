// Chạy: node server.js  → mở http://localhost:3000
// Phục vụ kira-chat.html và chuyển tiếp /api/v1/* tới kiraai.vn (tránh lỗi CORS).
const http=require('http'),https=require('https'),fs=require('fs'),path=require('path');
const PORT=process.env.PORT||3000,TARGET='kiraai.vn';
http.createServer((req,res)=>{
  if(req.url.startsWith('/api/')){
    const up=https.request({host:TARGET,path:req.url,method:req.method,headers:{...req.headers,host:TARGET}},r=>{
      res.writeHead(r.statusCode,r.headers);r.pipe(res);
    });
    up.on('error',e=>{res.writeHead(502);res.end(JSON.stringify({error:{message:e.message}}))});
    return req.pipe(up);
  }
  res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
  fs.createReadStream(path.join(__dirname,'kira-chat.html')).pipe(res);
}).listen(PORT,()=>console.log('Kira Chat: http://localhost:'+PORT));
