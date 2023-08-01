"use strict";
//  sdkddk
$(() => {
  userImage();
  const currenciesLink = document.getElementById("currenciesLink");
  const reportsLink = document.getElementById("reportsLink");
  const aboutLink = document.getElementById("aboutLink");
  const mainContent = document.getElementById("mainContent");

  currenciesLink.addEventListener("click", displayCurrencies);
  reportsLink.addEventListener("click", displayReports);
  aboutLink.addEventListener("click", displayAbout);

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

          const closeModalBtn = document.getElementById("closeModalBtn");
          // Close modal button, canceling the 6 coin and un toggle at main
          closeModalBtn.addEventListener("click", function () {
            const removeId = selectedCoins[5];
            for (const check of checkBoxArr) {
              if (check.id == removeId) {
                check.checked = false
              }
            }
            selectedCoins.pop()
          })

          // check for disabled coin restricting one
          saveChangesModal.addEventListener("click", function () {
            let disabledInputCount = 0;
            let removeCoinId = '';

            // Count the number of disabled inputs
            for (const checkModal of checkBoxModal) {
              if (checkModal.checked === false) {
                disabledInputCount++;
                removeCoinId = checkModal.id.slice(0, -5);
              }
            }

            if (disabledInputCount !== 1) {
              return;
            }
            const removeIndexChange = selectedCoins.findIndex(item => item === removeCoinId);
            selectedCoins.splice(removeIndexChange, 1);

            for (const check of checkBoxArr) {
              if (check.id === removeCoinId) {
                check.checked = false;
              }
            }
            exampleModal.hide();
          })
        }
        function checkswitchtoggle() {
          if (selectedCoins.length > 0) {
            for (const photo of photos) {
              for (const check of checkBoxArr) {
                if (photo == check.id) {
                  check.checked = true;
                }
              }
            }
          }
        }
        async function savePhotoDataToSessionStorage(photoData) {
          const json = json.stringify(photoData);
          sessionStorage.setItem(cards_data_KEY, json)
        }
      })













    //  אם אני רוצה להשתמש בזה שמתי את זה למעלה בcard בין ה symbol לבין ה a href
    {/* <p class="card-text">${photos[i].current_price}$</p> */ }