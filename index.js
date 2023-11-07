createAutoCompleteConfig = {
  renderOption(movie) {
    //Handling broken images
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
    <img src="${imgSrc}">
    ${movie.Title} (${movie.Year})`;
  },
  inputValue(movie) {
    return `${movie.Title}`;
  },
  async fetchData(searchValue) {
    const response = await axios.get("https://www.omdbapi.com/", {
      params: {
        apikey: "d9835cc5",
        s: `${searchValue}`,
      },
    });

    //No movie matches the search value
    if (response.data.Error) {
      return [];
    }
    return response.data.Search;
  },
};

createAutoComplete({
  //get all the properties of createAutoCompleteConfig object
  ...createAutoCompleteConfig,
  root: document.querySelector("#left-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#left-summary"), "left");
  },
});

createAutoComplete({
  ...createAutoCompleteConfig,
  root: document.querySelector("#right-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#right-summary"), "right");
  },
});

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get("https://www.omdbapi.com/", {
    params: {
      apikey: "d9835cc5",
      i: `${movie.imdbID}`,
    },
  });

  summaryElement.innerHTML = movieTemplate(response.data);

  if(side === 'left'){
    leftMovie = response.data;
  }
  else{
    rightMovie = response.data;
  }

  if(leftMovie && rightMovie){
    runComparison();
  }
};

const runComparison = () => {
  const leftMovieStats = document.querySelectorAll('#left-summary .notification');
  const rightMovieStats = document.querySelectorAll('#right-summary .notification');

  for(let index = 0 ; index<leftMovieStats.length ; index++){
    let leftValue = parseInt(leftMovieStats[index].dataset.value);
    let rightValue = parseInt(rightMovieStats[index].dataset.value);
    console.log(leftValue + " " + rightValue);

    if(leftValue < rightValue){
      leftMovieStats[index].classList.remove('is-primary');
      leftMovieStats[index].classList.add('is-warning');
    }
    else if(leftValue > rightValue){
      rightMovieStats[index].classList.remove('is-primary');
      rightMovieStats[index].classList.add('is-warning');
    }
  }
}

const movieTemplate = (movieDetail) => {
  const boxOfficeCollection = parseInt(movieDetail.BoxOffice.replace(/\$/,'').replace(/,/g,''));
  const metaScore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g,''));
  const awards = movieDetail.Awards.split(' ').reduce((total,word) => {
    let value = parseInt(word);
    if(isNaN(value)){}
    else{
      total = total + value;
    }
    return total;
  },0);

  return `
  <article class="media">
    <figure class="media-left">
      <p class="image">
        <img src="${movieDetail.Poster}">
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <h1>${movieDetail.Title}</h1>
        <h4>${movieDetail.Genre}</h4>
        <p>${movieDetail.Plot}</p>
      </div>
    </div>
  </article>
  <article data-value="${awards}" class="notification is-primary">
    <p class="title">${movieDetail.Awards}</p>
    <p class="subtitle">Awards</p>
  </article>
  <article data-value="${boxOfficeCollection}" class="notification is-primary">
    <p class="title">${movieDetail.BoxOffice}</p>
    <p class="subtitle">Box Office</p>
  </article>
  <article data-value="${metaScore}" class="notification is-primary">
    <p class="title">${movieDetail.Metascore}</p>
    <p class="subtitle">Metascore</p>
  </article>
  <article data-value="${imdbRating}" class="notification is-primary">
    <p class="title">${movieDetail.imdbRating}</p>
    <p class="subtitle">IMDB Rating</p>
  </article>
  <article data-value="${imdbVotes}" class="notification is-primary">
    <p class="title">${movieDetail.imdbVotes}</p>
    <p class="subtitle">IMDB Votes</p>
  </article>
  `;
};
