$(function() {
    $(document).ready(function(){
        setTimeout(function(){
            var url = $(location).attr("href");
            var slash = url.lastIndexOf("/");
            var res = url.substr(slash);
            $.ajax({
                url: "/api/confirm" + res,
                type: "GET",
                success: function(data){
                    $('#message').html(data["description"]);
                    setTimeout(
                        function() {
                        window.location = '/login';
                        }, 1000
                    )
                },
                error: function(data){
                    $('#message').html(data.responseJSON['error']);
                }
            });
        },250);
    });
});