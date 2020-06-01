document.addEventListener('DOMContentLoaded', () => {

    var button = document.getElementById('change_organisation_position_button')
    
    button.addEventListener('click', () => {

        button.disable = true

        var data = {
            organization: document.getElementById('profile_user_organisation').value,
            position: document.getElementById('profile_user_position').value
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

                        let organizationDisplayElement =
                            document.getElementById('p_organization')
                        let organizationValue = data['organization']
                        if (organizationValue == "") {
                            organizationDisplayElement.textContent = "Не задано"
                            document.getElementById('profile_user_organisation')
                                .placeholder = "Не задано"
                        } else {
                            organizationDisplayElement.textContent = 
                                organizationValue
                            document.getElementById('profile_user_organisation')
                                .placeholder = organizationValue
                        }


                        let positionDisplayElement =
                            document.getElementById('p_position')
                        let positionValue = data['position']
                        if (positionValue == "") {
                            positionDisplayElement.textContent = "Не задано"
                            document.getElementById('profile_user_position')
                                .placeholder = "Не задано"
                        } else {
                            positionDisplayElement.textContent = positionValue
                            document.getElementById('profile_user_position')
                                .placeholder = positionValue
                        }

                        setTimeout(
                            () => {
                                button.textContent = 'Сохранить'
                                button.disabled = false
                                $('#organisation_position_modal').modal('hide')
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