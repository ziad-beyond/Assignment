//    Task 1: Write a JavaScript program that uses ES6+ features to manipulate arrays and objects. Specifically:

//1-Use array destructuring to extract elements from an array.
const numbers=[1,2,3,4,5]
const [one,two,three,four,five]=numbers
console.log("Array destructuring:",one,two,three,four,five)

//2-Use the spread operator to merge two arrays and two objects.
// for Array
const array1=[1,2,3]
const array2=[4,5,6]
const mergeArray=[...array1,...array2]
console.log("spread operator for array: ",mergeArray)
//for object
const object1={1:"one",2:"two",3:"three"}
const object2={4:"four",5:"five",6:"six"}
const mergeObjects={...object1,...object2}
console.log("spread operator for array: ",mergeObjects)

//3-Create a function using arrow syntax to filter out even numbers from an array.
const array=[1,2,3,4,5,6]
const even = (e)=> e.filter(num=>num%2===0)
const result=even(array)
console.log("even numbers : ",result)
