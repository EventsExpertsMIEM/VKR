$(function() {
    $("#f_name_surname").submit(function(e) {
        e.preventDefault();
        $("#btnsubmit_name_surname").attr("disabled", true);
        name = document.getElementById("profile_user_name").value;
        surname = document.getElementById("profile_user_surname").value;
        $.ajax({
            url: "/api/user/",
            type: "PUT",
            data: JSON.stringify({"name": name,
                                  "surname": surname
                                }),
            contentType: "application/json",
            dataType: "json",
            success: function(data){
                $("#btnsubmit_name_surname").html(data["description"]);
                $("#f_name_surname").trigger('reset');
                $("#name_surname").html(name + " " + surname);
                setTimeout(
                    function() {
                        $('#personal_info_modal').modal('hide');
                        $("#btnsubmit_name_surname").html("Сохранить");
                        $("#profile_user_name").attr('placeholder', name);
                        $("#profile_user_surname").attr('placeholder', surname);
                        $("#btnsubmit_name_surname").attr("disabled", false);
                    }, 1000
                )
            },
            error: function(data){
                $("#btnsubmit_name_surname").html(data.responseJSON['error']);
                $("#btnsubmit_name_surname").attr("disabled", false);
                setTimeout(
                    function() {
                        $("#btnsubmit_name_surname").html("Сохранить");
                    }, 3500
                )
            }
        });
    });
});