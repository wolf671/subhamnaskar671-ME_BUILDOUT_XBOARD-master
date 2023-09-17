async function getRssFeed(magazines){
    const accordionSection = document.getElementById('accordionSection');

    for(let i = 0 ; i < magazines.length ; i++){
        try{
            const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${magazines[i]}`);
            if(response.status === 200){
                const data = await response.json();
                const id = ID();
                const{feed,items} =data;

                const accordion = renderAccordionSection(i,id, feed.title);
                accordionSection.innerHTML += accordion;
                renderCarouselItems(id,items);
            }
            else{
                throw new Error('Failed to fetch data');
            }
        }catch(err){
            console.error(err);
        }
    }
}

let ID =()=> Math.random().toString(36).substr(2,9);

const renderAccordionSection = (index, id, title) => {
    let divAccordion = `
  <div class="accordion-item">
    <button class="accordion-button ${index === 0 ? "" : "collapsed"}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${id}" aria-expanded="true" aria-controls="collapse-${id}">
      ${title}
    </button>
    <div id="collapse-${id}" class="accordion-collapse collapse ${index === 0 ? "show" : ""}" aria-labelledby="heading-${id}" data-bs-parent="#accordionSection">
      <div class="accordion-body">
        <div id="indicator-${id}" class="carousel slide" data-ride="carousel"> 
          <div class="carousel-inner" id="carousel-inner-${id}"></div>
          <a class="carousel-control-prev" href="#indicator-${id}" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
          </a>
          <a class="carousel-control-next" href="#indicator-${id}" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
          </a>
        </div>
      </div>
    </div>
  </div>
`;
return divAccordion;
}
const renderCarouselItems = (id, items) => {
    const carouselInnerId = document.querySelector(`#carousel-inner-${id}`);
  const carouselTemplates = items.map((el, j) => carouselItemTemplate(el, j));
carouselInnerId.innerHTML = carouselTemplates.join('');
   console.log(carouselInnerId);
  }
  
  const carouselItemTemplate = (el, j) => `
    <div class="carousel-item ${j === 0 ? "active" : ""}">
      <div class="card d-block">
        <img class="w-100 img img-responsive" src="${el.enclosure.link}" alt="${el.guid}">
        <div class="card-body">
          <h5 class="card-title">${el.title}</h5>
          <p class="card-author">${el.author} <span class="ellipse"></span> ${new Date(el.pubDate).toLocaleDateString()}</p>
          <p class="card-text">${el.description.slice(0, 100)}...
            <a href="${el.link}" class="card-link" target="_blank">View Details</a>
          </p>
        </div>
      </div>
    </div>
  `;
  
  export { getRssFeed };

