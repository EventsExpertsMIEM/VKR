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
                if (response.status < 200 || response.status >= 300) {
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
                    element.dataset['old'] = element.value
                    let displayElement = document.getElementById(
                        element.dataset['profileKey']
                    )
                    if (element.value == "") {
                        displayElement.textContent = "Не задано"
                        element.placeholder = "Не задано"
                    } else {
                        displayElement.textContent = element.value
                    }
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