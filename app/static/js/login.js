document.addEventListener('DOMContentLoaded', () => {

    var form = document.getElementById('login_form')
    var button = document.getElementById('login_submit_button')

    form.addEventListener('submit', event => {

        event.preventDefault()

        var responsePromise = fetch(
            '/api/login',
            {
                method: 'POST',
                body: JSON.stringify(
                    {
                        email: document.getElementById('login_user_email').value,
                        password: document.getElementById('login_user_password').value
                    }
                ),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )

        responsePromise = responsePromise.then(
            response => {
                if (response.status < 200 || response.status >= 300) {
                    button.disabled = true
                    response.json().then(
                        data => {
                            button.textContent = data['error']
                            setTimeout(
                                () => {
                                    button.disabled = false
                                    button.textContent = 'Отправить'
                                },
                                750
                            )
                        }
                    )
                    return
                }
                return response.json()
            }
        )
        responsePromise.catch(
            error => console.log(error)
        )

        responsePromise.then(
            data => {
                const urlParams = new URLSearchParams(window.location.search);
                const location = urlParams.get('next');
                window.location = location
            }
        )

    })

})