export { getParticipantsInfo, addParticipantsData, showTab}

function getParticipantsInfo(data, count) {

    var getCell = text => {
        var cell = document.createElement('td')
        cell.textContent = text
        return cell
    }

    var row = document.createElement('tr')

    var countCell = getCell(count)
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