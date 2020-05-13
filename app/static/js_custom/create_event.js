document.getElementById('btnsubmit_create_event').addEventListener(
    'click',
    () => {
        var data = {
            name: document.getElementById("create_event_name").value,
            start_date: document.getElementById("create_event_start_date").value,
            end_date: document.getElementById("create_event_end_date").value,
            start_time: document.getElementById("create_event_start_time").value,
            location: document.getElementById("create_event_location").value,
            site_link: document.getElementById("create_event_site_link").value,
            sm_description: document.getElementById("create_event_description").value,
            description: document.getElementById("create_event_sm_description").value,
            additional_info: document.getElementById("create_event_additional_info").value
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
                if (response.status < 200 && response.status >= 300) {
                    console.log(response) // TODO: Error handling
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