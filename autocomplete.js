const createAutoComplete = ({root, renderOption, onOptionClick, inputValue, fetchData}) => {
  root.innerHTML = `
    <label><b>Search For a Movie</b></label>
    <input class="input"/>
    <div class="dropdown">
      <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
      </div>
    </div>  
  `;

  const input = root.querySelector("input");
  const dropdown = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".results");

  const onInput = async (event) => {
    //fetchMovies() is an async function and returns promise,
    //await is used to get the value promise is resolved with i.e Search result
    const items = await fetchData(event.target.value);
    if (!items.length) {
      dropdown.classList.remove("is-active");
      return;
    }

    resultsWrapper.innerHTML = "";
    dropdown.classList.add("is-active");
    for (let item of items) {
      const option = document.createElement("a");
      option.classList.add("dropdown-item");

      option.innerHTML = renderOption(item);
      option.addEventListener("click", () => {
        dropdown.classList.remove("is-active");
        input.value = inputValue(item);
        onOptionClick(item);
      });

      resultsWrapper.append(option);
    }
  };

  input.addEventListener("input", debounce(onInput));
  window.addEventListener("click", (event) => {
    if (!root.contains(event.target)) {
      dropdown.classList.remove("is-active");
    }
  });
};
