import { tagsSelection } from './tags.js'

function createEvent(event) {

    var data = {
        name: document.getElementById("create_event_name").value,
        start_date: document.getElementById("create_event_start_date").value,
        end_date: document.getElementById("create_event_end_date").value,
        start_time: document.getElementById("create_event_start_time").value,
        location: document.getElementById("create_event_location").value,
        site_link: document.getElementById("create_event_site_link").value,
        sm_description: document.getElementById("create_event_sm_description").value,
        description: document.getElementById("create_event_description").value,
        additional_info: document.getElementById("create_event_additional_info").value
    }

    if (event.target.dataset.tags != undefined) {
        data.tags = JSON.parse(event.target.dataset.tags)
    }

    fetch("/api/event",
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
                    var id = data['description'] // id созданного мероприятия
                    window.location.href = `/event/${id}` // перенаправление на страницу
                }
            )
        }
    ).catch(
        e => console.log(e) // TODO: Error handling
    )
}

function init() {

    create_event_start_date.min = new Date().toISOString().split("T")[0];
    create_event_end_date.min = new Date().toISOString().split("T")[0];


    var button = document.getElementById('btnsubmit_create_event')

    var tagsSelect = document.getElementById('tags_select')
    var tagsDisplay = document.getElementById('tags_display')

    tagsSelect.addEventListener(
        'change',
        event => tagsSelection(event.target, tagsDisplay, button)
    )

    button.addEventListener(
        'click',
        createEvent
    )
}

document.addEventListener(
    'DOMContentLoaded',
    init
)