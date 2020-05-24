document.addEventListener('DOMContentLoaded', () => {

    var button = document.getElementById('password_recovery_button')

    button.addEventListener(
        'click',
        () => {
            fetch('/api/reset_password',
                {
                    method: "POST",
                    body: JSON.stringify(
                    	{
						  email: document
	                                .getElementById('password_recovery_user_email')
	                                    .value,
						}
                    ),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    redirect: 'follow',
                }
            ).then(
                response => {
                    if (response.status < 200 || response.status >= 300) {
                        return response.json().then(
                            data => Promise.reject(
                                {
                                    code: response.status,
                                    message: data['error']
                                }
                            )
                        )
                    }
                    return response.json()
                }
            ).then(
                data => {
                    button.textContent = data['description']
                    setTimeout(
                        () => {
                            window.location = '/reset_password/success'
                        },
                        750
                    )
                }
            ).catch(
                error => {
                    button.textContent = error.message
                    setTimeout(
                        () => {
                            button.disabled = false
                            button.textContent = 'Восстановить пароль'
                        },
                        750
                    )
                }
            )
        }
    )


})