
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
//* substr !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
let text13 = "Hello world!";
let result13 = text13.substr(6, 1);
console.log(result13) = w
//* substr !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
console.log(fruit10); Banana,Orange,Lemon,Kiwi,Apple,Mango
fruit10.splice(2, 1);
console.log(fruit10); Banana,Orange,Mango
fruit10.splice(1);
console.log(fruit10); Banana
//* splice !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! Array
