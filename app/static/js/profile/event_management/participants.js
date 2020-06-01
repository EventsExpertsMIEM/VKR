export { renderParticipants }

function getParticipantsInfo(data, count) {

    var getCell = text => {
        var cell = document.createElement('td')
        cell.textContent = text
        return cell
    }

    var row = document.createElement('tr')

    var countCell = document.createElement('th')
    countCell.textContent = count
    countCell.scope = 'row'

    var cells = [
        countCell,
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


function addParticipantsData(data) {

    var tableBody =
        document
            .getElementById('management_participation_table')
                .getElementsByTagName('tbody')[0]

    tableBody.innerHTML = ''

    for(let i in data) {
        tableBody.appendChild(getParticipantsInfo(data[i], Number(i) + 1))
    }

}

async function getParticipants (eventId) {

    return fetch(`/api/event/${eventId}/participants`).then(
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
        body => body.participants
    ).catch(
        error => console.log(error)
    )
}

async function renderParticipants(eventId) {
    addParticipantsData(await getParticipants(eventId))
}