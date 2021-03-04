$(".confirm-button").click(() => {
  let fieldValue = Math.ceil(Math.random() * 10);
  fetch('https://api.thingspeak.com/update?api_key=FVRA63GCX5781VVP&field2=' + fieldValue);
});
