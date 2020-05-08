$(function() {
    $("#f_create_event").submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: "/api/event",
            type: "POST",
            data: JSON.stringify({"name": $(".create_event_name").val(),
                                  "sm_description": $(".create_event_sm_description").val(),
                                  "description": $(".create_event_description").val(),
                                  "start_date": $(".create_event_start_date").val(),
                                  "end_date": $(".create_event_end_date").val(),
                                  "start_time": $(".create_event_start_time").val(),
                                  "location": $(".create_event_location").val(),
                                  "site_link": $(".create_event_site_link").val(),
                                  "additional_info": $(".create_event_additional_info").val()
                                }),
            contentType: "application/json",
            dataType: "json",
            success: function(data){
                $('#message').html("Event was created");
                $("#f_create_event").trigger('reset');
                $("#btnsubmit").attr("disabled", true);
                setTimeout(
                    function() {
                    window.location = '/event/' + data["description"];
                    }, 1000
                )
            },
            error: function(data){
                $('#message').html(data.responseJSON['error']);
            }
        });
    });
});