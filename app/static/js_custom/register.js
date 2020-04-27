$(function() {
    $("#f_register").submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: "/api/register",
            type: "POST",
            data: JSON.stringify({"email": $(".register_user_mail").val(),
                                  "name": $(".register_user_name").val(),
                                  "surname": $(".register_user_surname").val(),
                                  "password": $(".register_user_password").val()
                                }),
            contentType: "application/json",
            dataType: "json",
            success: function(data){
                $('#message').html(data["description"]);
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
        $("#f_register").trigger('reset');
    });
});