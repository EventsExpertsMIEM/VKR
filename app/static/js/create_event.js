function init() {
    create_event_start_date.min = new Date().toISOString().split("T")[0];
    create_event_end_date.min = new Date().toISOString().split("T")[0];
}

document.addEventListener(
    'DOMContentLoaded',
    init
)

var button = document.getElementById('btnsubmit_create_event')

document.getElementById('tags_select').addEventListener(
    'change',
    event => {
    
        var tagDisplay = name => {
            var badge = document.createElement('a')
            badge.textContent = name
            badge.href = '#'
            badge.classList.add('badge')
            badge.classList.add('badge-primary')
            return badge
        }

        var select = event.target

        var value = select.value
        var display = document.getElementById('tags_display')

        display.appendChild(tagDisplay(value))
        display.appendChild(document.createTextNode (' '));


        button.dataset.tags =
            button.dataset.tags ? button.dataset.tags + ` ${value}` : value

        var option = select.querySelector(`option[value=${value}]`)
        select.removeChild(option)

        if (select.options.length == 1) select.style.display = 'none'
    }
)

button.addEventListener(
    'click',
    event => {

        var data = {
            name: document.getElementById("create_event_name").value,
            start_date: document.getElementById("create_event_start_date").value,
            end_date: document.getElementById("create_event_end_date").value,
            start_time: document.getElementById("create_event_start_time").value,
            location: document.getElementById("create_event_location").value,
            site_link: document.getElementById("create_event_site_link").value,
            sm_description: document.getElementById("create_event_sm_description").value,
            description: document.getElementById("create_event_description").value,
            additional_info: document.getElementById("create_event_additional_info").value,
            tags: event.target.dataset.tags.split(' ')
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
)