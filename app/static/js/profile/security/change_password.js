document.addEventListener('DOMContentLoaded',
() => {
    var button = document.getElementById('btn_change_password')

    button.addEventListener(
        'click',
        () => {
            button.disabled = true
            var data = {
                old_password: document.getElementById("profile_old_password").value,
                new_password: document.getElementById("profile_new_password").value
            }
            fetch("/api/change_password",
                {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    redirect: 'follow',
                }
            ).then(
                response => {
                    console.log(response)
                    if (response.status < 200 || response.status >= 300) {
                        response.json().then(
                            data => {
                                button.textContent = data['error']
                                setTimeout(
                                    () => {
                                        button.disabled = false
                                        button.textContent = 'Сохранить новый пароль'
                                    },
                                    2000
                                )
                            }
                        )
                        return
                    }
                    response.json().then(
                        data => {
                                button.textContent = data['description']
                                setTimeout(
                                    () => {
                                        button.disabled = false
                                        button.textContent = 'Сохранить новый пароль'
                                    },
                                    2000
                                )
                            }
                    )
                    profile_old_password.value = ""
                    profile_new_password.value = ""
                    profile_new_password_repeat.value = ""
                }
            ).catch(
                e => console.log(e)
            )
        }
    )
})