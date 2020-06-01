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
})