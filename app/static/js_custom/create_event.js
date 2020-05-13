$(function() {
    create_event_start_date.min = new Date().toISOString().split("T")[0];
    create_event_end_date.min = new Date().toISOString().split("T")[0];
    $("#f_create_event").submit(function(e) {
        e.preventDefault();
        $("#btnsubmit_create_event").attr("disabled", true);
        var name = document.getElementById("create_event_name").value;
        var start_date = document.getElementById("create_event_start_date").valueAsDate.toISOString().split("T")[0];
        var end_date = document.getElementById("create_event_end_date").valueAsDate.toISOString().split("T")[0];
        var start_time = document.getElementById("create_event_start_time").value;
        var loc = document.getElementById("create_event_location").value;
        var site_link = document.getElementById("create_event_site_link").value;
        var sm_description = document.getElementById("create_event_description").value;
        var description = document.getElementById("create_event_sm_description").value;
        var additional_info = document.getElementById("create_event_additional_info").value;
        $.ajax({
            url: "/api/event",
            type: "POST",
            data: JSON.stringify({"name" : name,
                                  "start_date" : start_date,
                                  "end_date" : end_date,
                                  "start_time" : start_time,
                                  "location" : loc,
                                  "site_link" : site_link,
                                  "sm_description" : sm_description,
                                  "description" : description,
                                  "additional_info" : additional_info
                                }),
            contentType: "application/json",
            dataType: "json",
            success: function(data){
                $('#message').html(data["description"]);
                $("#f_create_event").trigger('reset');
                setTimeout(
                    function() {
                        $("#btnsubmit_create_event").html("Отправить");
                        $("#btnsubmit_create_event").attr("disabled", false);
                        window.location = '/';
                    }, 1000
                )
            },
            error: function(data){
                $('#message').html(data.responseJSON['error']);
                $("#btnsubmit_create_event").attr("disabled", false);
                setTimeout(
                    function() {
                        $('#message').html("");
                    }, 3000
                )
            }
        });
    });
});