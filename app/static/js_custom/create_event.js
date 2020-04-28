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
                                  "additional_info": $(".create_event_additional_info").val()
                                }),
            contentType: "application/json",
            dataType: "json",
            success: function(data){
                $('#message').html(data["description"]);
                setTimeout(
                    function() {
                    window.location = '/event/' + data["description"];
                    }, 2000
                )
            },
            error: function(data){
                $('#message').html(data.responseJSON['error']);
            }
        });
        $("#f_create_event").trigger('reset');
    });
});