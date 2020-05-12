$(function() {
    $("#f_BSCT").submit(function(e) {
        e.preventDefault();
        $("#btnsubmit_BSCT").attr("disabled", true);

        var dict = {};
        birth = document.getElementById("profile_user_birth").value;
        birth_old = document.getElementById("profile_user_birth").getAttribute("birth_old");
        sex = document.getElementById("profile_user_sex").value;
        sex_old = document.getElementById("profile_user_sex").getAttribute("sex_old");
        country = document.getElementById("profile_user_country").value;
        country_old = document.getElementById("profile_user_country").getAttribute("country_old");
        town = document.getElementById("profile_user_town").value;
        town_old = document.getElementById("profile_user_town").getAttribute("town_old");

        if (birth != birth_old){ dict["birth"] = birth; }
        if (sex != sex_old){ dict["sex"] = sex; }
        if (country != country_old){ dict["country"] = country; }
        if (town != town_old){ dict["town"] = town; }

        if (Object.keys(dict).length === 0) {
            $("#btnsubmit_BSCT").html("Нечего изменять");
            setTimeout(
                function() {
                    $("#btnsubmit_BSCT").html("Сохранить");
                    $("#btnsubmit_BSCT").attr("disabled", false);
                }, 2500
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
                    if (birth != birth_old) {
                        if (birth == "") {
                            $("#p_birth").html("None");
                        } else {
                            $("#p_birth").html(birth);
                        }
                        $("#profile_user_birth").attr('value', birth);
                        $("#profile_user_birth").attr('birth_old', birth);
                    }
                    if (sex != sex_old) {
                        if (sex == "") {
                            $("#p_sex").html("None");
                        } else {
                            $("#p_sex").html(sex);
                        }
                        $("#profile_user_sex").attr('value', sex);
                        $("#profile_user_sex").attr('sex_old', sex);
                    }
                    if (country != country_old) {
                        if (country == "") {
                            $("#p_country").html("None");
                        } else {
                            $("#p_country").html(country);
                        }
                        $("#profile_user_country").attr('value', country);
                        $("#profile_user_country").attr('country_old', country);
                    }
                    if (town != town_old) {
                        if (town == "") {
                            $("#p_town").html("None");
                        } else {
                            $("#p_town").html(town);
                        }
                        $("#profile_user_town").attr('value', town);
                        $("#profile_user_town").attr('town_old', town);
                    }
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