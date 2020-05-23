document.addEventListener('DOMContentLoaded', () => {

    var button = document.getElementById('leave_event_confirm_button')

    var modal = document.getElementById('leave_event_modal')

    button.addEventListener('click', () => {

        button.disable = true

        var eventId = modal.dataset.eventId

        fetch(
            `api/event/${eventId}/leave`,
            {
                method: 'POST',
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
                    body => {
                        button.textContent = body['description']
                        setTimeout(
                            () => {
                                button.textContent = 'Отправить'
                                button.disabled = false
                                $(modal).modal('hide')
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
    })
})