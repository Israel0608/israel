"use strict";
let selectedCoin = [];
$(() => {
  userImage();
  const currenciesLink = document.getElementById("currenciesLink");
  const reportsLink = document.getElementById("reportsLink");
  const aboutLink = document.getElementById("aboutLink");
  const mainContent = document.getElementById("mainContent");

  currenciesLink.addEventListener("click", () => {
    displayCurrencies();
  });
  reportsLink.addEventListener("click", () => {
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
    // ...
    const maxSelectedCoins = 5;

    // New function to handle the 6th coin selection
    function handleCoinSelection(event) {
      const target = event.target;
      if (target.classList.contains("btn-primary")) {
        const selectedCoinCount = selectedCoins.length;
        if (selectedCoinCount < maxSelectedCoins) {
          const coinSymbol = target.getAttribute("data-coin-symbol");
          const selectedCoin = currentDisplayedCoins.find((c) => c.symbol === coinSymbol);
          if (selectedCoins.includes(selectedCoin)) {
            selectedCoins.push(selectedCoin);
            if (selectedCoinCount === maxSelectedCoins - 1) {
              openModal();
            }
            updateSelectedCoinsModal();
          }
        } else if (selectedCoin >= 5) {
          openModal();
        }
        selectedCoins.push(selectedCoin);
      }
      updateSelectedCoinsModal();
    }

    $("#mainContent").on("click", ".btn-primary", handleCoinSelection);

  // Function to open the modal
  function openModal() {
    $("#exampleModal").modal("show");
    updateSelectedCoinsModal();
  }

    function closeSelectedCoinsModal() {
      modal.style.display = "none";
    }

    function updateSelectedCoinsModal() {
      const selectedCoinsModalContent = document.getElementById("selectedCoinsModalContent");
      selectedCoinsModalContent.innerHTML = `
    <h4>Selected Coins:</h4>
    <ul>
      ${selectedCoins
          .map((coin) => `<li>${coin.name} (${coin.symbol})</li>`)
          .join("")}
    </ul>
  `;
    }

    function saveSelectedCoins() {
      if(selectedCoin.length === 5){
      const coinToRemove = selectedCoins.length === maxSelectedCoins ? selectedCoins.pop() : null;
      }
      closeSelectedCoinsModal();
    }

    document
    .getElementById("saveChangesModal")
    .addEventListener("click", saveSelectedCoins);

  // Function to close the modal
  function closeSelectedCoinsModal() {
    $("#exampleModal").modal("hide");

      // You can implement your logic here to handle the selected coins
      // For example, you can update the main content to display the selected coins.
      // The selected coins are stored in the "selectedCoins" array.
      // You can also save the selected coins in session storage or perform any other action.
  }
}
})






    //  אם אני רוצה להשתמש בזה שמתי את זה למעלה בcard בין ה symbol לבין ה a href
/* <p class="card-text">${photos[i].current_price}$</p> */