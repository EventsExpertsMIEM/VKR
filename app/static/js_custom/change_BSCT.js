$(function() {
    $("#f_BSCT").submit(function(e) {
        e.preventDefault();
        $("#btnsubmit_BSCT").attr("disabled", true);
        var dict = {};
        birth = document.getElementById("profile_user_birth").value;
        sex = document.getElementById("profile_user_sex").value;
        country = document.getElementById("profile_user_country").value;
        town = document.getElementById("profile_user_town").value;
        if (birth != ""){ dict['birth'] = birth; }
        if (sex != ""){ dict['sex'] = sex; }
        if (country != ""){ dict['country'] = country; }
        if (town != ""){ dict['town'] = town; }
        if (Object.keys(dict).length === 0) {
            $("#btnsubmit_BSCT").html("Нечего изменять");
            $("#btnsubmit_BSCT").attr("disabled", false);
            setTimeout(
                function() {
                    $("#btnsubmit_BSCT").html("Сохранить");
                }, 3500
            )
        } else {
            $.ajax({
                url: "/api/user/",
                type: "PUT",
                data: JSON.stringify(dict),
                contentType: "application/json",
                dataType: "json",
                success: function(data){
                    $("#btnsubmit_BSCT").html(data["description"]);
                    if (birth != "") { $("#p_birth").html(birth); $("#profile_user_birth").attr('value', birth); }
                    if (sex != "") { $("#p_sex").html(sex); $("#profile_user_sex").attr('value', sex); }
                    if (country != "") { $("#p_country").html(country); $("#profile_user_country").attr('value', country); }
                    if (town != "") { $("#p_town").html(town); $("#profile_user_town").attr('value', town); }
                    setTimeout(
                        function() {
                            $('#personal_BSCT_modal').modal('hide');
                            $("#btnsubmit_BSCT").html("Сохранить");
                            $("#btnsubmit_BSCT").attr("disabled", false);
                        }, 1000
                    )
                },
                error: function(data){
                    $("#btnsubmit_BSCT").html(data.responseJSON['error']);
                    $("#btnsubmit_BSCT").attr("disabled", false);
                    setTimeout(
                        function() {
                            $("#btnsubmit_BSCT").html("Сохранить");
                        }, 3500
                    )
                }
            });
        }
    });
});