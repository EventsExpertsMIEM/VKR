$(function() {
    $("#f_reset").submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: "/api/reset_password",
            type: "POST",
            data: JSON.stringify({"email": $(".reset_user_email").val(),
                                }),
            contentType: "application/json",
            dataType: "json",
            success: function(data){
                $('#message').html(data["description"]);
                $("#f_reset").trigger('reset');
                $("#btnsubmit").attr("disabled", true);
                setTimeout(
                    function() {
                    window.location = '/';
                    }, 1000
                )
            },
            error: function(data){
                $('#message').html(data.responseJSON['error']);
            }
        });
    });
});