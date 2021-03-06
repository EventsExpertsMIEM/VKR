export { renderReports }

function approveReport(event) {
    var reportId = event.target.dataset.reportId;

    fetch(`/api/event/report/${reportId}/approve`, { method: 'POST' }).then(
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
            var statusTr = 
                event
                    .target
                        .closest('tr')
                            .getElementsByClassName('report-status')[0]
            statusTr.textContent = 'Одобрен'
        }
    ).catch(
        error => console.log(error)
    )

}

function declineReport(event) {
    var reportId = event.target.dataset.reportId;

    fetch(`/api/event/report/${reportId}/decline`, { method: 'POST' }).then(
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
            var statusTr = 
                event
                    .target
                        .closest('tr')
                            .getElementsByClassName('report-status')[0]
            statusTr.textContent = 'Отклонен'
        }
    ).catch(
        error => console.log(error)
    )

}

var statuses = {
    unseen: 'На модерации',
    approved: 'Одобрен',
    declined: 'Отклонен'
}

function showReportInfo(data) {

    document.getElementById('reportInfoModalName').textContent = data['name']
    document.getElementById('reportInfoModalLabel').textContent = data['name']    
    document.getElementById('reportInfoModalDescription').textContent = data['report_description']
    document.getElementById('reportInfoModalSpeaker').textContent = data['presenter_description']
    document.getElementById('reportInfoModalStatus').textContent = statuses[data['status']]
    document.getElementById('reportInfoModalLink').href=`/api/event/report/${data.id}`

}

function getReportsInfo(data, count) {

    var getCell = text => {
        var cell = document.createElement('td')
        cell.textContent = text
        return cell
    }

    var row = document.createElement('tr')

    var countCell = document.createElement('th')
    countCell.textContent = count
    countCell.scope = 'row'

    var linkCell = getCell('')
    var link = document.createElement('a')
    // link.href=`/api/event/report/${data.id}`
    link.href = '#'
    link.dataset.toggle = 'modal'
    link.dataset.target = '#reportInfoModal'
    link.textContent = data.name
    link.addEventListener(
        'click',
        () => {
            showReportInfo(data)
        }
    )

    linkCell.appendChild(link)

    var statusCell = getCell(statuses[data.status])
    statusCell.classList.add('report-status')

    var confirmButton = document.createElement('button')
    confirmButton.type = 'submit'
    confirmButton.classList.add('btn')
    confirmButton.classList.add('btn-outline-secondary')
    confirmButton.textContent = 'Одобрить'
    confirmButton.dataset.reportId = data.id
    confirmButton.addEventListener('click', event => approveReport(event))

    var declineButton = document.createElement('button')
    declineButton.type = 'submit'
    declineButton.classList.add('btn')
    declineButton.classList.add('btn-outline-danger')
    declineButton.textContent = 'Отклонить'
    declineButton.dataset.reportId = data.id
    declineButton.addEventListener('click', event => declineReport(event))

    var div = document.createElement('div')
    div.classList.add('btn-group')
    div.setAttribute('role', 'group')
    div.appendChild(confirmButton)
    div.appendChild(declineButton)

    var controlCell = getCell('')
    controlCell.appendChild(div)

    var cells = [
        countCell,
        getCell(data.author.email),
        getCell(`${data.author.name} ${data.author.surname}`),
        linkCell,
        statusCell,
        controlCell
    ]

    for(let i of cells) {
        row.appendChild(i)
    }

    return row

}


function addReportsData(data) {

    var tableBody =
        document
            .getElementById('management_reports_table')
                .getElementsByTagName('tbody')[0]

    tableBody.innerHTML = ''

    for(let i in data) {
        tableBody.appendChild(getReportsInfo(data[i], Number(i) + 1))
    }

}

async function loadData(eventId) {

    return fetch(`/api/event/${eventId}/management/reports/all`).then(
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
        body => body
    ).catch(
        error => console.log(error)
    )

}

async function renderReports(eventId) {

    addReportsData(await loadData(eventId))

}