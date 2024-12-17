let changeBtn = document.getElementById("changeColorButton");
let color = document.getElementById("colorSelector");
changeBtn.addEventListener("click", () => {
  let changeColor = color.value;
  document.body.style.backgroundColor = changeColor;
});
