let data
document.addEventListener('DOMContentLoaded', init, false);
window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  
  if(clientHeight + scrollTop >= scrollHeight - 5) {
    addItems();
	}
});

async function init() {
  data = await (await fetch('/javs.json')).json()
  addItems();
}

function addItems(){
  let container = document.querySelector('.row');
  if(data.length>0){
    let items = getRandomItems();
    items.forEach(item => {
      container.innerHTML += renderCards(item);
    });
  }
}

function getRandomItems(){
  let indexof5 = get5RandomNumber();
  let getedItems = data.filter((item,i) => indexof5.includes(i));
  data = data.filter((item,i) => !indexof5.includes(i));
  return getedItems;
}

function get5RandomNumber(){
  let number = [];
  while(number.length<5){
    let ranNumber = Math.floor(Math.random() * data.length);
    if(!number.includes(ranNumber)){
      number.push(ranNumber);
    }
  }
  return number;
}

function renderAddItemsButton(){
  return `<div class="row">
    <a class="waves-effect waves-light btn" onclick="addItems()">Load More</a>
  </div>`
}

function renderCards({imgUrl, title, fakyutubUrl}){
  return `<div class="col s12 l4">
  <div class="card medium">
    <div class="card-image">
      <img loading='lazy' src="${imgUrl}.jpg">
    </div>
    <div class="card-content">
      <p>${title}</p>
    </div>
    <div class="card-action">
      <a href="${fakyutubUrl}">FK</a>
      <a href="/video/redirector?id=${fakyutubUrl.split('/')[fakyutubUrl.split('/').length-1]}&resolution=480p">480</a>
      <a href="/video/redirector?id=${fakyutubUrl.split('/')[fakyutubUrl.split('/').length-1]}&resolution=720p">720</a>
      <a href="/video/redirector?id=${fakyutubUrl.split('/')[fakyutubUrl.split('/').length-1]}&resolution=1080p">1080</a>
    </div>
  </div>
  </div>`;
}