document.addEventListener(
    'DOMContentLoaded',
    () => {
        $("#f_name_surname").submit(function(e) {
            e.preventDefault();
            $("#btnsubmit_name_surname").attr("disabled", true);
            var name = document.getElementById("profile_user_name").value;
            var surname = document.getElementById("profile_user_surname").value;
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
                    $("#name_surname").html(name + " " + surname);
                    $("#profile_user_name").attr('value', name);
                    $("#profile_user_surname").attr('value', surname);
                    setTimeout(
                        function() {
                            $('#personal_info_modal').modal('hide');
                            $("#btnsubmit_name_surname").html("Сохранить");
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
        
    })