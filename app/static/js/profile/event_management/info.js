
export {loadEventInfo, editEventInfo}

var eventID

function setData(data) {

    var event = data.event

    console.log(event)

    document.getElementById('editEventName').value = event.name
    document.getElementById('editEventStartDate').value = event.start_date
    document.getElementById('editEventEndDate').value = event.end_date
    document.getElementById('editEventLocation').value = event.location
    document.getElementById('editEventLink').value = event.site_link
    document.getElementById('editEventDescShort').value = event.sm_description
    document.getElementById('editEventDescFull').value = event.description
    document
        .getElementById('editEventAdditionalInfo')
            .value = 
                event.additional_info
    document.getElementById('editEventStartTime').value =
        event
            .start_time
                .split(':')
                    .slice(0,2)
                        .join(':')

}

function loadEventInfo(eventId) {

    eventID = eventId

    fetch(`/api/event/${eventId}`).then(
        response => {
            if (response.status != 200) {
                return Promise.reject('Something went wrong')
            }

            return response.json()
        }
    ).then(
        body => setData(body)
    ).catch(
        error => console.log(error)
    )
}

function editEventInfo(event) {

    event.preventDefault()

    var data = {
        name: document.getElementById('editEventName').value,
        start_date: document.getElementById('editEventStartDate').value,
        end_date: document.getElementById('editEventEndDate').value,
        location: document.getElementById('editEventLocation').value,
        site_link: document.getElementById('editEventLink').value,
        sm_description: document.getElementById('editEventDescShort').value,
        description: document.getElementById('editEventDescFull').value,
        additional_info: document.getElementById('editEventAdditionalInfo').value,
        start_time: document.getElementById('editEventStartTime').value
    }

    fetch(
        `/api/event/${eventID}`,
        {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    ).then(
        response => {
            if (response.status != 200) {
                return response.json().then(
                    json_data => Promise.reject(
                        {
                            message: json_data.error,
                            code: response.status
                        }
                    )
                )
            }

            return response.json()
        }
    ).then(
        body => {
            var button = document.getElementById('editEventButton')
            button.textContent = body['description']
            var tab = document.getElementById('nav-events-management-tab')
            tab.textContent = data['name']
            setTimeout(
                () => {
                    button.textContent = 'Сохранить'
                },
                750
            )
        }
    ).catch(
        error => console.log(error)
    )
}