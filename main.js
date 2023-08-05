"use strict";
$(() => {
  userImage();
  const currenciesLink = document.getElementById("currenciesLink");
  const reportsLink = document.getElementById("reportsLink");
  const aboutLink = document.getElementById("aboutLink");
  const mainContent = document.getElementById("mainContent");
  // const selectedCardsModal = document.getElementById("staticBackdrop");
  // const myModal = new bootstrap.Modal(selectedCardsModal);
  // const loadingModal = document.getElementById("loadingModal");
  // const modalLoad = new bootstrap.Modal(loadingModal);
  // const checkboxes = document.getElementsByClassName("toggle-one");
  // const selectedCards = [];

  currenciesLink.addEventListener("click", displayCurrencies);
  reportsLink.addEventListener("click", displayReports);
  aboutLink.addEventListener("click", displayAbout);

  function displayCurrencies() {
    mainContent.innerHTML = `<h1>Currencies...</h1>`
  }

  function displayReports() {
    mainContent.innerHTML = `<h1>Reports...</h1>`
  }

  function displayAbout() {
    mainContent.innerHTML = `<h1>About...</h1>`
  }

  const searchBar = document.getElementById("searchBar");
  searchBar.addEventListener('input', async function () {
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
        <input class="form-check-input" type="checkbox" role="switch" value="${photos[i].id}">
      </div>
          <img src="${photos[i].image}" class="card-coins">
          <div class="card-body">
            <h5 class="card-title">${photos[i].symbol}</h5>
            <a href="" class="btn btn-primary">more info</a>
            <div class="spinner-container">
  <div class="spinner"></div>
</div>
          </div>
           <div class="moreInfo">
           </div>
        </div>
      `);
    }

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    const btns = document.querySelectorAll('.btn-primary');
    btns.forEach(function (btn) {
      btn.addEventListener("click", async function (event) {
        event.preventDefault();
        const moreInfo = this.closest('.card').querySelector('.moreInfo');
        const spinnerContainer = this.closest('.card').querySelector('.spinner-container');

        // הצגת הספינר
        spinnerContainer.style.display = "flex";

        const cryptoId = this.closest(`.card`).id;
        const json = await getCrypto(cryptoId);

        await sleep(2000);
        // הסתרת הספינר לאחר שקיבלנו את המידע
        spinnerContainer.style.display = "none";

        moreInfo.style.display = (moreInfo.style.display === 'none') ? 'block' : 'none';
        moreInfo.innerHTML = `
          <p class="card-text">price in USD: ${json.market_data.current_price.usd}$</p>
          <p class="card-text">price in EURO: ${json.market_data.current_price.eur}€</p>
          <p class="card-text">price in ILS: ${json.market_data.current_price.ils}₪</p>
        `
      });

      async function getCrypto(id) {
        const data = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
        const json = await data.json();
        return json;
      }
    });
  }
})


