const select = document.querySelector("select");
const input = document.querySelector("input[type='search']");
const mode = document.getElementById("mode");
const newWindow = document.querySelector(".new_window");
const btnReturn = document.getElementById("return");
const section = document.querySelector("section");

function countryObj(fun) {
  fetch("data.json")
    .then((e) => {
      if (!e.ok) {
        throw new Error(
          `Somethings are dasn't work, so be well if you stay for few secound ,minutes or hourls. Code:${e.status}`
        );
      }
      return e.json();
    })
    .then((e) => {
      fun(e);
      e.forEach((item) => names.push(item["name"]));
    })
    .catch((error) => console.log(error));
}

// close the new Window
btnReturn.addEventListener("click", () => {
  openWindow();
});
// changing the mode from dark to light or vice versa
mode.addEventListener("click", () => {
  dark();
});
let time = "night";
function dark() {
  const moon = document.getElementById("moon");
  if (time == "night") {
    moon.setAttribute("class", "fa-regular fa-moon");
    time = "day";
  } else {
    moon.setAttribute("class", "fa-solid fa-moon");
    time = "night";
  }

  const lightDark = ["header", "button", "label", "select",".container_window > img"];
  lightDark.forEach((e) => {
    document.querySelector(`${e}`).classList.toggle("light_dark");
  });
  document.querySelector("body").classList.toggle("dark");
  document.querySelectorAll("#to-remove >div").forEach((e) => {
    e.classList.toggle("light_dark");
  });
  document.querySelectorAll(".border > span ").forEach((e) => {
    e.classList.toggle("light_dark");
  });
}

const names = [];
// search segment
input.addEventListener("search", () => {
  const searchWord = input.value;
  let checkStatus = names.includes(searchWord);
  if (searchWord != "" && checkStatus) {
    checkElement(searchWord);
  } else {
    alert(
      "You must enter the correct name of the country (the first letter is capitalized and there is no room for an inaccurately spelled word)!"
    );
  }
});

function checkElement(expected) {
  fetch("data.json")
    .then((e) => {
      if (!e.ok) {
        throw new Error(
          `Somethings are dasn't work, so be well if you stay for few secound ,minutes or hourls. Code:${e.status}`
        );
      }
      return e.json();
    })
    .then((e) => {
      const searchItem = e.find((item) => item["name"] == expected);

      const fullName = [];
      if (searchItem["borders"] != undefined) {
        const borders = [...searchItem["borders"]].forEach((item) => {
          const searchObj = e.find((element) => element["alpha3Code"] == item);
          fullName.push(searchObj["name"]);
        });
      }
      createWindow(searchItem, fullName);
    })
    .catch((error) => console.log(error));
}

function openWindow() {
  newWindow.classList.toggle("vanish");
  document.querySelector("nav").classList.toggle("vanish");
  document.querySelector("section").classList.toggle("vanish");
}

let swift = false;
function createWindow(element, fullName) {
  openWindow();
  if (element) {
    const img = document.getElementById("window-img");
    img.src = element["flag"];
    img.alt = element["flag"]["alt"];
    const dataText = [
      element["nativeName"],
      element["population"],
      element["region"],
      element["subregion"],
      element["capital"],
      element["topLevelDomain"],
      element["currencies"][0]["name"],
      element["languages"],
    ];
    const data = document.querySelectorAll("#data > p");
    (document.getElementById("country-name").textContent = element["name"]),
      data.forEach((e, index) => {
        const span = document.createElement("span");
        let text = e.ariaValueText;
        if (index < dataText.length - 1) {
          span.textContent = dataText[index];
        } else {
          let lang = "";
          dataText[index].forEach((e, index) => {
            lang += `${e["name"]}, `;
          });
          const modText = lang.split("");
          modText.splice(modText.length - 2);
          span.textContent = modText.join("");
        }
        data[index].textContent = text;
        data[index].appendChild(span);
      });
    if (fullName.length != 0) {
      const border = document.getElementById("border-countries");
      let putBorder = () => {
        const p = document.createElement("p");
        p.textContent = "Border Countries:";
        border.appendChild(p);
        fullName.forEach((e) => {
          const span = document.createElement("span");
          span.textContent = e;
          span.setAttribute("class", "light_dark");
          border.appendChild(span);
        });
      };
      putBorder();
      if (swift) {
        document
          .querySelectorAll("#border-countries > *")
          .forEach((e) => e.remove());
        putBorder();
        swift = false;
      }
      swift = true;
    }
  } else {
    throw new Error("You missing something!");
  }
}
// choose segment
let swip = false;
select.addEventListener("change", () => {
  const continent = select.value;
  fetch("data.json")
    .then((e) => e.json())
    .then((e) => {
      if (swip) {
        section.removeChild(document.getElementById("to-remove"));
        swip = false;
      }
      once();
      if (continent != "check") {
        const accept = e.filter((e) => e["region"] == continent);
        const fn = () => {
          accept.forEach((e) => {
            createElement(
              e["flag"],
              "None",
              e["name"],
              e["population"],
              e["region"],
              e["capital"]
            );
          });
        };
        fn();
      } else {
        def(e);
      }
    });
});

function createElement(
  imgSrc,
  imgAlt,
  countryName,
  population,
  region,
  capital
) {
  const element = document.getElementById("to-remove");
  const div = document.createElement("div");
  // div.classList.add("country_block")
  const divTwo = document.createElement("div");
  time == "night" ? div.setAttribute("class", "light_dark country_block") : null;
  const img = document.createElement("img");
  img.src = imgSrc;
  img.alt = imgAlt;
  div.appendChild(img);
  const h2 = document.createElement("h2");
  h2.textContent = countryName;
  divTwo.appendChild(h2);
  const data = [population, region, capital];
  const dataFirstSegment = ["Population:", "Region:", "Capital:"].forEach(
    (e, index) => {
      const p = document.createElement("p");
      p.textContent = e;
      const span = document.createElement("span");
      span.textContent = data[index];
      p.appendChild(span);
      divTwo.appendChild(p);
    }
  );
  div.appendChild(divTwo);
  element.appendChild(div);
}
function once() {
  swip = true;
  const div = document.createElement("div");
  div.id = "to-remove";
  section.appendChild(div);
}
function def(obj) {
  const firstLook = [
    "Germany",
    "United States of America",
    "Brazil",
    "Iceland",
    "Afghanistan",
    "Åland Islands",
    "Albania",
    "Algeria",
  ];
  firstLook.forEach((e) => {
    const acces = obj.filter((s) => s["name"] == e);
    createElement(
      acces[0]["flag"],
      "None",
      acces[0]["name"],
      acces[0]["population"],
      acces[0]["region"],
      acces[0]["capital"]
    );
  });
}
function start() {
  once();
  countryObj(def);
}

start();
