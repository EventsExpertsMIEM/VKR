document.addEventListener('DOMContentLoaded', () => {
    var button = document.getElementById('btn_join_event')
    var event_id = button.dataset.id
    var checkbox = document.getElementById('register_as_speaker_checkbox')

    button.addEventListener(
        'click',
        () => {
            var data = {}
            if (checkbox.checked == true) {
                data = {
                    role: 'presenter'
                }
            }

            else {
                    data = {
                        role: 'viewer'
                    }
                
            }
            fetch(`/api/event/${event_id}/join`,
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
                            button.textContent = 'Отправить'
                            $(document.getElementById('join_event_modal'))
                                .modal('hide')
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
                            button.textContent = 'Отправить'
                        },
                        750
                    )
                }
            )
        }
    )
})