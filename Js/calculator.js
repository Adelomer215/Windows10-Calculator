const App = () => {
  const previousValue = document.getElementById("previous-value");
  const currentValue = document.getElementById("current-value");
  const numberButtons = document.querySelectorAll(".number");
  const clearButtons = document.querySelectorAll(".clear, .clearEntry");
  const deleteButtons = document.getElementById("delete");
  const signChange = document.getElementById("sign-change");
  const operatorButtons = document.querySelectorAll(".operator");
  const equals = document.getElementById("equals");
  let isNumberFlag = false;
  let itemArray = [];
  const equationArray = [];

  numberButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const newNumber = e.target.textContent;
      if (isNumberFlag) {
        currentValue.value = newNumber;
        isNumberFlag = false;
      } else {
        currentValue.value =
          currentValue.value == 0
            ? newNumber
            : `${currentValue.value}${newNumber}`;
      }
    });
  });

  clearButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      currentValue.value = 0;
      if (e.target.classList.contains("clear")) {
        previousValue.textContent = "";
        itemArray = [];
      }
    });
  });

  deleteButtons.addEventListener("click", () => {
    currentValue.value = currentValue.value.slice(0, -1);
    if (currentValue.value === "") {
      currentValue.value = 0;
    }
  });

  signChange.addEventListener("click", () => {
    currentValue.value = currentValue.value * -1;
  });

  operatorButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const newOperator = e.target.textContent;
      const currentV = currentValue.value;
      if (isNumberFlag) {
        previousValue.textContent = "";
        itemArray = [];
      }
      if (!itemArray.length && currentV == 0) return;

      if (!itemArray.length) {
        itemArray.push(currentV, newOperator);
        previousValue.textContent = `${currentV} ${newOperator}`;
        return (isNumberFlag = true);
      }

      if (itemArray.length) {
        itemArray.push(currentV);
        const equationObject = {
          num1: itemArray[0],
          num2: currentV,
          operator: itemArray[1]
        };
        equationArray.push(equationObject);
        const equationString = `
          ${equationObject["num1"]} 
          ${equationObject["operator"]} 
          ${equationObject["num2"]}
        `;
        const newValue = calculate(equationString, currentValue);

        previousValue.textContent = `${newValue} ${newOperator}`;

        itemArray = [newValue, newOperator];
        isNumberFlag = true;
      }
    });
  });
  equals.addEventListener("click", () => {
    if (!itemArray.length) return;
    const currentV = currentValue.value;
    const equationObject = {
      num1: itemArray[0],
      num2: currentV,
      operator: itemArray[1]
    };
    const result =
      equationObject.operator === "+"
        ? +equationObject.num1 + +equationObject.num2
        : equationObject.operator === "-"
        ? +equationObject.num1 - +equationObject.num2
        : equationObject.operator === "*"
        ? +equationObject.num1 * +equationObject.num2
        : +equationObject.num1 / +equationObject.num2;
    currentValue.value = result;
    previousValue.textContent = "";
    itemArray = [];
  });
};

document.addEventListener("DOMContentLoaded", App);

const calculate = (equation, currentValue) => {
  const regex = /(^[*/=])|(\s)/g;
  equation.replace(regex, "");
  const divByZero = /(\/ 0$)/.test(equation);
  if (divByZero) return (currentValue.value = 0);
  return (currentValue.value = eval(equation));
};
