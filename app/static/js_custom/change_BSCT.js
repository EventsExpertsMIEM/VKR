

document.addEventListener(
    'DOMContentLoaded',
    () => {
        var birthdayInput = document.getElementById('profile_user_birth')
        birthdayInput.max = new Date().toISOString().split('T')[0]
    }
)

document.getElementById('btnsubmit_BSCT').addEventListener(
    'click',
    () => {
        var button = document.getElementById('btnsubmit_BSCT')
        button.disabled = true

        var elements = document.getElementsByClassName("bcst_input")

        var data = {}

        for (let i = 0; i < elements.length; i++) {
            let element = elements[i]
            let old_value = element.dataset["old"]
            let new_value = element.value 
            let key = element.dataset["key"]
            if (old_value != new_value) {
                data[key] = new_value
            }
        }

        if (Object.keys(data).length === 0) {
            button.textContent = "Нечего изменять"
            setTimeout(
                () => {
                    button.disabled = false
                    button.textContent = "Сохранить"
                },
                750
            )
            return
        }

        fetch(
            '/api/user/',
            {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(
            response => {
                if (response.status < 200 && response.status >= 300) {
                    console.log(response)
                    response.json().then(
                        data => {
                            button.textContent = data['error']
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
                for(let i = 0; i < elements.length; i++) {
                    let element = elements[i]
                    if (element.value == "") element.value = "Не задано" 
                    document.getElementById(
                        element.dataset['profileKey']
                    ).textContent = element.value
                    element.dataset['old'] = element.value
                }
                response.json().then(
                    data => {
                        button.textContent = data['description']
                        setTimeout(
                            () => {
                                button.textContent = 'Сохранить'
                                button.disabled = false
                                $('#personal_BSCT_modal').modal('hide')
                            },
                            750
                        )
                    }
                )
            }
        )
    }
)

//                 url: "/api/user/",
//                 type: "PUT",
//                 data: JSON.stringify(dict),
//                 contentType: "application/json",
//                 dataType: "json",
//                 success: function(data){
//                     $("#btnsubmit_BSCT").html(data["description"]);
//                     if (birth != birth_old) {
//                         if (birth == "") {
//                             $("#p_birth").html("None");
//                         } else {
//                             $("#p_birth").html(birth);
//                         }
//                         $("#profile_user_birth").attr('value', birth);
//                         $("#profile_user_birth").attr('birth_old', birth);
//                     }
//                     if (sex != sex_old) {
//                         if (sex == "") {
//                             $("#p_sex").html("None");
//                         } else {
//                             $("#p_sex").html(sex);
//                         }
//                         $("#profile_user_sex").attr('value', sex);
//                         $("#profile_user_sex").attr('sex_old', sex);
//                     }
//                     if (country != country_old) {
//                         if (country == "") {
//                             $("#p_country").html("None");
//                         } else {
//                             $("#p_country").html(country);
//                         }
//                         $("#profile_user_country").attr('value', country);
//                         $("#profile_user_country").attr('country_old', country);
//                     }
//                     if (town != town_old) {
//                         if (town == "") {
//                             $("#p_town").html("None");
//                         } else {
//                             $("#p_town").html(town);
//                         }
//                         $("#profile_user_town").attr('value', town);
//                         $("#profile_user_town").attr('town_old', town);
//                     }
//                     setTimeout(
//                         function() {
//                             $('#personal_BSCT_modal').modal('hide');
//                             $("#btnsubmit_BSCT").html("Сохранить");
//                             $("#btnsubmit_BSCT").attr("disabled", false);
//                         }, 1000
//                     )
//                 },
//                 error: function(data){
//                     $("#btnsubmit_BSCT").html(data.responseJSON['error']);
//                     $("#btnsubmit_BSCT").attr("disabled", false);
//                     setTimeout(
//                         function() {
//                             $("#btnsubmit_BSCT").html("Сохранить");
//                         }, 3500
//                     )
//                 }
//             });
//         }
//     });
// });