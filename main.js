"use strict";
$(() => {
  virtualCurrencies();

  const cryptoCards = [];
  function saveToSessionStorage(key, moreInfo) {
    sessionStorage.setItem(key, JSON.stringify(moreInfo));
  }


  function getFromSessionStorage(key) {
    const moreInfo = sessionStorage.getItem(key);
    return value ? JSON.parse(moreInfo) : null;
  }



  const currenciesLink = document.getElementById("currenciesLink");
  const reportsLink = document.getElementById("reportsLink");
  const aboutLink = document.getElementById("aboutLink");
  const mainContent = document.getElementById("mainContent");


  currenciesLink.addEventListener("click", displayCurrencies);
  reportsLink.addEventListener("click", displayReports);
  aboutLink.addEventListener("click", displayAbout);


  async function displayCurrencies() {
    mainContent.innerHTML = '';
    const photos = await getJson();
    displayCrypto(photos);
  }

  function displayReports() {
    mainContent.innerHTML = '';
    mainContent.innerHTML = `<h1>Reports...</h1>
    <img src="assets/working.webp" width="100%" height="100%">`
  }

  function displayAbout() {
    mainContent.innerHTML = '';
    mainContent.innerHTML = `<h1>About...</h1>
    <img src="assets/israelSofer.jpg" width="200px">
    <p>A few words about myself: Hi, I'm Israel Sofer,
     I'm 20 years old, I work at Aroma (coffee shop) 
     and I study at John Bryce full stack web 😁</p>

    <p>And a few words about the project I did: Decentralization: 
    Unlike traditional currencies issued and controlled by governments or financial institutions, 
    cryptocurrencies operate on decentralized networks using blockchain technology. This means no single entity has full control over the currency, 
    enhancing security and reducing the risk of manipulation.

    Blockchain Technology: Cryptocurrencies rely on blockchain, 
    a distributed ledger that records all transactions across a network of computers.
    Each block contains a group of transactions, and once added to the blockchain, 
    it becomes immutable,
     creating a transparent and tamper-resistant record of all transactions.</p>`
  }

  const searchBar = document.getElementById("searchBar");
  searchBar.addEventListener('input', async function () {
    const searchValue = searchBar.value;
    const Data = await getJson("api.json");
    if (searchValue) {
      const filteredData = Data.filter(item => item.id.indexOf(searchValue) > -1 || item.symbol.indexOf(searchValue) > -1)
      $("#mainContent").empty();
      displayCrypto(filteredData);
      // console.log(result)
    } else {
      const filteredData = Data.filter(item => item.id.indexOf(searchValue) > -1 || item.symbol.indexOf(searchValue) > -1)
      $("#mainContent").empty();
      displayCrypto(filteredData);
    }

  })
  async function virtualCurrencies() {
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
      cryptoCards.push(photos);
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

        if (moreInfo.style.display === 'none' || moreInfo.style.display === '') {
          spinnerContainer.style.display = "flex";

          const cryptoId = this.closest('.card').id;
          const json = await getCrypto(cryptoId);

          const id = this.closest('.card').id;
          spinnerContainer.style.display = "none";

          moreInfo.style.display = 'block';
          moreInfo.innerHTML = `
          
        <p class="card-text">price in USD: ${json.market_data.current_price.usd}$</p>

        <p class="card-text">price in EURO: ${json.market_data.current_price.eur}€</p>

        <p class="card-text">price in ILS: ${json.market_data.current_price.ils}₪</p>

      `;

          saveToSessionStorage(id, moreInfo.innerHTML);
        } else {
          moreInfo.style.display = 'none';
        }
      });
    });



    async function getCrypto(id) {
      const data = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
      const json = await data.json();
      return json;
    }

    let toggleButtonClickCount = 0;
    const cardContents = [];


    function showModalIfNeeded() {
      if (toggleButtonClickCount > 5) {
        const lastSixContents = cardContents.slice(-6);
        const modalBody = document.querySelector('#staticBackdrop .modal-body');
        modalBody.innerHTML = lastSixContents.join('');
        $('#staticBackdrop').modal('show');


        const modalToggleButtons = document.querySelectorAll('#staticBackdrop .form-switch input[type="checkbox"]');
        modalToggleButtons.forEach((button) => {
          button.checked = true;
          button.addEventListener('click', modalToggleButtonHandler);
        });
      }
    }

    const toggleButtons = document.querySelectorAll('.form-switch input[type="checkbox"]');
    toggleButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        if (button.checked) {
          toggleButtonClickCount++;
          cardContents.push(button.closest('.card').innerHTML);
          showModalIfNeeded();
        } else {
          toggleButtonClickCount--;
          const cardIndex = cardContents.indexOf(button.closest('.card').innerHTML);
          if (cardIndex !== -1) {
            cardContents.splice(cardIndex, 1);
          }
        }

        updateModalToggleButtonsListeners();
      });
    });

    function updateModalToggleButtonsListeners() {
      const modalToggleButtons = document.querySelectorAll('#staticBackdrop .form-switch input[type="checkbox"]');
      modalToggleButtons.forEach((button) => {
        button.removeEventListener('click', modalToggleButtonHandler);
        button.addEventListener('click', modalToggleButtonHandler);
      });
    }

    function modalToggleButtonHandler() {
      this.checked = true;
      const modalToggleButtons = document.querySelectorAll('#staticBackdrop .form-switch input[type="checkbox"]');
      let allChecked = true;
      modalToggleButtons.forEach((button) => {
        if (!button.checked) {
          allChecked = false;
        }
      });
      if (allChecked) {
        $('#staticBackdrop').modal('hide');
        toggleButtonClickCount--;
      }
    }

    const modalCloseButton = document.getElementById('modalClose');
    modalCloseButton.addEventListener('click', () => {
      toggleButtonClickCount--;
      updateModalToggleButtonsListeners();
    });

    $(document).ready(function () {
      showModalIfNeeded();
      updateModalToggleButtonsListeners();
    });

  }
})


