$(function() {
    $("#f_security").submit(function(e) {
        e.preventDefault();
        $("#btn_change_password").attr("disabled", true);
        $.ajax({
            url: "/api/change_password",
            type: "POST",
            data: JSON.stringify({"old_password": document.getElementById("profile_old_password").value,
                                  "new_password": document.getElementById("profile_new_password").value
                                }),
            contentType: "application/json",
            dataType: "json",
            success: function(data){
                $("#btn_change_password").html(data["description"]);
                $("#f_security").trigger('reset');
                setTimeout(
                    function() {
                        $("#btn_change_password").html("Сохранить новый пароль");
                        $("#btn_change_password").attr("disabled", false);
                    }, 2000
                )
            },
            error: function(data){
                $("#btn_change_password").html(data.responseJSON['error']);
                $("#btn_change_password").attr("disabled", false);
                setTimeout(
                        function() {
                            $("#btn_change_password").html("Сохранить новый пароль");
                        }, 3500
                    )
            }
        });
    });
});