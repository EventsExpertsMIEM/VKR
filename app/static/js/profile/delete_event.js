export default function deleteEvent(eventId) {
    
    fetch(
        `api/event/${eventId}`,
        {
            method: 'DELETE'
        }
    ).then(
        response => {
            if (response.status != 200) {
                return response.json().then(
                    body => Promise.reject(
                        {
                            code: response.status,
                            message: body.error
                        }
                    )
                )
            }
            return response.json()
        }
    ).then(
        body => {
            document.getElementById(`eventCreatorRow${eventId}`).remove()
            var modal = document.getElementById('deleteEventModal')
            $(modal).modal('hide')
        }
    ).catch(
        error => console.log(error)
    )

}