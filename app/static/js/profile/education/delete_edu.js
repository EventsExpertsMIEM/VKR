document.addEventListener('DOMContentLoaded', () => {

    var button = document.getElementById('btn_delete_education')

    var modal = document.getElementById('delete_education_modal')

    button.addEventListener('click', () => {

        button.disable = true

        var eduId = modal.dataset.eduId

        fetch(
            `api/event/${eduId}/leave`,
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
                                button.textContent = 'Удалить'
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
                        button.textContent = 'Удалить'
                    },
                    750
                )
            }
        )
    })
})