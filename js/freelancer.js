function buttonClicked() {
  window.location.href = 'picker.html';
};

$(document).ready(function () {
    $("#selectImage").imagepicker( {
      clicked: function(select, a, b) {
        var places = localStorage.getItem("places");
        console.log(places);
      }
    });
});
// Go to activity selection
function imgClicked() {
  var places = [];
  $("*[multiple=multiple]").find("option:selected").each(function(index, item){
    places.push($(item).attr("value"));
  });

  localStorage.setItem("places", places);
  window.location.href = 'activities.html';

}

// Go to activity selection
function activityClicked() {
  var activities = [];
  $("*[multiple=multiple]").find("option:selected").each(function(index, item){
    activities.push($(item).attr("value"));
  });

  localStorage.setItem("activities", activities);
  window.location.href = 'budget.html';
  document.getElementById("valueUp").disabled = true;
}

// Go to weather selection
function budgetClicked() {
  var budget = document.getElementById("valueUp").innerHTML
  localStorage.setItem("budget", budget);
  window.location.href = 'weather.html';
}

// Go to weather selection
function weatherClicked() {
  var weather = "hot"
  $("*[multiple=multiple]").find("option:selected").each(function(index, item){
    weather.push($(item).attr("value"));
  });

  localStorage.setItem("activities", activities);
  window.location.href = 'budget.html';
  document.getElementById("valueUp").disabled = true;
}

jQuery(function($) {
  $('.slider').slider();

});

function showValue(v) {
  document.getElementById("valueUp").innerHTML = "£" + v;
}
