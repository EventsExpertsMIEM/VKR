document.addEventListener(
    'DOMContentLoaded',
    () => {
    $("#f_delete_account").submit(function(e) {
        e.preventDefault();
        $("#btnsubmit_delete_account").attr("disabled", true);
        $.ajax({
            url: "/api/delete",
            type: "POST",
            data: JSON.stringify({"password": document.getElementById("delete_account_password").value
                                }),
            contentType: "application/json",
            dataType: "json",
            success: function(data){
                $("#btnsubmit_delete_account").html(data["description"]);
                $("#f_delete_account").trigger('reset');
                setTimeout(
                    function() {
                        window.location = '/';
                    }, 1000
                )
            },
            error: function(data){
                $("#btnsubmit_delete_account").html(data.responseJSON['error']);
                $("#btnsubmit_delete_account").attr("disabled", false);
                setTimeout(
                        function() {
                            $("#btnsubmit_delete_account").html("Удалить");
                        }, 3500
                    )
            }
        });
    });
});