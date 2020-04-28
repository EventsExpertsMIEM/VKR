$(function() {
    $("#f_login").submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: "/api/login",
            type: "POST",
            data: JSON.stringify({"email": $(".login_user_email").val(),
                                  "password": $(".login_user_password").val()
                                }),
            contentType: "application/json",
            dataType: "json",
            success: function(data){
                $('#message').html(data["description"]);
                $("#f_login").trigger('reset');
                setTimeout(
                    function() {
                    window.location = '/';
                    }, 2000
                )
            },
            error: function(data){
                $('#message').html(data.responseJSON['error']);
            }
        });
    });
});