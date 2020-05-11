$(function() {
    $("#f_login").submit(function(e) {
        e.preventDefault();
        $("#btnsubmit").attr("disabled", true);
        $.ajax({
            url: "/api/login",
            type: "POST",
            data: JSON.stringify({"email": document.getElementById("login_user_email").value,
                                  "password": document.getElementById("login_user_password").value
                                }),
            contentType: "application/json",
            dataType: "json",
            success: function(data){
                $("#btnsubmit").html(data["description"]);
                $("#f_login").trigger('reset');
                setTimeout(
                    function() {
                        window.location = '/';
                    }, 1000
                )
            },
            error: function(data){
                $("#btnsubmit").html(data.responseJSON['error']);
                $("#btnsubmit").attr("disabled", false);
                setTimeout(
                    function() {
                        $("#btnsubmit").html("Войти");
                    }, 3500
                )
            }
        });
    });
});