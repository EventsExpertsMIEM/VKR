document.addEventListener('DOMContentLoaded', () => {
    
    var form = document.getElementById('registration_form')
    var button = document.getElementById('registration_form_submit_button')

    form.addEventListener('input', () => {

        var passwordInput = document.getElementById('register_user_password')
        var passwordInputConfirmation =
            document
                .getElementById('register_user_password_confirmation')
        
        if (passwordInput.value != passwordInputConfirmation.value) {
            passwordInputConfirmation.setCustomValidity('Пароли не совпадают')
        } else {
            passwordInputConfirmation.setCustomValidity('')
        }
        

    })

    form.addEventListener('submit', event => {

        event.preventDefault()

        button.disabled = true;

        fetch(
            '/api/register',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        email:
                            document
                                .getElementById('register_user_email')
                                    .value,
                        password:
                            document
                                .getElementById('register_user_password')
                                    .value,
                        name:
                            document
                                .getElementById('register_user_name')
                                    .value,
                        surname: 
                            document
                                .getElementById('register_user_surname')
                                    .value
                    }
                )
            }
        ).catch(
            error => console.log(error)
        ).then(
            response => {
                if (response.status < 200 || response.status >= 300) {
                    response.json().then(
                        body => {
                            button.textContent = body['error']
                            setTimeout(
                                () => {
                                    button.disabled = false
                                    button.textContent = 'Отправить'
                                },
                                750
                            )
                        }
                    )
                    return Promise.reject('Request finished with error')
                }
                return response.json()
            }
        ).then(
            body => {
                button.textContent = body['description']
                setTimeout(
                    () => {
                        button.disabled = false
                        button.textContent = 'Отправить'
                        window.location = '/'
                    },
                    750
                )
            }
        ).catch(
            error => console.log(error)
        )

    })
})