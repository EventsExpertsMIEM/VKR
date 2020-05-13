var button = document.getElementById('btn_CAS')

button.addEventListener(
    'click',
    () => {
        button.disabled = true
        var data = {
            password: document.getElementById("close_all_sessions_password").value,
        }
        fetch("/api/close_all_sessions",
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
                                    button.textContent = 'Завершить'
                                    //$('#close_all_sessions_modal').modal('hide');
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
                                    button.textContent = 'Завершить'
                                    //$('#close_all_sessions_modal').modal('hide');
                                },
                                2000
                            )
                        }
                )
                close_all_sessions_password.value = ""
            }
        ).catch(
            e => console.log(e)
        )
    }
)