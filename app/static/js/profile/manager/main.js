document.addEventListener('DOMContentLoaded', () => {

    Array.from(
        document.getElementsByClassName('manage-event-manager-button')
    ).forEach(
        button => button.addEventListener(
            'click',
            event => {
                var eventId = event.target.dataset.eventId

                fetch(`/api/event/${eventId}/participants`).then(
                    response => {
                        if (response.status != 200) {
                            return response.json().then(
                                json_data => Promise.reject(
                                    {
                                        message: json_data.error,                                        code: response.status
                                    }
                                )
                            )
                        }

                        return response.json()
                    }
                ).then(
                    body => {
                        console.log(body)
                    }
                ).catch(
                    error => console.log(error)
                )

            }
        )
    )

})