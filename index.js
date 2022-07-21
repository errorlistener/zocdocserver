var app=require('express')();
var http=require('http').Server(app);
var io=require('socket.io')(http);

app.get('/',function(req,res){
    res.sendFile('index.html',{root: __dirname})
});
app.get('/call.html',function(req,res){
    res.sendFile('call.html',{root: __dirname})
});

function User(id,uniqueCode,qrCode)
{
    this.id=id;
    this.uniqueCode=uniqueCode;
    this.qrCode=qrCode;
}

var ArrayList =  require('arraylist')
var listUser=new ArrayList;




function createRandomNumber(){

    let randomNumber=Math.floor(1000 + Math.random() * 9000);

    listUser.find(function(user){
        if (user.uniqueCode==randomNumber)
        {
            return createRandomNumber();
        }
    })

    return Math.floor(1000 + Math.random() * 9000);
}


io.on('connection',function(socket){

    console.log('A new user '+socket.id+' is connected!');


    socket.on('client_send_code',function(objectClient){
       
        listUser.add(new User(socket.id,objectClient.uniqueCode,objectClient.qrCode))
        console.log(listUser.size()+' size!'); 
        console.log('uniqueCode: '+objectClient.uniqueCode+' qrCode: '+objectClient.qrCode);
        io.sockets.emit(objectClient.uniqueCode,objectClient.qrCode);
    });

    socket.on('get_last_qr_code',function(objectClient){
        listUser.unique();
        listUser.find(function(user){
            if (user.id==socket.id)
            {
                //console.log('get_last_qr_code: '+objectClient +' lastQr: '+user.qrCode);
                io.sockets.emit(objectClient,user.qrCode);
            }
        })
       
    });


    socket.on('disconnect',function(){
        listUser.unique();

        var tempList=new ArrayList;
        console.log(listUser.size()+' size!'); 
        var tempList=listUser.find(function(user){
            return (user.id==socket.id)
        })
        
        listUser.removeAll(tempList);
        tempList.clear();
        //console.log(tempList.size()+'tempList size!');
        //console.log(listUser.size()+' size!'); 
    });

    io.sockets.emit(socket.id,createRandomNumber());

});


http.listen(process.env.PORT || 3000,function(){
    console.log('server start from 3000 port!'+process.env.PORT); 
});
