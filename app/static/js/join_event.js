document.addEventListener('DOMContentLoaded', () => {
    var button = document.getElementById('btn_join_event')
    var event_id = button.dataset.id
    var checkbox = document.getElementById('register_as_speaker_checkbox')

    button.addEventListener(
        'click',
        () => {
            var data = {}
            if (checkbox.checked = true) {
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
                    console.log(response) // TODO: Error handling
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
                    response.json().then(
                        data => {
                            window.location.href = `/event/${event_id}` // перенаправление на страницу
                        }
                    )
                }
            ).catch(
                e => console.log(e) // TODO: Error handling
            )
        }
    )
})