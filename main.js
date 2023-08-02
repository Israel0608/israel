"use strict";
$(() => {
  const moreInfo = [];
  let cards = [];
  const checkBox = document.getElementsByClassName(`form-check-input`);
  userImage();
  const currenciesLink = document.getElementById("currenciesLink");
  const reportsLink = document.getElementById("reportsLink");
  const aboutLink = document.getElementById("aboutLink");
  const mainContent = document.getElementById("mainContent")

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
    // const modal = new bootstrap.Modal(`#exampleModal`);
    // let modalArr = [];
    // $("#mainContent").on("click", ".form-check-input", function () {
    //   const cardId = $(this).closest(".card").find(".moreInfoBtn").attr("id");
    //   const index = modalArr.indexOf(cardId);
    //   if (index !== -1) {
    //     modalArr.splice(index, 1);

    //     $(`#${cardId}_modalSwitch`).prop("checked", false);
    //   } else {
    //     modalArr.push(cardId);
    //     $(`#${cardId}_modalSwitch`).prop("checked", true);
    //   }
    //   console.log(modalArr);

    //   if (modalArr.length >= 2) {
    //     showModal();
    //   }
    // });
    // function showModal() {
    //   const selectedCardsData = [];


    //   for (const id of modalArr) {
    //     const cardData = cards.find(card => card.id === id);
    //     if (cardData) {
    //       selectedCardsData.push(cardData)
    //     }

    //   }



    //   let modalHtml = "";
    //   for (const data of selectedCardsData) {
    //     modalHtml += `
    //       <div class="card">
    //       <h5 class="card-header">${data.symbol}</h5>
    //       <div class="logo-title">
    //         <!-- logo -->
    //         <img src="${data.image}" class="modal-logo" alt="my-logo" width="20%">
    //         <br></br>
    //         <h5 class="card-title">${data.name}</h5>
    //       </div>
    //       <!-- Switch box -->
    //       <div class="form-check form-switch">
    //         <input class="form-check-input-modal" type="checkbox" role="switch" id="${data.id}_modalSwitch">
    //       </div>
    //     </div>
          
    //       `
    //   }
    //   $(".modal-footer").html(modalHtml);

    //   modal.show()

      // $(".toggleCheck").on("click", function () {
      //   if (this.checked === true) {
      //     selectedCards.push(this.value);
      //   }
      //   if (this.checked === false) {
      //     let uncheck = this.value;
      //     const indexUncheck = selectedCards.findIndex((name) => name === uncheck);
      //     selectedCards.splice(indexUncheck, 1);
      //   }
      //   if (selectedCards.length > 5) {
      //     myModal.show();
      //   }

      //     const inModal = document.getElementById("inModal");
      //     let htmlCard = "";
      //     for (let i = 0; i < photos.length - 1; i++) {
      //       htmlCard += `
      //         <div class="card">
      //             <div class="card-body cardModal">
      //               <span class="nameSelectCard">${photos[i]}</span>
      //               <span class="btn-toggle selected-toggle">
      //               <input class="toggle-one ee" data-bs-dismiss="modal" type="checkbox" name="modalCheck" value="${selectedCards[i]}" id="checkModal${i}">
      //               <label class="toggle" for="checkModal${i}"></label>
      //             </span>
      //             </div>
      //           </div>`;
      //     }
      //     inModal.innerHTML = htmlCard;
      //   })
      //   }
      // })

      // const modalClose = document.getElementById('modalClose');
      // modalClose.addEventListener('click', () => {
      //   const lastItem = selectedCards[photos.length - 1];
      //   for (const x of checkboxes) {
      //     if (x.value === lastItem) {
      //       x.checked = false;
      //     }
      //   }
      //   const index = selectedCards.findIndex(x => x === lastItem);
      //   selectedCards.splice(index, 1);
      // });


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


