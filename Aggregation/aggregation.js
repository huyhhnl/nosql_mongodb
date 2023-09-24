//Bài 1: Đếm số người của từng quốc gia.
db.people.aggregate([
	{
		$group:{_id:"$address.country", "total":{$sum:1}}
	}
	
])
// Bài 2: Địa chỉ phổ biến nhất là gì và có bao nhiêu người sống ở đó?
db.people.aggregate([
	{
		$group:
		{
			_id:
			{
				"country":"$address.country",
				"city":"$address.city",
				"postalCode":"$address.postalCode",
				"street":"$address.street"
			}, 
			"total":{$sum:1}
		}

	},
	{
		$sort:{total:-1}
	},
	{
		$limit:1
	}
])

// Bài 3: Mỗi quốc gia có bao nhiêu người đã từng thanh toán ở một nhà hàng (restaurant)?
db.people.aggregate([
	{
		$match:{"payments.name":"restaurant"}
	},
	{
		$group:{_id:"$address.country", "visit":{$sum:1}}
	}

])

/* Bài 4: Tìm 3 người có tổng số dư tài khoản nhiều nhất. Nếu như một người có cùng tổng số dư tài sản
 thì hãy so sánh bằng trường "firstName" và "lastName"*/
 db.people.aggregate([
...     {
...             $project:{firstName:1, lastName:1, totalBalance:{$sum:"$wealth.bankAccounts.balance"}}
...     },
...     {
...             $sort:{totalBalance:-1, firstName:1, lastName:1}
...     },
...     {
...             $limit: 3
...     }
...
...  ])
 /* Bài 5: Đếm số lần thanh toán ở nhà hàng, tổng số tiền đã chi tiêu và số tiền trung bình cho mỗi lần
  thanh toán chia theo từng quốc gia.*/
  db.people.aggregate([
	{
		$unwind:"$payments"
	},
	{
		$match:{"payments.name":"restaurant"}
	},
	{
		$group:
		{
			_id:"$address.country",
			totalVisits:{$sum:1},
			totalAmount:{$sum:"$payments.amount"},
			avgAmount:{$avg:"$payments.amount"}
		}
	}

 ])

 /* Bài 6: Có một quốc gia mà mức thanh toán trung bình tại một nhà hàng là cao nhất và một quốc gia trong 
 đó mức thanh toán trung bình tại một nhà hàng thấp nhất. Số người của nước thứ nhất chi tiêu nhiều hơn
  người ở nước thứ hai bao nhiêu lần?*/
 db.people.aggregate([
	{
		$unwind:"$payments"
	},
	{
		$match:{"payments.name":"restaurant"}
	},
	{
		$group:
		{
			_id:"$address.country",
			totalVisits:{$sum:1},
			totalAmount:{$sum:"$payments.amount"},
			avgAmount:{$avg:"$payments.amount"}
		}
	},
	{
		$group:{_id:null, max_A:{$max:"$avgAmount"}, min_A:{$min:"$avgAmount"}}
	},
	{
		$project:{diff:{$divide:["$max_A", "$min_A"]}}
	}

 ])

 /* Bài 7: 

Viết truy vấn tìm tất cả những người có một hoặc nhiều giao dịch có giá trị bé hơn 5$. Kết quả trả về chỉ
gồm các trường firstName, lastName và mảng payments  chứa TẤT CẢ phần tử có amount bé hơn 5$.*/
db.people.aggregate([
	{
		$unwind:"$payments"
	},
	{
		$match:{"payments.amount":{$lt:5}}
	},
	{
		$group:
		{
			_id:{firstName:"$firstName", lastName:"$lastName"}, 
			payments:{$push:{category:"$payments.category", name:"$payments.name", amount:"$payments.amount"}}
		}
	},
	{
		$project:{_id:1, firstName:1, lastName:1, payments:1}
	}

])

"_id":"$_id",
{_id:"$_id._id", firstName:"$_id.firstName", lastName:"$_id.lastName", payments:1}
_id:{firstName:"$firstName", lastName:"$lastName"}, 
_id:{_id:"$_id",firstName:"$firstName", lastName:"$lastName"}, 

// Bài 8: Viết truy vấn để tính tổng giá trị mà một người đã thanh toán theo từng category.

db.people.aggregate([
  { 
  	$unwind: '$payments' 
  },

  {
    $group: 
    {
      _id: { _id:"$_id",category: '$payments.category', firstName: '$firstName', lastName: '$lastName'},
      amount: { $sum: '$payments.amount' }
    }
  },
  {
    $group: 
    {
      _id: { _id: "$_id._id",firstName: '$_id.firstName', lastName: '$_id.lastName' },
      totalPayments: {$push: {category: '$_id.category', amount: '$amount' } }
    }
  },
  {
  	$project:{_id:"$_id._id",firstName: '$_id.firstName', lastName: '$_id.lastName', totalPayments:1}
  }
])
