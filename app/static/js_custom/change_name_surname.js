document.addEventListener('DOMContentLoaded', e => {

    var button = document.getElementById('btnsubmit_name_surname')
    var form = document.getElementById('personal_info_form')

    form.addEventListener('submit', event => {

        event.preventDefault()

        button.disabled = true

        var data = {
            name: document.getElementById('profile_user_name').value,
            surname: document.getElementById('profile_user_surname').value
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
                if (response.status < 200 || response.status >= 300) {
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
                    console.log(response)
                    return
                }
                response.json().then(
                    body => {
                        button.textContent = body['description']
                        let displayElement = document
                                                .getElementById('name_surname')
                        displayElement
                            .textContent = `${data['name']} ${data['surname']}`
                        setTimeout(
                            () => {
                                button.textContent = 'Сохранить'
                                button.disabled = false
                                $('#personal_info_modal').modal('hide')
                            },
                            750
                        )
                    }
                )
            }
        ).catch(
            e => console.log(e)
        )

    })
})