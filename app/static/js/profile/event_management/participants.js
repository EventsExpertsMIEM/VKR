function getParticipantInfo(data, count) {

    var getCell = text => {
        var cell = document.createElement('td')
        cell.textContent = text
        return cell
    }

    var row = document.createElement('tr')

    var cells = [
        getCell(count),
        getCell(data.email),
        getCell(`${data.name} ${data.surname}`),
        getCell(data.role),
        getCell(data.registration_date)
    ]

    for(let i of cells) {
        row.appendChild(i)
    }

    return row

}


function addData(data) {

    var tableBody =
        document
            .getElementById('management_participation_table')
                .getElementsByTagName('tbody')[0]

    tableBody.innerHTML = ''

    for(let i in data) {
        tableBody.appendChild(getParticipantInfo(data[i], Number(i) + 1))
    }

}


function showTab(eventId, eventName) {

    var managementNav =
        document.getElementById('nav-events-management-tab')
    managementNav.style.display = ''
    managementNav.textContent = eventName

    var managementTab =
        document.getElementById('events-management-tab')
    managementTab.dataset.eventId = eventId

    managementNav.click()
}


document.addEventListener('DOMContentLoaded', () => {
    var manageEventLinks = document.getElementsByClassName('manage_event_link')

    Array.from(manageEventLinks).forEach(
        link => link.addEventListener(
            'click',
            event => {

                var eventId = event.target.dataset.eventId

                fetch(`/api/event/${eventId}/participants`).then(
                    response => {
                        if (response.status != 200) {
                            return Promise.reject('Something went wrong')
                        }

                        return response.json()
                    }
                ).then(
                    body => {

                        addData(body.participants)

                        showTab(body.event.id, body.event.name)
                    }
                ).catch(
                    error => console.log(error)
                )

            }
        )
    )
})