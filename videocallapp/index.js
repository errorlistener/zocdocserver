
app.get('/',function(req,res){
    res.sendFile('index.html',{root: __dirname})
});



    





http.listen(process.env.PORT || 3000,function(){
    console.log('server start from 3000 port!'); 
});
