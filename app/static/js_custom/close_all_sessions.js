$(function() {
    $("#f_close_all_sessions").submit(function(e) {
        e.preventDefault();
        $("#btnsubmit_CAS").attr("disabled", true);
        $.ajax({
            url: "/api/close_all_sessions",
            type: "POST",
            data: JSON.stringify({"password": document.getElementById("close_all_sessions_password").value
                                }),
            contentType: "application/json",
            dataType: "json",
            success: function(data){
                $("#btnsubmit_CAS").html(data["description"]);
                $("#f_close_all_sessions").trigger('reset');
                setTimeout(
                    function() {
                        $("#btnsubmit_CAS").html("Завершить");
                        $("#btnsubmit_CAS").attr("disabled", false);
                    }, 2000
                )
            },
            error: function(data){
                $("#btnsubmit_CAS").html(data.responseJSON['error']);
                $("#btnsubmit_CAS").attr("disabled", false);
                setTimeout(
                        function() {
                            $("#btnsubmit_CAS").html("Завершить");
                        }, 3500
                    )
            }
        });
    });
});