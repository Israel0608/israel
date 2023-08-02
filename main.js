"use strict";
let selectedCoin = [];
$(() => {
  userImage();
  const currenciesLink = document.getElementById("currenciesLink");
  const reportsLink = document.getElementById("reportsLink");
  const aboutLink = document.getElementById("aboutLink");
  const mainContant = document.getElementById("mainContant")

  currenciesLink.addEventListener("click", displayCurrencies);
  reportsLink.addEventListener("click", displayReports);
  aboutLink.addEventListener("click", displayAbout);

  function displayCurrencies(){
    mainContant.innerHTML = `<h1>Currencies...</h1>`
  }

  function displayReports(){
    mainContant.innerHTML = `<h1>Repoets...</h1>`
  }

  function displayAbout(){
    mainContant.innerHTML = `<h1>About...</h1>`
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
        <input class="form-check-input" type="checkbox" role="switch" value="${photos[i].symbol}">
      </div>
          <img src="${photos[i].image}" class="card-coins">
          <div class="card-body">
            <h5 class="card-title">${photos[i].symbol}</h5>
            <a href="" class="btn btn-primary">more info</a>
          </div>
           <div class="moreInfo">
           <div name="spinner" class="spinner-border spinner-border-sm" role="status" style="display: none";></div>
           </button>
           <div>
             <div class="collapse" id="collapseExample${i}">
               <div id="infoCoin${i}" class="card card-body collapse-body"></div>
             </div>
           </div>
         </div>
           </div>
        </div>
      `);
    }
    $(".toggleCheck").on("click", function () {
      if (this.checked === true) {
        selectedCards.push(this.value);
      }
      if (this.checked === false) {
        let uncheck = this.value;
        const indexUncheck = selectedCards.findIndex((name) => name === uncheck);
        selectedCards.splice(indexUncheck, 1);
      }
      if (selectedCards.length > 5) {
        myModal.show();
      }
      const inModal = document.getElementById("inModal");
      let htmlCard = "";
      for (let i = 0; i < photos.length - 1; i++) {
        htmlCard += `
          <div class="card">
              <div class="card-body cardModal">
                <span class="nameSelectCard">${photos[i]}</span>
                <span class="btn-toggle selected-toggle">
                <input class="toggle-one ee" data-bs-dismiss="modal" type="checkbox" name="modalCheck" value="${selectedCards[i]}" id="checkModal${i}">
                <label class="toggle" for="checkModal${i}"></label>
              </span>
              </div>
            </div>`;
      }
      inModal.innerHTML = htmlCard;

      const buttonsArr = document.getElementsByClassName("moreInfo");
    for (let i = 0; i < buttonsArr.length; i++) {
      buttonsArr[i].addEventListener("click", async function () {
        if (this.getAttribute("aria-expanded") == "true") {
          const moreInfoCoin = await getMoreInfoFromSessionOrHttps(this);
          const collapse = document.getElementById(`infoCoin${i}`);
          let htmlCol = "";
          for (const item of moreInfoCoin) {
            if (item.name === this.id) {
              htmlCol += `
              USD : ${item.usd} $<br>
              EUR : ${item.eur} €<br>
              ILS : ${item.ils} ₪<br>`;
              collapse.innerHTML = htmlCol;
            }
          }
        }
      });
    }
  })

  const modalClose = document.getElementById('modalClose');
  modalClose.addEventListener('click', () => {
    const lastItem = selectedCards[selectedCards.length - 1];
    for (const x of checkboxes) {
      if (x.value === lastItem) {
        x.checked = false;
      }
    }
    const index = selectedCards.findIndex(x => x === lastItem);
    selectedCards.splice(index, 1);
  });


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

  }
})
