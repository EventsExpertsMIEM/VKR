document.addEventListener('DOMContentLoaded', () => {

    var button = document.getElementById('change_bio_button')
    
    button.addEventListener('click', () => {
        
        button.disable = true

        var data = {
            bio: document.getElementById('profile_user_bio').value
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
                                                .getElementById('p_bio')
                        let displayValue = data['bio']
                        if (displayValue == "") {
                            displayValue = "Не задано"
                        }
                        displayElement
                            .textContent = displayValue
                        document
                            .getElementById('profile_user_bio')
                                .placeholder = displayValue
                        setTimeout(
                            () => {
                                button.textContent = 'Сохранить'
                                button.disabled = false
                                $('#personal_bio_modal').modal('hide')
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
})

// $(function() {
//     $("#f_personal_bio").submit(function(e) {
//         e.preventDefault();
//         $("#btnsubmit_user_bio").attr("disabled", true);
//         var bio = document.getElementById("profile_user_bio").value;
//         $.ajax({
//             url: "/api/user/",
//             type: "PUT",
//             data: JSON.stringify({"bio": bio
//                                 }),
//             contentType: "application/json",
//             dataType: "json",
//             success: function(data){
//                 $("#btnsubmit_user_bio").html(data["description"]);
//                 $("#profile_user_bio").attr('value', bio);
//                 $("#p_bio").html(bio);
//                 setTimeout(
//                     function() {
//                         $('#personal_bio_modal').modal('hide');
//                         $("#btnsubmit_user_bio").html("Сохранить");
//                         $("#btnsubmit_user_bio").attr("disabled", false);
//                     }, 1000
//                 )
//             },
//             error: function(data){
//                 $("#btnsubmit_user_bio").html(data.responseJSON['error']);
//                 $("#btnsubmit_user_bio").attr("disabled", false);
//                 setTimeout(
//                     function() {
//                         $("#btnsubmit_user_bio").html("Сохранить");
//                     }, 3500
//                 )
//             }
//         }); 
//     });
// });