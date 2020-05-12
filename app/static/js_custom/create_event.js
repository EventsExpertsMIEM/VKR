$(function() {
    create_event_start_date.min = new Date().toISOString().split("T")[0];
    create_event_end_date.min = new Date().toISOString().split("T")[0];
    $("#f_create_event").submit(function(e) {
        e.preventDefault();
        $("#btnsubmit_create_event").attr("disabled", true);
        name = document.getElementById("create_event_name").value;
        start_date = document.getElementById("create_event_start_date").value;
        end_date = document.getElementById("create_event_end_date").value;
        start_time = document.getElementById("create_event_start_date").value;
        location = document.getElementById("create_event_location").value;
        site_link = document.getElementById("create_event_site_link").value;
        sm_description = document.getElementById("create_event_description").value;
        description = document.getElementById("create_event_sm_description").value;
        additional_info = document.getElementById("create_event_additional_info").value;
        $.ajax({
            url: "/api/event",
            type: "POST",
            data: JSON.stringify({"name" : name,
                                  "start_date" : start_date,
                                  "end_date" : end_date,
                                  "start_time" : start_time,
                                  "location" : location,
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