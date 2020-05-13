$(function() {
    $("#f_personal_phone").submit(function(e) {
        e.preventDefault();
        $("#btnsubmit_user_phone").attr("disabled", true);
        var phone = document.getElementById("profile_user_phone").value;
        $.ajax({
            url: "/api/user/",
            type: "PUT",
            data: JSON.stringify({"phone": phone
                                }),
            contentType: "application/json",
            dataType: "json",
            success: function(data){
                $("#btnsubmit_user_phone").html(data["description"]);
                $("#p_phone").html(phone);
                setTimeout(
                    function() {
                        $('#personal_phone_modal').modal('hide');
                        $("#btnsubmit_user_phone").html("Сохранить");
                        $("#btnsubmit_user_phone").attr("disabled", false);
                    }, 1000
                )
            },
            error: function(data){
                $("#btnsubmit_user_phone").html(data.responseJSON['error']);
                $("#btnsubmit_user_phone").attr("disabled", false);
                setTimeout(
                    function() {
                        $("#btnsubmit_user_phone").html("Сохранить");
                    }, 3500
                )
            }
        }); 
    });
});