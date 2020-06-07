document.addEventListener('DOMContentLoaded', () => {
    var button = document.getElementById('new_edu_btn')

    button.addEventListener(
        'click',
        () => {

            button.disabled = true

            fetch(`/api/edu`,
                {
                    method: "POST",
                    body: JSON.stringify(
                        {
                            country:
                            document
                                .getElementById('edu_country')
                                    .value,
                            city:
                            document
                                .getElementById('edu_city')
                                    .value,
                            university:
                            document
                                .getElementById('edu_university')
                                    .value,
                            department:
                            document
                                .getElementById('edu_department')
                                    .value,
                            program:
                            document
                                .getElementById('edu_program')
                                    .value,
                            mode:
                            document
                                .getElementById('edu_mode_choice')
                                    .value,
                            status:
                            document
                                .getElementById('edu_status_choice')
                                    .value,
                            graduation_year:
                            parseInt(document
                                .getElementById('edu_gr_year')
                                    .value, 10)
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
                            button.disabled = false
                            button.textContent = 'Сохранить'
                            $(document.getElementById('new_edu_modal'))
                                    .modal('hide')
                            document.location.reload(true)
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
                            button.textContent = 'Сохранить'
                        },
                        750
                    )
                }
            )
        }
    )
})