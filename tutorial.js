//! rn-class
class Car extends React.Component {
  constructor(props) {
    super(props);
    this.state = { brand: "Ford", model: "Mustang", color: "red", year: 1964 };
  }
  static getDerivedStateFromProps(props, state) { return { color: props.favcol } }
  shouldComponentUpdate() { return false  /* true */ }
  componentDidMount() { setTimeout(() => { this.setState({ color: "yellow" }) }, 1000) }
  getSnapshotBeforeUpdate(prevProps, prevState) { console.log("Before the update, the favorite was " + prevState.color); }
  componentDidUpdate() { console.log("The updated favorite is " + this.state.color); }
  changeColor = () => { this.setState({ color: "blue" }) }
  render() {return <button type="button" onClick={this.changeColor}>{this.state.color}</button>}
}
//! rn-class

//! fs
this.allProduct = async (req, res) => {
  const testArray = [
    { id: "1", fullname: "younes ghorbany" },
    { id: "2", fullname: "Iman Madaeny" },
    { id: "3", fullname: "Sajad Bagherzade" },
  ];
  fs.writeFileSync(`${appRootPath}/a/newFile.json`, JSON.stringify(testArray));
  const textFile = fs.readFileSync(`${appRootPath}/a/newFile.json`);
  const value = JSON.parse(textFile)
  const filterValue = value.filter((val) => val.id !== "2")
  fs.writeFileSync(`${appRootPath}/a/newFile.json`, JSON.stringify(filterValue));
  res.send();
}
//! fs

// [{"color":"red", "value":"3"}] //! for rapid client
// await UserModel.updateOne({ sellerId: req.params.id },  
// async function (err, user) {
//     if (user != null) {
//       user = user.toObject();
//       delete user.sellerId
//       await user.save()
//       console.log(user)
//     } 
//   }
//   )

//!
decodeURIComponent
encodeURIComponent
//!

//!
function Person(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
}

Person.prototype.greeting = function () {
  return `Hello there ${this.firstName} ${this.lastName}`;
}

const person = new Person('John', 'Doe');

console.log(person.greeting());
//!

//!class extends
class Car{
  constructor(name, age){
    this.name = name
    this.age = age
    this.color = 'red'
  }
}

class Car2 extends Car {
  constructor(name, age){
    super(name, age)
    this.x = name + this.color
    console.log(this.d);
  }
  get d(){return 222222}
}

const car2 = new Car2('ford ', 1998)
console.log(car2);
//!class extends

//! Class
class Convert {
  constructor(array) {
    this.obj = {}
    array.forEach(a => (this.obj[a._id] = a))
  }
  get value() { return this.obj }
  set rm(a) { this.obj = a }


}
const array = [{ _id: 'one' }, { _id: 'two' }]
const convert = new Convert(array)
const a = convert.value
convert.rm = {}
const b = convert.obj

console.log(a);
console.log(b);
//! Class

//! alt + 1 = میره تو تب اول
//! alt + 1 = میره تو تب دوم
const arr = [1, 2, 3]
Math.min(2, 3, 4)
Math.min(...arr)

//! String
//* endsWith !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
let text1 = "Hello world";
let result1 = text1.endsWith("world");
console.log(result1) = true;
//* endsWith !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* includes !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
let text2 = "Hello world, welcome to the universe.";
let result2 = text2.includes("world");
console.log(result2) = true;
//* includes !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* indexOf !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
let text3 = "Hello world, welcome to the universe.";
let result3 = text3.indexOf("welcome");
console.log(result3) = 13
//* indexOf !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* match !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
let text4 = "The rain in SPAIN stays mainly in the plain";
let result4 = text4.match("PAIN");
console.log(PAIN) = PAIN
//* match !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* repeat !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
let text5 = "Hello world!";
let result5 = text5.repeat(2);
console.log(result5) = "Hello world!Hello world!"
//* repeat !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* replace !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
let text6 = "Visit Microsoft! Microsoft! Microsoft!";
let result6 = text6.replace("Microsoft", "W3Schools");
console.log(result6) = "Visit W3Schools! Microsoft"
let result7 = text6.replace(/Microsoft/g, "W3Schools");
console.log(result7) = "Visit Microsoft! W3Schools! W3Schools!"
let result8 = text6.replace(/Microsoft/gi, "W3Schools");
console.log(result8) = "Visit W3Schools! W3Schools! W3Schools!"
//* replace !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* search !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
let text9 = "Mr. Blue has a blue house"
let position9 = text9.search("Blue");
console.log(position9) = 4
//* search !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* slice !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
let text10 = "Hello world!";
let result10 = text10.slice(0, 5);
console.log(result10) = 'Hello'
//* slice !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* split !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
let text11 = "How are you doing today?";
const myArray = text11.split(" ");
console.log(myArray) = [How, are, you, doing, today]
//* split !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* startsWith !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
let text12 = "Hello world, welcome to the universe.";
let result12 = text12.startsWith("Hello");
console.log(result12) = true
//* startsWith !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* substring !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
let text14 = "Hello world!";
let result14 = text14.substring(6, 7);
console.log(result14) = w
//* substring !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* toLowerCase !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
let text15 = "Hello World!";
let result15 = text15.toLowerCase();
console.log(result15) = 'hello world'
//* toLowerCase !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* toUpperCase !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
let text16 = "Hello World!";
let result16 = text16.toUpperCase();
console.log(result16) = 'HELLO WORLD'
//* toUpperCase !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* trim !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
let text17 = "       Hello World!        ";
let result17 = text17.trim();
console.log(result17) = "Hello World!"
//* trim !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* charCodeAt
let text111 = "HELLO WORLD";
let code111 = text.charCodeAt(1); 69
//* charCodeAt
//* fromCharCode
String.fromCharCode(69) = 'E'
//* fromCharCode

//! String

//! Object
//* keys !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const fruits1 = ["Banana", "Orange", "Apple", "Mango"];
const keys1 = Object.keys(fruits1);
console.log(keys1); 0, 1, 2, 3
//* keys !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* values valueOf !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const fruits2 = ["Banana", "Orange", "Apple", "Mango"];
const keys2 = Object.values(fruits2);
console.log(keys2); "Banana", "Orange", "Apple", "Mango"
const valueOf = fruits2.valueOf();
console.log(valueOf); "Banana", "Orange", "Apple", "Mango"
//* values valueOf !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* delete !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
let a2 = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }]
delete a2[1].name
console.log(a2) = [{ id: 1, name: 'a' }, { id: 2 }]
//* delete !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// countMap.forEach((item, index) => ())
// countMap.keys()
// countMap.values()
// countMap.entries()
// console.log(Object.keys(number));
// console.log(Object.values(number));
// console.log(Object.entries(number)); //! object change to array
//! Object

//! Array
//* delete !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
let a1 = [{ id: 1 }, { id: 2 }]
delete a1[1]
console.log(a1) = [{ id: 1 }]
//* delete !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* every !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const age1 = [32, 33, 19, 40];
console.log(age1.every((age) => (age > 18))) = true
//* every !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* every !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const age2 = [3, 10, 18, 20];
console.log(age2.some((age) => age > 19)); true
//* every !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* includes !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const fruit1 = ["Banana", "Orange", "Apple", "Mango"];
console.log(fruit1.includes("Banana", 3)); false
//* includes !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* indexOf !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const fruit2 = ["Banana", "Orange", "Apple", "Mango"];
let index = fruit2.indexOf("Apple");
console.log(fruit2.indexOf("Apple")); 2
//* indexOf !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* isArray !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const fruit3 = ["Banana", "Orange", "Apple", "Mango"];
let res = Array.isArray(fruit3);
console.log(res); true
//* isArray !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* join !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const fruit4 = ["Banana", "Orange", "Apple", "Mango"];
let text = fruit4.join();
console.log(text); "Banana", "Orange", "Apple", "Mango"
//* join !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* keys !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const fruit5 = ["Banana", "Orange", "Apple", "Mango"];
const keys = fruit5.keys();
console.log(keys);[0, 1, 2, 3]
//* keys !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* values !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const fruit6 = ["Banana", "Orange", "Apple", "Mango"];
const values = fruit6.values();
console.log(values);[0, 1, 2, 3]
//* values !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* reduce !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const number1 = [175, 50, 25];
console.log(number1.reduce((total, num) => total - num)); 100
//* reduce !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* reduceRight !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const number2 = [175, 50, 25];
console.log(number2.reduceRight((total, num) => total - num)); -200
//* reduceRight !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* reverse !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const fruit7 = ["Banana", "Orange", "Apple", "Mango"];
fruit7.reverse();
console.log(fruit7);
//* reverse !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* slice !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const fruit8 = ["Banana", "Orange", "Lemon", "Apple", "Mango"];
const citrus = fruit8.slice(1, 3);
console.log(Orange, Lemon);
//* slice !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* sort !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const fruit9 = ["2", "1", "6", "4"];
console.log(fruit9.sort()); 1, 2, 4, 6
//* sort !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* splice !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const fruit10 = ["Banana", "Orange", "Apple", "Mango"];
fruit10.splice(2, 0, "Lemon", "Kiwi");
console.log(fruit10); Banana, Orange, Lemon, Kiwi, Apple, Mango
fruit10.splice(2, 1);
console.log(fruit10); Banana, Orange, Mango
fruit10.splice(1);
console.log(fruit10); Banana
//* splice !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! Array

//! Number
const _number1 = 15.095
  (_number1).toFixed() = 15; type = 'string'
    (_number1).toPrecision() = 15.095; type = 'string'
isNaN(_number1) = false
Number(_number1) = 15.095; type = 'number'
parseInt(_number1) = 151; type = 'number'
parseFloat(_number1) = 15.095; type = 'number'
//! Number



//! arguments
const numberArray = [{ id: 1, price: 50 }, { id: 2, price: 70 }, { id: 3, price: 50 }]
function Car() {
  var number = 0
  for (let i = 0; i < arguments.length; i++) number += arguments[i].price
  console.log(number)
}
Car(...numberArray)
//! arguments




//! generator 
function* generator() {
  yield 1;
  yield 2;
}
const gen = generator()
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
console.log(gen.next().value); // 3
/////////////////////////////////////////////////
function* infinite() {
  let index = 0;
  while (index <= 10) {
    index++;
    yield new Date()
  }
}
const generator = infinite();

setInterval(() => {
  console.log(generator.next().value);
}, 5000);
//! generator




//! Mongoose
// this.getLastPayment2 = async (req, res) => {

//!slice
// const AddressVoucher = await AddressVoucherModel.find({ userId: req.user.payload.userId })
// const addressSlice = AddressVoucher.slice(AddressVoucher.length - 5, AddressVoucher.length)



// lastPayment.childItemsId.id('63fde81ad779c22f80c9aa3d')
// .find({ childItemsId:{_id:'a'}})
// .find({ childItemsId:/^ماشین/})  اونایی که اولش ماشین داشته باشرو برمیگردونه
// .find({childItemsTitle: /قرمز$/}) اونایی که اخرشون با قرمز تموم بشرو برمیگردونه
// .find({ childItemsTitle: /.*title1.*/ }) اینکلود میکنه و اونایی که توشون این مقدار پیدا بشرو برمیگردونه
// .find({ childItemsTitle: /title1/ }) اینکلود میکنه و اونایی که توشون این مقدار پیدا بشرو برمیگردونه
// .find({ childItemsId:['111', '222']})
// .find({ childItemsId:[]})

// }




// this.getLastPayment3 = async (req, res) => {
//! updateOne =مقدار رو برنمیگزدونه و فقط بروز میکنه 
//! findOneAndUpdate = هم بروز میکنه و هم مقدار رو برمیگردونه
//! findByIdAndUpdate = هم بروز میکنه و هم مقدار رو برمیگردون
//! updateMany
//! deleteOne
//! findOneAndDelete
//! findByIdAndDelete
//! deleteMany

//* const childItem = await ChildItemModel.findOne({ _id: req.params.id, like: { $elemMatch: { userId: req.user.payload.userId } } }) // find in child array
//* const comment = childItem.comment.id(req.query.commentid) // getId
//* comment?.remove()
//* await childItem.save() 


// .select({fullname:1, phone:1}) = فقط مقدار نام و شماره تلفن رو برمیگردونه به اضافه ی ایدی
// .select({childItemsId: {name:1}}) از توی چیلد ایتم فقط مقدار نامش رو برمیگردونه
// .select({childItemsId: 1})
// .count() = بجای مقدار تعداد رو بر میگردونه و من الان گفتم پنج تای آخر رو میخوام ولی اگه فقط 3 تا تو دیتابیس موجود باشه تعداد رو 3 نشون میده
// .limit(5) فقط پنج تای اول رو برمیگردونه
// .or([{ description: { $ne: '' }, floor: { $gt: 8 }}]) = وقتی دوتا شرت رو داخل یک ابجکت بنویشی یعنی 1&1
// .and([{ description: { $ne: '' }},  {floor: { $gt: 8 }}])  خود اند رو هم داریم
// .or([{ description: { $ne: '' }},  {floor: { $gt: 8 }}]) وقتی شزت هارو داخل ابجکت های جدا بنویسی یعنی 1|1
// populate

// await PaymentModel.find({ description: { $eq: '' } }) اونایی که مقدار دسکریپشنشون خالی باشرو فقط نمایش میده
// $eq: 8 = فقط باید مقدار 8 باشه تابرگردونه
// $ne: 8 = اونایی که مقدارشون برابر نباشه با 8 رو برمیگردونه
// $gt:8 = بزرگ تر از 8 رو برمیگزدونه
// $gte:8 = بزرگ تر یابرابر 8 رو برمیگزدونه
// $lt:8 = کوچکتر تر از 8 رو برمیگزدونه
// $lte:8 = کوچکتر تر یا برابر 8 رو برمیگزدونه
// $in:[6, 7, 2] = اگه مقدار برابر با یکی از مقادیر داخل آرایه بود اونارو برمیگردونه
// $nin:[1, 7, 9] اگه مقدار برابر یکی از مقادیر داخل آرایه بود اونارو برنمیگردونه



//! unset
const user = await UserModel.updateOne(
  { sellerId: req.params.id },
  { $unset: { sellerId: 1 } })
//! unset

const falseLike = await CommenteModel.findOne({ _id: req.params.id })
  .select({ answer: { $elemMatch: { _id: req.query.commentId } } })

console.log('falseLike', falseLike.answer[0].like);

//!
// $pull
// $pullAll

//! pull
//*{ "_id" : 1, "bar" : [ 1, 7, 2, 3, 8, 7, 1 ] }
db.products.update(
  { _id: 1 },
  { $pull: { bar: 7 } }
)

db.foo.update(
  { _id: 1 },
  { $pullAll: { bar: [7] } }
)

await CommenteModel.update(
  { _id: req.params.id },
  { $pull: { like: { userId: req.user.payload.userId } } } //! delete width userId
)
//*
this.commentLike = async (req, res) => {
  const truLike = await CommenteModel.findOne({ _id: req.params.id, like: { $elemMatch: { userId: req.user.payload.userId } } })
  await CommenteModel.update(
    { _id: req.params.id },
    { $pull: { like: { userId: req.user.payload.userId } } } //! این تمام ابجکت هایی که مقدار که یوزر ایدیشون برابر هست رو پاک میکنه
  )
  res.json(truLike)
}
//! pull

{
  //!
  await CommenteModel.updateOne({ _id: req.params.id }, {
    $set: { like: [{ likeNumber: 1, userId: req.user.payload.userId }] },
  });
  //*
  await CommenteModel.findOneAndUpdate({ _id: req.params.id, like: { $elemMatch: { userId: req.user.payload.userId } } },
    { $set: { "like.$.likeNumber": 0, "like.$.userId": req.user.payload.userId } },
    { new: true }
  ) //! فقط نامبر موجود باشه عددش رو صفر میکنه ولی توی اولی همرو پاک میکنه و از نو میسازش
}


//! edit
// const lastPayment = await PaymentModel.findOneAndUpdate(
//   { _id: '63fe054d2b67d226ac46bb32' },
//   { $set: { "childItemsId.text": "newText" } },
//   )
// res.json({ lastPayment })
//! edit
//! edit child
// const lastPayment = await PaymentModel.findOne({_id: "63fdf2798705f42c9cbd8655"})
// const child = lastPayment.childItemsId.id('63fdf2798705f42c9cbd8658')
// child.test = '111'
// await lastPayment.save()
//!
// const lastPayment = await PaymentModel.findOneAndUpdate(
//   {_id: "63fe054d2b67d226ac46bb32",
//    childItemsId: { $elemMatch: { _id: "63fe054d2b67d226ac46bb35" } }},
//   { $set: { "childItemsId.$.test": "newtest2" } },
//   { new: true }
// )
//!
// const lastPayment = await PaymentModel.findOneAndUpdate(
//   {childItemsId: { $elemMatch: { _id: "63fdf2798705f42c9cbd8657" } }},
//   { $set: { "childItemsId.$.test": "newte22s" } },
//   { new: true }
// )
//! edit child

//! delete child
// const lastPayment = await PaymentModel.findOne({ _id: "63fdf2798705f42c9cbd8655" })
// const child = lastPayment.childItemsId.id('63fdf2798705f42c9cbd8658')
// if (!child) throw new Error()
// await child.remove()
// await lastPayment.save()
//! delete child



//   const lastPayment = await PaymentModel.findOne()
//   res.json({ lastPayment })

// }
//! Mongoose

//! redirect
// res.redirect('/lastPayment')


//! fetch
const response = await fetch("http://example.com/movies.json");
const jsonData = await response.json();
//! fetch

//!
const _response = await fetch(url, {
  method: "POST", // *GET, POST, PUT, DELETE, etc.
  mode: "cors", // no-cors, *cors, same-origin
  cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  credentials: "same-origin", // include, *same-origin, omit
  headers: {
    "Content-Type": "application/json",
    // 'Content-Type': 'application/x-www-form-urlencoded',
  },
  redirect: "follow", // manual, *follow, error
  referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  body: JSON.stringify(data), // body data type must match "Content-Type" header
});
//!

//! formData
async function uploadMultiple(formData) {
  try {
    const response = await fetch("https://example.com/posts", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

const photos = document.querySelector('input[type="file"][multiple]');
const formData = new FormData();

formData.append("title", "My Vegas Vacation");

for (const [i, photo] of Array.from(photos.files).entries()) {
  formData.append(`photos_${i}`, photo);
}

uploadMultiple(formData);

//! formData