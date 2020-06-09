import { tagsSelection, tagBadge, removeTag } from '../../tags.js'
export {loadEventInfo, editEventInfo}

var eventID

var _tagsSelectionListener = (event) => {
    var tagsSelect = document.getElementById('tagsSelect')
    var tagsDisplay = document.getElementById('tagsDisplay')
    var form = document.getElementById('editEventInfoForm')
    tagsSelection(tagsSelect, tagsDisplay, form)
}

function setData(data) {

    var event = data.event

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

    tagsSelect.removEventListener('change', _tagsSelectionListener)

    tagsSelect.addEventListener(
        'change',
        _tagsSelectionListener
    )

    form.dataset.tags = JSON.stringify(event.tags)
    for(var tag of event.tags) {
        var badge = tagBadge(tag)
        badge.addEventListener(
            'click',
            event => {
                removeTag(event.target.dataset.tag, tagsSelect, tagsDisplay, form)
            }
        )
        tagsDisplay.appendChild(badge)
        tagsDisplay.appendChild(document.createTextNode (' '));
        tagsSelect.querySelector(`option[value="${tag}"`).style.display = 'none'
    }
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

    console.log(event)

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

    if (event.target.dataset.tags != undefined) {
        data.tags = JSON.parse(event.target.dataset.tags)
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