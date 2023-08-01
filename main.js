"use strict";
$(() => {
  userImage();
  const currenciesLink = document.getElementById("currenciesLink");
  const reportsLink = document.getElementById("reportsLink");
  const aboutLink = document.getElementById("aboutLink");
  const mainContent = document.getElementById("mainContent");

  currenciesLink.addEventListener("click", () => {
    displayCurrencies();
  });
  reportsLink.addEventListener("click", () =>  {
    displayReports()
  });
  aboutLink.addEventListener("click", () => {
    displayAbout()
  });

  const searchBar = document.getElementById("searchBar");
  searchBar.addEventListener('keyup', async function () {
    const searchValue = searchBar.value;
    const Data = await getJson("api.json");
    if (searchValue) {
      const result = Data.filter(item => item.id.indexOf(searchValue) > -1 || item.symbol.indexOf(searchValue) > -1)
      $("#mainContent").empty();
      displayCrypto(result);
      // console.log(result)
    } else {
      const result = Data.filter(item => item.id.indexOf(searchValue) > -1 || item.symbol.indexOf(searchValue) > -1)
      $("#mainContent").empty();
      displayCrypto(result);
    }

  })
  $("div").on("click", ".moreInfo", function () {
    return new Promise(async (resolve, reject) => {
      try {
        event.stopPropagation();
        if (this.getAttribute("aria-expanded") === "true") {
          const coinSessionData = await loadCoinDataFromSessionStorage();
          if (!coinSessionData) {
            showSpinner();
            const json = await getCurrenciesInfo(this.id);
            const coinData = makeMoreInfoDateArr(json);
            coinsDataArr.push(coinData);
            saveCoinDataToSessionStorage(coinsDataArr);
            hideSpinner();
            displayMoreInfo(coinData);
          } else {
            let foundMatchingCard = false;
            for (let i = 0; i < coinSessionData.length; i++) {
              if (coinSessionData[i].id === this.id) {
                if (Date.now() - coinSessionData[i].time <= 120000) {
                  displayMoreInfo(coinSessionData[i]);
                  foundMatchingCoin = true;
                  break;
                } else {
                  showSpinner();
                  const json = await getCurrenciesInfo(this.id);
                  const coinData = makeMoreInfoDateArr(json);
                  coinsDataArr.push(coinData);
                  coinSessionData[i] = coinData;
                  saveCoinDataToSessionStorage(coinSessionData);
                  hideSpinner();
                  displayMoreInfo(coinData);
                  foundMatchingCoin = true;
                  break;
                }
              }
            }
            if (!foundMatchingCard) {
              showSpinner();
              const json = await getCurrenciesInfo(this.id);
              const coinData = makeMoreInfoDateArr(json);
              coinsDataArr.push(coinData);
              coinSessionData.push(coinData);
              saveCoinDataToSessionStorage(coinSessionData);
              hideSpinner();
              displayMoreInfo(coinData);
            }
          }
        }
        resolve();
      } catch (error) {
          reject(error);
      }
  }).catch((error) => {
      console.log("Error while fetching more coin info", error);
  });
})

        function displayCurrencies() {
          mainContent.innerHTML = `<h1>Currencies...</h1>`;
        }

        function displayReports() {
          mainContent.innerHTML = `<h1>Reports...</h1>`;
        }

        function displayAbout() {
          mainContent.innerHTML = `<h1>About...</h1>`

        }
        async function userImage() {
          const card = await getJson();
          displayCrypto(card);
        }

        async function getJson() {
          const respose = await fetch("api.json");
          const json = await respose.json();
          return json;
        }


        function displayCrypto(photos) {
          for (let i = 0; i < photos.length; i++) {
            $("#mainContent").append(`
        <div id = "${photos[i].id}" class="card" style="width: 18rem;">
        <div id = "Toggle" class="form-switch">
        <input class="form-check-input" type="checkbox" role="switch" id="switchtoggle">
      </div>
          <img src="${photos[i].image}" class="card-coins">
          <div class="card-body">
            <h5 class="card-title">${photos[i].symbol}</h5>
            <a href="" class="btn btn-primary">more info</a>
          </div>
           <div class="moreInfo">

           </div>
        </div>
      `);
          }
          const btns = document.querySelectorAll('.btn-primary');
          btns.forEach(function (btn) {
            btn.addEventListener("click", async function (event) {
              event.preventDefault();
              const moreInfo = this.closest('.card').querySelector('.moreInfo');
              moreInfo.style.display = (moreInfo.style.display === 'none') ? 'block' : 'none';
              const cryptoId = this.closest(`.card`).id;

              const json = await getCrypto(cryptoId);
              moreInfo.innerHTML = `
        <p class="card-text">price in USD: ${json.market_data.current_price.usd}$</p>
        <p class="card-text">price in EURO: ${json.market_data.current_price.eur}€</p>
        <p class="card-text">price in ILS: ${json.market_data.current_price.ils}₪</p>
      `
            })

            async function getCrypto(id) {
              const data = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
              const json = await data.json();
              return json;

            }
          })
          function showSpinner() {
            $(".spinner").addClass("show");
          }

          function hideSpinner() {
            $(".spinner").removeClass("show");
          }
          function getAndDisplayCrypto() {
            return new Promise(async (resolve, reject) => {
              try {
                const Crypto = await getCrypto(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1`);
                displayCrypto(crypto);
                resolve(crypto);
              } catch (error) {
                reject(error);
              }
            });
          }
          // function displayAbout(){
          //   mainContent.innerHTML = `

          //   `
          // }
          for (const check of checkBoxArr) {
            check.addEventListener("click", function () {
              if (check.checked === true) {
                SelectedCoin = check.id;
                selectedCoins.push(SelectedCoin);
                check.checked;
              }
              if (check.checked === false) {
                const unCheckIndex = selectedCoins.findIndex(item => item === check.id);
                selectedCoins.splice(unCheckIndex, 1);
              }
              if (selectedCoins.length > 5) {
                myModal.show()
                let html = `<p>You can only Select 5 Currencies, Please choose one to Add 
              ${check.id}, Or cancel</p>`
                for (let i = 0; i < selectedCoins.length - 1; i++) {
                  html += `
                  <div class="card" id="${photos[i].id}" style="width: 18rem;">
                  <div class="card-body">
                    <h5 class="card-title">${photos[i].symbol}</h5>
                    <label class="switch float-end">
                    <input type="checkbox" checked class="checkBoxModal" id="${photos[i].id}Modal">
                    <span class="slider round"></span>
                </label>                        </div>
                </div>
                  `
                }
                cardModalContainer.innerHTML = html;
              }
            })
          }
          closeModal.addEventListener("click", function () {
            const removeId = selectedCoins[5];
            for (const check of checkBoxArr) {
              if (check.id == removeId) {
                check.checked = false
              }
            }
            selectedCoins.pop()
          })

         // אתחול קבועים לחישוב הלחיצות
let clickCount = 0;
const maxClicks = 5;

// טיפוס אלמנטי הכפתור שמוביל למודל
const openModalButton = document.getElementById("openModalButton");
const closeModalButton = document.getElementById("closeModalButton");
const saveChangesModalButton = document.getElementById("saveChangesModal");

// הוספת מאזין ללחיצה על הכפתור המוביל למודל
openModalButton.addEventListener("click", () => {
  clickCount++;
  if (clickCount === maxClicks) {
    clickCount = 0; // איפוס המונה לאחר פתיחת המודל
    // כאן אתה יכול לפתוח את המודל באמצעות JS
    $("#exampleModal").modal("show");
    // כאן יש להציג במודל את המטבעות שנבחרו עד כה, אם יש כאלה
    displaySelectedCoins(); // פונקציה שמציגה את המטבעות שנבחרו
  }
});

// הוספת מאזין לסגירת המודל
closeModalButton.addEventListener("click", () => {
  clickCount = 0; // איפוס המונה במידה והמשתמש ביטל את הבחירה
  // כאן אתה יכול לסגור את המודל באמצעות JS
  $("#exampleModal").modal("hide");
});

// הוספת מאזין לשמירת השינויים במודל
saveChangesModalButton.addEventListener("click", () => {
  // כאן אתה יכול לבדוק אילו מטבעות נבחרו ולבצע את הטיפול המתאים
  // המטבעות שנבחרו מופיעים בתוך המשתנה selectedCoins
  // אפשר להשתמש בפונקציה saveSelectedCoinsToServer(selectedCoins); לשמירת המטבעות בשרת
  clickCount = 0; // איפוס המונה לאחר ש
            }
            )
            
        async function savePhotoDataToSessionStorage(photoData) {
          const json = json.stringify(photoData);
          sessionStorage.setItem(cards_data_KEY, json)
        }
      }
      })
      













    //  אם אני רוצה להשתמש בזה שמתי את זה למעלה בcard בין ה symbol לבין ה a href
    {/* <p class="card-text">${photos[i].current_price}$</p> */ }