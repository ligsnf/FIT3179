var populationDensityMap = "js/population_density.vg.json";

let year = 1980;
let timer;
let isPaused = true;

// Function to update the year in the visualization
function updateYear(view, newYear) {
  view.signal('selected_year', newYear).run();
}

// Function to get the current year from the slider
function getCurrentYear(view) {
  return view.signal('selected_year');  // Get the current value from the year slider
}

// Function to start the animation and stop at 2024
function startAnimation(view) {
  timer = setInterval(() => {
    if (year < 2024) {
      year += 2;  // Increment by 2 years
      updateYear(view, year);
    } else {
      clearInterval(timer);  // Stop the animation when reaching 2024
      document.getElementById("pauseButton").textContent = "Play";  // Reset button text to "Play"
      isPaused = true;  // Set the state to paused
    }
  }, 200);  // Change the year every 200ms
}

// Function to toggle the pause and play of the animation
function toggleAnimation(view) {
  const button = document.getElementById("pauseButton");

  // Sync the `year` variable with the current year from the control before starting
  if (isPaused) {
    year = getCurrentYear(view);  // Get the actual year from the slider before starting the animation
    year = (year >= 2024) ? 1980 : year;  // If the animation finished, restart from 1980
    startAnimation(view);  // Play the animation
    button.textContent = "Pause";  // Change button text to Pause
  } else {
    clearInterval(timer);  // Pause the animation
    button.textContent = "Play";  // Change button text to Play
  }

  isPaused = !isPaused;  // Toggle the pause state
}

// Embed the Vega-Lite visualization
vegaEmbed("#population-density", populationDensityMap, {"actions": false}).then(function(result) {
  const view = result.view;

  // Scope the selection to the specific visualization's controls
  const controls = document.querySelector("#population-density .vega-bindings");

  // Create a new div container for both controls and button section
  const controlContainer = document.createElement("div");
  controlContainer.classList.add("control-container");

  // Move the existing controls into the new container
  controlContainer.appendChild(controls);

  // Create a div for the buttons
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  // Create the Play/Pause button
  const playPauseButton = document.createElement("button");
  playPauseButton.id = "pauseButton";
  playPauseButton.textContent = "Play";  // Initial state is Play
  buttonContainer.appendChild(playPauseButton);

  // Create a Reset button (commented out as per the request)
  /*
  const resetButton = document.createElement("button");
  resetButton.id = "resetButton";
  resetButton.textContent = "Reset";  // Text for reset button
  buttonContainer.appendChild(resetButton);
  */

  // Append the button container to the control container
  controlContainer.appendChild(buttonContainer);

  // Append the control container back into the population-density div
  document.querySelector("#population-density").appendChild(controlContainer);

  // Add event listener to the Play/Pause button to toggle the animation
  document.getElementById("pauseButton").addEventListener("click", (event) => {
    event.preventDefault();  // Prevent form submission
    toggleAnimation(view);
  });

  // Add event listener for the Reset button (commented out as per the request)
  /*
  document.getElementById("resetButton").addEventListener("click", (event) => {
    event.preventDefault();  // Prevent form submission
    year = 1980;  // Reset the year to initial value
    updateYear(view, year);
  });
  */

}).catch(console.error);
