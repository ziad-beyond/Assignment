/* create  function that takes user details (name, age, and occupation) 
and returns a formatted string using template literals.*/
function literals(name,age,occupation){
return `My name is : ${name} ,my age is : ${age} and occupation is : ${occupation} `
}

//Create a small script demonstrating the use of template literals.
let myName ="Ziad Al-saedi"
let age=24
let occupation="Web Developer"
let result=literals(myName,age,occupation)
console.log(result)

