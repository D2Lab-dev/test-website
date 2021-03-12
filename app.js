function getResult(peak, threshold) {
  let result = "";
  if (Number(peak) > Number(threshold)) {
    result = "Positivo";
  } else {
    result = "Negativo";
  }
  return result;
}

function firtsSyncThingspeak() {
  syncThingspeak();

  fetch('https://api.thingspeak.com/channels/225720/fields/8/last?api_key=8TIGV4UH1RO151E7')
  .then(response => response.text())
  .then(data => {
    $("#IPeakThInput").val(Number(data).toExponential(4));
    thresholdValueOld = Number(data).toExponential(4);
  });
}

function syncThingspeak() {
  console.log("Running synch ops.");

  fetch('https://api.thingspeak.com/channels/1311141/feeds.json?api_key=14XPPECCU0XV7VCU&results=20')
  .then(response => response.json())
  .then(data => {

    let lastEntry = data.feeds.length;
    $(".display-codice-fiscale").text(data.feeds[lastEntry-1].field1);
    if (data.feeds[lastEntry-1].field3 > data.feeds[lastEntry-1].field5) {
      $(".test-result-image").attr("src","images/test-positive.svg");
    } else {
      $(".test-result-image").attr("src","images/test-negative.svg");
    }

    for (var i = data.feeds.length; i > data.feeds.length - 3; i--) {
      let id = data.feeds.length - i;
      $(".element" + id + " > .codice-fiscale").text(data.feeds[i - 1].field1);
      $(".element" + id + " > .I-peak").text(Number(data.feeds[i - 1].field3).toExponential(4));
      $(".element" + id + " > .I-threshold").text(Number(data.feeds[i - 1].field5).toExponential(4));
      $(".element" + id + " > .result").text(getResult(data.feeds[i - 1].field3, data.feeds[i - 1].field5));
    }
  });
}

$(".confirm-threshold").click(() => {
  thresholdValueOld = Number($("#IPeakThInput").val()).toExponential(4);
  fetch("https://api.thingspeak.com/update?api_key=H3KZKXZT2XZT47WM&field8=" + Number($("#IPeakThInput").val()).toExponential(4));
  console.log("threshold updated.");
  $(".confirm-threshold").prop("disabled", true);
});

$("#IPeakThInput").change(() => {
  Number($("#IPeakThInput").val(Number($("#IPeakThInput").val()).toExponential(4)));
  if (Number($("#IPeakThInput").val()).toExponential(4) != thresholdValueOld) {
    $(".confirm-threshold").prop("disabled", false);
  } else {
    $(".confirm-threshold").prop("disabled", true);
  }
});

firtsSyncThingspeak();
let thresholdValueOld; //= Number($("#IPeakThInput").val()).toExponential(4); // Input box threshold value global

setInterval(syncThingspeak, 2000);
