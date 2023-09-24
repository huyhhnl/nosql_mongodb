// Bài 1: Đếm tất cả những người có tên là Pauline Fournier.
db.people.find({
	firstName:'Pauline',
	lastName:'Fournier'
}).count();

// Bài 2: Đếm tất cả những người có tên là Pauline Fournier và sinh trước ngày 01/01/1970.
db.people.count({
	firstName:'Pauline',
	lastName:'Fournier',
	birthDate:{$lt: new Date('1970-01-01')}
});
/* Bài 3: Đếm tất cả những người có tên:
Lucas Dubois
Camille Dubois
*/
db.people.find({
	$or:[
	{
		firstName:'Lucas',
		lastName:'Dubois'
	},
	{
		firstName:'Camille',
		lastName:'Dubois'
	}
]	
}).count();

/*Bài 4: Đếm tất cả những người không có khoản tín dụng (credits) nào. Bạn có thể tìm thấy các khoản tín
 dụng trong trường wealth.credits.,trường này là một mảng, vì mọi người có thể có một hoặc nhiều khoản tín
  dụng, nếu là mảng rỗng thì tức là không có khoản tín dụng nào.*/
 db.people.count({
 	'wealth.credits':{$size:0}
 });

 /*Bài 5: Đếm tất cả những người đã tiêu chính xác 12.99$ cho rạp chiếu phim (cinema). Tất cả các khoản 
 thanh toán được lưu trữ trong trường mảng payments, bạn hãy xem qua cấu trúc các phần tử trong mảng này 
 để viết truy vấn cho hợp lý.*/
 db.people.count({
 	payments:{$elemMatch:{name:'cinema', amount:12.99}}
 })

 /* Bài 6: Hãy đếm tất cả những người có lần thanh toán đầu tiên là thanh toán 12.99$ cho rạp chiếu phim 
 (cinema). Ở bài này bạn chỉ đếm các trường hợp có payments[0] thỏa mãn yêu cầu trên.*/
db.people.count({
  "payments.0.name": "cinema",
  "payments.0.amount": 12.99
})

/* Bài 7: Hãy đếm tất cả những người chưa bao giờ đến rạp chiếu phim (chưa có khoản thanh toán nào dành cho 
cinema).*/ có note
db.people.count({
	"payments.name" :{$ne:"cinema"}
})
hoặc
db.people.count({
  "payments.name": {
    $nin: ["cinema"]
  }
})
// cái này sai 
db.people.count({
	payments:{$elemMatch:{name:{$ne:"cinema"}}}
});

/*Bài 8: Hãy đếm tất cả những phụ nữ đã chi hơn 100$ cho giày (shoes) và hơn 50$ cho quần (pants) trong
1 hóa đơn.*/
db.people.count({
	sex:'female',
	$and:[{payments:{$elemMatch:{name:'shoes', amount:{$gt:100}}}},{payments:{$elemMatch:{name:'pants', amount:{$gt:50}}}}]
})
/* Bài 9: Hãy đếm tất cả những người từ Warsaw, Poland đã đến rạp chiếu phim (cinema) nhưng chưa bao 
giờ đến vũ trường (disco).*/
db.people.count({
	"address.city":'Warsaw',
	$and:[{"payments.name":{$nin:['disco']}},
	{"payments.name":'cinema'}
]})

/* Bài 10: Đếm tất cả phụ nữ từ Paris và đàn ông từ Cracow mà có tất cả các tài sản sau:

flat
house
land
Ít nhất một trong số các tài sản đó phải có giá trên 2.000.000$, và không tài sản nào trong số đó có giá 
dưới 500.000$.

Gợi ý, các tài sản được lưu trữ ở trường "wealth.realEstates"*/
db.people.find({"address.city":{$in:['Cracow', 'Paris']}}).pretty()
db.people.count({
	$or:[{sex:'female', "address.city":'Paris'}, {sex:'male', "address.city":'Cracow'}],
	$and:[
		{"wealth.realEstates":{$elemMatch:{type:'flat', worth:{$gt:500000}}}}, 
		{"wealth.realEstates":{$elemMatch:{type:'house', worth:{$gt:500000}}}},
		{"wealth.realEstates":{$elemMatch:{type:'land', worth:{$gt:500000}}}}
		],
	"wealth.realEstates.worth":{$gt:2000000}

})

//Bài 11: Đếm tất cả những người có đúng 10 giao dịch.
db.people.count({payments:{$size:10}})

/* Bài 12: Tìm tất cả những người có firstName = 'Thomas' và chỉ trả về các trường sau: _id, firstName 
và lastName.*/
db.people.find({
	firstName:'Thomas'
	},
	{
		firstName:1, lastName:1
	} 
).pretty()

/* Bài 13: Tìm tất cả những người có một hoặc nhiều giao dịch có giá trị bé hơn 5$. Kết quả trả về chỉ
 gồm các trường firstName, lastName và payments chỉ chứa phần từ đầu tiên có amount bé hơn 5$.*/
 db.people.find(
 	{
 		"payments.amount":{$lt:5},
 	},
 	{
 		firstName:1, lastName:1, "payments.$":1
 	}
).pretty()

 // Bài 14: Thêm một phần tử vào payments của những người đang ở Pháp (France) với cấu trúc như sau:
 db.people.updateOne({
 	"address.country":'France'},
 	$push:{payments:{
		category: "relax",
		name: "disco",
		amount: 5.06
					}
 	)

// Bài 15: Xóa tất cả các trường market của tất cả mọi người.
db.people.updateMany({}, {$unset:{"wealth.market":""}})
