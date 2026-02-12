let var1 = document.querySelector(".displayBox");

let calcButtons = document.querySelectorAll(".calcBtn");

calcButtons = [...calcButtons];

let expression = "";
let finalResult = 0;
let digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
let operators = ["+", "-", "*", "/", "^"];

const invalidOperatorSequenceRegex = /([×+/^]{2,})|([×+/^]+-{2,})|-{3,}/g;
const startInvalidCheckRegex = /^([×/]{1,}|[+-]{2,}).*/;
const invalidEndingRegex = /.*[×/+-]+$/;
const validInputCharacters = /^[0-9+×\-/^=.C]+$/;
const invalidDecimalRegex =
  /[0-9-+^/×]*\.{2,}[0-9-+^/×]*|\.[-+^/×]{1,}|[-+^/×]{1,}\.|.*\..*\..*/g;

const errorStates = {
  divideByZero: false,
  invalidRegex: false,
};

const displayBox = document.getElementById("displayBox");

function exprToArrays(expr) {
  let operandsArr = [];
  let operatorsArr = [];

  console.log(expr);

  // Validate expression first
  if (
    invalidOperatorSequenceRegex.test(expr) ||
    startInvalidCheckRegex.test(expr) ||
    invalidEndingRegex.test(expr) ||
    invalidDecimalRegex.test(expr)
  ) {
    console.log("invalid regex");
    return "Error";
  }

  if (!validInputCharacters.test(expr)) {
    return "Error";
  }

  // Regex to capture numbers with optional unary minus
  // It captures an operator or start of string followed by a number (with optional unary minus)
  const unaryNumberRegex = /([+\-×/^]|^)(-?\d+(\.\d+)?)/g;
  let match;

  while ((match = unaryNumberRegex.exec(expr)) !== null) {
    const operator = match[1];
    const number = match[2];

    // Push the number
    operandsArr.push(number);

    // Only push operator if it's not the start of string
    if (operator !== "" && operator) {
      operatorsArr.push(operator);
    }
  }

  console.log("Operands:", operandsArr);
  console.log("Operators:", operatorsArr);

  // Perform calculations using your existing function
  calculations(operandsArr, operatorsArr);

  console.log("Result:", operandsArr[0]);

  // Format decimals
  if (operandsArr[0].toString().includes(".")) {
    let res = +operandsArr[0];
    operandsArr[0] = res.toFixed(3);
  }

  return operandsArr[0];
}

calcButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let btnVal = e.target.innerText;

    if (btnVal === "=") {
      const resultVal = exprToArrays(expression);
      if (resultVal === "Error") {
        displayBox.innerText = "err";
        expression = "";
      } else {
        displayBox.innerText = resultVal;
        expression = "" + resultVal;
      }
    } else {
      if (displayBox.innerText === "err") {
        expression = "" + btnVal.toString();
        displayBox.innerText = "" + btnVal.toString();
      } else {
        displayBox.innerText += btnVal;
        expression = displayBox.innerText;
      }
    }
    if (btnVal === "C") {
      expression = "";
      displayBox.innerText = "";
    }
  });
});

const calculations = (operandsArr, operatorsArr) => {
  if (operandsArr.length > 1) {
    if (operatorsArr.includes("^")) {
      let indx = operatorsArr.findIndex((str) => str === "^");
      let res = Math.pow(
        Number(operandsArr[indx]),
        Number(operandsArr[indx + 1]),
      );
      operandsArr.splice(indx, 2, res);
      operatorsArr.splice(indx, 1);
      calculations(operandsArr, operatorsArr);
    }
    if (operatorsArr.includes("×") || operatorsArr.includes("/")) {
      let indx1 = operatorsArr.findIndex((str) => str === "×");
      let indx2 = operatorsArr.findIndex((str) => str === "/");

      if (indx2 > indx1 || indx1 === -1) {
        try {
          if (Number(operandsArr[indx2 + 1]) === 0) {
            errorStates.divideByZero = true;
            throw Error("Cannot divide by zero");
          }
          let res =
            Math.round(
              (Number(operandsArr[indx2]) / Number(operandsArr[indx2 + 1])) *
                1000,
            ) / 1000;
          operandsArr.splice(indx2, 2, res);
          operatorsArr.splice(indx2, 1);
        } catch (err) {
          console.log(err);
        }
      } else {
        let res = Number(operandsArr[indx1]) * Number(operandsArr[indx1 + 1]);
        operandsArr.splice(indx1, 2, res);
        operatorsArr.splice(indx1, 1);
      }
      calculations(operandsArr, operatorsArr);
    }
    if (operatorsArr.includes("+") || operatorsArr.includes("-")) {
      let indx = operatorsArr.findIndex((str) => str === "+" || str === "-");
      if (operatorsArr[indx] === "+") {
        let res = Number(operandsArr[indx]) + Number(operandsArr[indx + 1]);
        operandsArr.splice(indx, 2, res);
        operatorsArr.splice(indx, 1);
        calculations(operandsArr, operatorsArr);
      } else {
        let res = Number(operandsArr[indx]) - Number(operandsArr[indx + 1]);
        operandsArr.splice(indx, 2, res);
        operatorsArr.splice(indx, 1);
        calculations(operandsArr, operatorsArr);
      }
    }
  }
};
