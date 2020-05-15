document.addEventListener('DOMContentLoaded', () => {

    var form = document.getElementById('change_phone_form')

    var button = document.getElementById('change_phone_button')
    
    form.addEventListener('submit', event => {
        
        event.preventDefault()

        button.disable = true

        var data = {
            phone: document.getElementById('profile_user_phone').value
        }

        fetch(
            'api/user',
            {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(
            response => {
                if (response.status < 200 || response.status >= 300) {
                    console.log(response)
                    response.json().then(
                        body => {
                            button.textContent = body['error']
                            setTimeout(
                                () => {
                                    button.textContent = 'Сохранить'
                                    button.disabled = false
                                },
                                750
                            )
                        }
                    )
                    return
                }
                response.json().then(
                    body => {
                        button.textContent = body['description']
                        let displayElement = document
                                                .getElementById('p_phone')
                        displayElement
                            .textContent = data['phone']
                        setTimeout(
                            () => {
                                button.textContent = 'Сохранить'
                                button.disabled = false
                                $('#personal_phone_modal').modal('hide')
                            },
                            750
                        )
                    }
                )
            }
        ).catch(
            error => console.log(error)
        )
    })

    // $("#f_personal_phone").submit(function(e) {
    //     e.preventDefault();
    //     $("#btnsubmit_user_phone").attr("disabled", true);
    //     var phone = document.getElementById("profile_user_phone").value;
    //     $.ajax({
    //         url: "/api/user/",
    //         type: "PUT",
    //         data: JSON.stringify({"phone": phone
    //                             }),
    //         contentType: "application/json",
    //         dataType: "json",
    //         success: function(data){
    //             $("#btnsubmit_user_phone").html(data["description"]);
    //             $("#p_phone").html(phone);
    //             setTimeout(
    //                 function() {
    //                     $('#personal_phone_modal').modal('hide');
    //                     $("#btnsubmit_user_phone").html("Сохранить");
    //                     $("#btnsubmit_user_phone").attr("disabled", false);
    //                 }, 1000
    //             )
    //         },
    //         error: function(data){
    //             $("#btnsubmit_user_phone").html(data.responseJSON['error']);
    //             $("#btnsubmit_user_phone").attr("disabled", false);
    //             setTimeout(
    //                 function() {
    //                     $("#btnsubmit_user_phone").html("Сохранить");
    //                 }, 3500
    //             )
    //         }
    //     }); 
    // });
})