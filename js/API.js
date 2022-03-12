const lastDateElem = document.getElementById("lastGameDate");

function getLastGameDate(playerName) {
  fetch(`https://node-monge-iti-project.herokuapp.com/games/${playerName}`)
    .then(response => response.json())
    .then(data => {
      let date = data['date'];
      if (date) {
        let formatedDate = new Date(date).toLocaleString("en-US");
        lastDateElem.innerHTML = formatedDate;
      } else {
        lastDateElem.innerHTML = "No date";
      }
    })
    .catch((error) => {
      lastDateElem.innerHTML = "Error";
    });
}

function saveGameDate(username) {
  fetch('https://node-monge-iti-project.herokuapp.com/games', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: username }),
  });
}