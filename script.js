let var1 = document.querySelector(".displayBox");

let calcButtons = document.querySelectorAll(".calcBtn");

calcButtons = [...calcButtons];

let expression = "";
let result = 0;
let digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
let operators = ["+", "-", "*", "/", "^"];
let operandsArr = [];
let operatorsArr = [];

const displayBox = document.getElementById("displayBox");

function exprToArrays(expr) {
  let numMaking = "";
  console.log(expr);
  for (let i = 0; i < expr.length; i++) {
    let char = expr[i];
    if (digits.includes(char)) {
      numMaking += char;
    } else {
      operandsArr.push(numMaking);
      numMaking = "";
      operatorsArr.push(char);
    }
    if (i === expr.length - 1) {
      operandsArr.push(numMaking);
      numMaking = "";
    }
  }
}

calcButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let btnVal = e.target.innerText;

    if (btnVal === "=") {
      exprToArrays(expression);
      calculations();
      displayBox.innerText = operandsArr[0];
    } else {
      displayBox.innerText += btnVal;
      expression += btnVal;
      console.log(expression);
    }

    if (btnVal === "C") {
      expression = "";
      operandsArr = [];
      operatorsArr = [];
      displayBox.innerText = "";
    }
  });
});

const calculations = () => {
  if (operatorsArr.length) {
    if (operatorsArr.includes("^")) {
      let indx = operatorsArr.findIndex((str) => str === "^");
      let res = Math.pow(
        Number(operandsArr[indx]),
        Number(operandsArr[indx + 1])
      );
      operandsArr.splice(indx, 2, res);
      operatorsArr.splice(indx, 1);
      calculations();
    }
    if (operatorsArr.includes("*") || operatorsArr.includes("/")) {
      let indx1 = operatorsArr.findIndex((str) => str === "*");
      let indx2 = operatorsArr.findIndex((str) => str === "/");

      if (indx2 > indx1 || indx1 === -1) {
        let res =
          Math.round(
            (Number(operandsArr[indx2]) / Number(operandsArr[indx2 + 1])) * 1000
          ) / 1000;
        operandsArr.splice(indx2, 2, res);
        operatorsArr.splice(indx2, 1);
      } else {
        let res = Number(operandsArr[indx1]) * Number(operandsArr[indx1 + 1]);
        operandsArr.splice(indx1, 2, res);
        operatorsArr.splice(indx1, 1);
      }
      calculations();
    }
    if (operatorsArr.includes("+")) {
      let indx = operatorsArr.findIndex((str) => str === "+");
      let res = Number(operandsArr[indx]) + Number(operandsArr[indx + 1]);
      operandsArr.splice(indx, 2, res);
      operatorsArr.splice(indx, 1);
      calculations();
    }
    if (operatorsArr.includes("-")) {
      let indx = operatorsArr.findIndex((str) => str === "-");
      let res = Number(operandsArr[indx]) - Number(operandsArr[indx + 1]);
      operandsArr.splice(indx, 2, res);
      operatorsArr.splice(indx, 1);
      calculations();
    }
  }
};
