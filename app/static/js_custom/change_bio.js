$(function() {
    $("#f_personal_bio").submit(function(e) {
        e.preventDefault();
        $("#btnsubmit_user_bio").attr("disabled", true);
        bio = document.getElementById("profile_user_bio").value;
        $.ajax({
            url: "/api/user/",
            type: "PUT",
            data: JSON.stringify({"bio": bio
                                }),
            contentType: "application/json",
            dataType: "json",
            success: function(data){
                $("#btnsubmit_user_bio").html(data["description"]);
                $("#profile_user_bio").attr('value', bio);
                $("#p_bio").html(bio);
                setTimeout(
                    function() {
                        $('#personal_bio_modal').modal('hide');
                        $("#btnsubmit_user_bio").html("Сохранить");
                        $("#btnsubmit_user_bio").attr("disabled", false);
                    }, 1000
                )
            },
            error: function(data){
                $("#btnsubmit_user_bio").html(data.responseJSON['error']);
                $("#btnsubmit_user_bio").attr("disabled", false);
                setTimeout(
                    function() {
                        $("#btnsubmit_user_bio").html("Сохранить");
                    }, 3500
                )
            }
        }); 
    });
});