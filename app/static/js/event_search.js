$(document).ready(function(){
  $("#event_name_search").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $(".event_card .card-header").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});