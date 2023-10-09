const selectedCryptocurrency = document.querySelector('#criptomonedas');
const selectedcurrency = document.querySelector('#moneda');
const form = document.querySelector('#formulario');
const result = document.querySelector('#resultado');

const objSearch = {
    currency: '',
    cryptocurrency: ''
}

// Create a Promise
const obtenerCriptomonedas = criptomonedas => new Promise(resolve =>{
    resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded', () => {
    consultCryptocurrency();

    form.addEventListener('submit', submitForm);

    selectedCryptocurrency.addEventListener('change', readValue);
    selectedcurrency.addEventListener('change', readValue);
})

function consultCryptocurrency(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
    fetch(url)
        .then(respuesta =>respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas))
}

function selectCriptomonedas(cryptocurrencies){
    cryptocurrencies.forEach(crypto => {
        const { FullName, Name } = crypto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        selectedCryptocurrency.appendChild(option);
    })
}

function readValue(e){
    objSearch[e.target.name] = e.target.value
    
}

function submitForm(e){
    e.preventDefault();

    // Validar
    const { currency, cryptocurrency} = objSearch;

    if(currency === '' || cryptocurrency === ''){
        showAlert('Ambos campos son obligatorios');
        return;
    }

    // Request the API with the results
    consultApi();
}

function showAlert(msg){

    const errorExist = document.querySelector('.error');

    if(!errorExist){
        const divMessage = document.createElement('div');
        divMessage.classList.add('error');

        // error message
        divMessage.textContent = msg;

        form.appendChild(divMessage);

        setTimeout(() => {
            divMessage.remove();
        }, 3000);
    }
}

function consultApi(){
    const { currency, cryptocurrency} = objSearch;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptocurrency}&tsyms=${currency}`;

    showSpinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion => {
            showPriceHTML(cotizacion.DISPLAY[cryptocurrency][currency]);
        })
}

function showPriceHTML(cotization){

    cleanHTML();
    
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotization;

    const price = document.createElement('p');
    price.classList.add('precio');
    price.innerHTML = `El Precio es: <span>${PRICE}</span>`;

    const highValue = document.createElement('p');
    highValue.innerHTML = `<p>Precio más alto del día: <span>${HIGHDAY}</><p/>`

    const lowValue = document.createElement('p');
    lowValue.innerHTML = `<p>Precio más bajo del día: <span>${LOWDAY}</><p/>`

    const lastHours = document.createElement('p');
    lastHours.innerHTML = `<p>Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}%</><p/>`

    const lastUpdate = document.createElement('p');
    lastUpdate.innerHTML = `<p>Última Actualización: <span>${LASTUPDATE}</><p/>`

    result.appendChild(price);
    result.appendChild(highValue);
    result.appendChild(lowValue);
    result.appendChild(lastHours);
    result.appendChild(lastUpdate);
}

function cleanHTML(){
    while(result.firstChild){
        result.removeChild(result.firstChild);
    }
}

function showSpinner() {
    cleanHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    `;

    result.appendChild(spinner);
}