function clc() {
  for (let i = 0; i < 81; i++) {
    document.getElementsByTagName("input")[i].value = "";
    document.getElementsByTagName("input")[i].style.color = "black";
  }
}

//główna funkcja
function getAnswer() {
  let bool = checkInput();
  if (bool) {
    let grid = readAPuzzle();
    if (!isValidGrid(grid)) {
      alert("Invalid input, please try again!");
    } else {
      if (search(grid)) {
        outputAnswer();
      } else {
        alert("Found no solution!");
      }
    }
  }
}

//sprawdzanie
function checkInput() {
  let arr = new Array();

  for (let i = 0; i < 81; i++) {
    arr[i] = Number(document.getElementsByTagName("input")[i].value);
    if (isNaN(arr[i])) {
      alert("Input should be any number between 1 and 9 !");
      return false;
    }
  }

  if (
    arr.every(function isZero(x) {
      return x == 0;
    })
  ) {
    alert("There is no input!");
    return false;
  }

  return true;
}

//czytanie strony internetowej
function readAPuzzle() {
  let arr = new Array();

  for (let i = 0; i < 81; i++) {
    arr[i] = Number(document.getElementsByTagName("input")[i].value);
  }

  let grid = new Array();
  for (let i = 0; i < 9; i++) {
    grid[i] = new Array();
    for (let j = 0; j < 9; j++) {
      grid[i][j] = 0;
    }
  }

  for (let i = 0; i < 81; i++) {
    grid[Math.floor(i / 9)][i % 9] = arr[i];
  }

  return grid;
}

//wolne komórki
function getFreeCellList(grid) {
  let freeCellList = new Array();
  index = 0;

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (grid[i][j] == 0) {
        freeCellList[index] = new Array(i, j);
        index++;
      }
    }
  }

  return freeCellList;
}

//Sprawdzanie siatki
function isValid(i, j, grid) {
  //Sprawdź, czy siatka[i][j] jest poprawna
  for (let column = 0; column < 9; column++) {
    if (column != j && grid[i][column] == grid[i][j]) {
      return false;
    }
  }

  for (let row = 0; row < 9; row++) {
    if (row != i && grid[row][j] == grid[i][j]) {
      return false;
    }
  }

  for (
    let row = Math.floor(i / 3) * 3;
    row < Math.floor(i / 3) * 3 + 3;
    row++
  ) {
    for (
      let col = Math.floor(j / 3) * 3;
      col < Math.floor(j / 3) * 3 + 3;
      col++
    ) {
      if (row != i && col != j && grid[row][col] == grid[i][j]) {
        return false;
      }
    }
  }

  return true;
}

//Sprawdź, czy stałe komórki są prawdziwe w siatce
function isValidGrid(grid) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (
        grid[i][j] < 0 ||
        grid[i][j] > 9 ||
        (grid[i][j] != 0 && !isValid(i, j, grid))
      ) {
        return false;
      }
    }
  }
  return true;
}

//Poszukiwanie rozwiązania
function search(grid) {
  let freeCellList = getFreeCellList(grid);
  let numberOfFreeCells = freeCellList.length;
  if (numberOfFreeCells == 0) {
    return true;
  }

  let k = 0; //Zacznij od pierwszej wolnej komórki

  while (true) {
    let i = freeCellList[k][0];
    let j = freeCellList[k][1];
    if (grid[i][j] == 0) {
      grid[i][j] = 1;
    }

    if (isValid(i, j, grid)) {
      if (k + 1 == numberOfFreeCells) {
        //nie ma wiecej molnych komórek
        return true; //znaleziono rozwiązanie
      } else {
        //idz do następnej wolnej komórki
        k++;
      }
    } else {
      if (grid[i][j] < 9) {
        //Wypełnij wolną komórkę następną możliwą wartością
        grid[i][j]++;
      } else {
        //siatka [i][j] jest 9,wróc
        while (grid[i][j] == 9) {
          if (k == 0) {
            return false; //brak możliwej wartości
          }
          grid[i][j] = 0; //Przywrócenie wolnej komórki
          k--; //Cofnij się do poprzedniej wolnej komórki
          i = freeCellList[k][0];
          j = freeCellList[k][1];
        }

        grid[i][j]++;
      }
    }
  }

  return true; //Znaleziono rozwiązanie
}

//umieść odpowiedź na stronie internetowej
function outputAnswer() {
  let grid = readAPuzzle();
  let gridOriginal = readAPuzzle();

  if (search(grid)) {
    for (let i = 0; i < 81; i++) {
      if (
        grid[Math.floor(i / 9)][i % 9] !=
        gridOriginal[Math.floor(i / 9)][i % 9]
      ) {
        document.getElementsByTagName("input")[i].value =
          grid[Math.floor(i / 9)][i % 9];
        document.getElementsByTagName("input")[i].style.color = "blue";
      }
    }
  }
}
