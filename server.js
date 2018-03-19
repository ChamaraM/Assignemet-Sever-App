var express=require('express');
var app=express();
var fs = require('fs');
var count = 0;
var dateTime = require('node-datetime');

app.use(function (req, res, next) {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
next();
});

app.get('/getData',function(req,res)
{
	var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
	console.log(ip);
	var readline = require('readline');
	var p = Object.create(null);
	var respons;
	var dt = dateTime.create();
	var dateAndTime = dt.format('Y-m-d H:M:S');

	try{
		var array = fs.readFileSync('data_File.txt').toString().split("\n");
		var arrayLength = array.length;
		if(count>=arrayLength)
		{
			count = 0;
		}

		try{
			respons = JSON.parse(array[count]);
			fs.appendFileSync('server_log.txt','[ Client: '+ ip +' ]' + ' [' + dateAndTime +'] '+'"GET /getData" ' + 200 +'\r\n', function (err) {
				if (err) 
				return console.log(err);
			});
		
		}
		catch(err){
		
			fs.appendFileSync('server_log.txt', '[ Client: '+ ip +' ] ' + '[' + dateAndTime +'] '+'"GET /getData " ' + 500+ ' ' + 'Data not stored in valid JSON Format!' +'\r\n', function (err) {
			if (err) 
				return console.log(err);
			});
			respons = "Error";
		}
	
		count++;
	}
	catch(err){
	
		fs.appendFileSync('server_log.txt', '[ Client: '+ ip +' ] ' + '[' + dateAndTime +'] '+'"GET /getData" ' + 500 + ' ' + err +'\r\n', function (err) {
		if (err) 
			return console.log(err);
		});
		respons = "Error";
	}

	res.send(respons);

});

var server=app.listen(3000,function() {
	var dt = dateTime.create();
	var dateAndTime = dt.format('Y-m-d H:M:S');
	fs.appendFileSync('server_log.txt',  '[' + dateAndTime +'] '+' Server Up and Runing! ' + ' Listening to PORT 3000' +'\r\n', function (err) {
		if (err) 
			return console.log(err);
	});
	console.log("Server Up and Runing!");
	console.log("Listening to PORT 3000");
});