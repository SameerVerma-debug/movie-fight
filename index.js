const fetchMovies = async (searchValue) => {
  const response = await axios.get("https://www.omdbapi.com/", {
    params: {
      apikey: "d9835cc5",
      s: `${searchValue}`,
    },
  });
  
  //No movie matches the search value
  if(response.data.Error){
    return[];
  }
  return response.data.Search;
};

const root = document.querySelector('.autocomplete');
root.innerHTML = `
  <label><b>Search For a Movie</b></label>
  <input class="input"/>
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>  
`;

const input = document.querySelector("input");
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

const onInput = async (event) => {
  //fetchMovies() is an async function and returns promise,
  //await is used to get the value promise is resolved with i.e Search result
  const movies = await fetchMovies(event.target.value);
  if(!movies.length){
    dropdown.classList.remove('is-active');
    return;
  }
  
  resultsWrapper.innerHTML = '';
  dropdown.classList.add('is-active');
  for (let movie of movies) {
    const option = document.createElement("a");
    option.classList.add('dropdown-item');

    //Handling broken images
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

    option.innerHTML = `<img src="${imgSrc }">
  ${movie.Title}`;
  option.addEventListener('click',() => {
    dropdown.classList.remove('is-active');
    input.value = movie.Title;
    onMovieClick(movie);
  })

    resultsWrapper.append(option);
  }
};

input.addEventListener("input", debounce(onInput));
window.addEventListener('click', (event) => {
  if(!root.contains(event.target)){
    dropdown.classList.remove('is-active');
  }
})

const onMovieClick = async (movie) => {
   const response = await axios.get("https://www.omdbapi.com/", {
    params: {
      apikey: "d9835cc5",
      i: `${movie.imdbID}`,
    },
  });
  console.log(response.data);
}
