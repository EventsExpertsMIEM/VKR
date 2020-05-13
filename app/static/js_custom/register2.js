document.getElementById("btnsubmit").onclick = function() {myFunction()};

function myFunction() {
    $("#btnsubmit").attr("disabled", true);
    $.ajax({
        url: "/api/register",
        type: "POST",
        data: JSON.stringify({"email": document.getElementById("register_user_email").value,
                              "password": document.getElementById("register_user_password").value,
                              "name": document.getElementById("register_user_name").value,
                              "surname": document.getElementById("register_user_surname").value
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
                    $("#btnsubmit").html("Зарегистрироваться");
                }, 3500
            )
        }
    });
}