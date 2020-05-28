export {
    uploadReport,
    updateReportTableInfo,
    updateReportInfoModal,
    updateReportInfo
}

function uploadReport(event) {

    const MAX_FILE_SIZE = 32 * 1024 * 1024
    
    const fileInput = event.target

    const file = fileInput.files[0]
    const eventId = fileInput.dataset.eventId

    if (file === undefined) return

    if (file.size > MAX_FILE_SIZE) return

    const formData = new FormData()

    formData.append('file', file)

    fileInput.value = null

    fetch(
        `/api/event/${eventId}/report`,
        {
            method: 'POST',
            body: formData
        }
    ).then(
        response => {
            if (response.status != 200) {
                return response.json().then(
                    json_body => Promise.reject(
                        {
                            code: response.status,
                            message: json_body.error
                        }
                    )
                )
            }
            return response.json()
        }
    ).then(
        json_body => {
            var modal = document.getElementById('uploadReportModal')

            var reportDescriptions =
                modal.querySelectorAll('.upload-report-info')
            Array.from(reportDescriptions).forEach(
                el => el.style.display = ''
            )
            fileInput.style.display = 'none'
            var uploadReportButton =
                document.getElementById(`event${eventId}UploadReportButton`)
            uploadReportButton.dataset.reportId = json_body.description
            uploadReportButton.dataset.reportStatus = 'unseen'
            uploadReportButton
                .dataset
                    .reportFilename = formData.get('file').name
            var manualEvent = new Event('change')
            uploadReportButton.dispatchEvent(manualEvent)
            var updateReportInfoButton = 
                document.getElementById('uploadReportUpdateInfoButton')
            updateReportInfoButton.dataset.reportId = json_body.description
        }
    ).catch(
        error => console.log(error)
    )
}

function updateReportInfo(event) {

    var reportId = event.target.dataset.reportId
    var eventId = event.target.dataset.eventId

    var data =  {
        name:
            document
                .getElementById('uploadReportModalName')
                    .value,
        report_description:
            document
                .getElementById('uploadReportModalReportDescription')
                    .value,
        presenter_description:
            document
                .getElementById('uploadReportPresenterDescription')
                    .value
    }

    fetch(
        `/api/event/report/${reportId}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
    ).then(
        response => {
            event.target.textContent = 'Информация сохранена'
            var uploadReportButton =
                document.getElementById(`event${eventId}UploadReportButton`)
            uploadReportButton.dataset.reportName = data.name
            uploadReportButton.dataset.reportDescription = data.report_description
            uploadReportButton.dataset.presenterDescription = data.presenter_description
            setTimeout(
                () => event.target.textContent = 'Сохранить',
                750
            )
        }
    ).catch(
        error => console.log(error)
    )
}

function updateReportTableInfo(event) {

    const statuses  = {
        unseen: 'На модерации',
        approved: 'Принят',
        declined: 'Отклонен'
    }

    const data = event.target.dataset

    const reportNameDisplay =
        document.getElementById(`event${data.eventId}ReportFileName`)
    const reportStatusDisplay =
        document.getElementById(`event${data.eventId}ReportStatus`)

    reportNameDisplay.textContent = data.reportFilename
    reportStatusDisplay.textContent = statuses[data.reportStatus]

}

function updateReportInfoModal(event) {

    var modal = document.getElementById('uploadReportModal')
    var data = event.target.dataset

    var nameDisplay = modal.querySelector('#uploadReportModalName')
    var reportDescriptionDisplay = 
        modal.querySelector('#uploadReportModalReportDescription')
    var presenterDescriptionDisplay =
        modal.querySelector('#uploadReportPresenterDescription')

    if (data.reportId === '') {
        modal.querySelector('#uploadReportModalFileInput').style.display = ''
        Array.from(modal.querySelectorAll('.upload-report-info')).forEach(
            el => {
                el.style.display = 'none'
            }
        )
        nameDisplay.value = ''
        reportDescriptionDisplay.value = ''
        presenterDescriptionDisplay.value = ''
        return 
    }

    modal
        .querySelector('#uploadReportModalFileInput')
            .style
                .display = 'none'

    Array.from(modal.querySelectorAll('.upload-report-info')).forEach(
        el => el.style.display = ''
    )

    nameDisplay.value = data.reportName
    reportDescriptionDisplay.value = data.reportDescription
    presenterDescriptionDisplay.value = data.presenterDescription

}

//         var button = document.getElementById('save_report_info_button')

//         var modal = document.getElementById('uploadReportModal')
    
//         var uploadedFile = document.getElementById('uploaded_file')

//         fetch(
//             `/api/event/${eventId}/report`,
//             {
//                 method: 'POST',
//                 body: formData
//             }
//         ).then(
//             response => {
//                 if (response.status < 200 || response.status >= 300) {
//                     return response.json().then(
//                         data => Promise.reject(
//                             {
//                                 code: response.status,
//                                 message: data['error']
//                             }
//                         )
//                     )
//                 }
//                 return response.json()
//             }
//         ).then(
//             body => {

//                 var reportButton =
//                     document
//                         .getElementById(`event_report_button_${eventId}`)
//                 // data-report-id="{{ event.report.id }}"
//                 // data-report-status="{{ event.report.report_status }}"
//                 // data-report-filename="{{ event.report.filename }}"
//                 // data-presenter-description="{{ event.report.presenter_description }}"
//                 // data-report-description="{{ event.report.report_description }}"

//                 var reportId = body['description']

//                 reportButton.dataset.reportId = reportId
//                 reportButton.dataset.reportStatus = 'unseen'
//                 reportButton.dataset.reportFilename = file.name
//                 reportButton.dataset.presenterDescription=""
//                 reportButton.dataset.reportDescription=""

//                 modal.dataset.reportId = reportId
//                 fileInput.style.display = 'none'
//                 uploadedFile.textContent =
// `Uploaded file ${file.name}
// Status: unseen`
//                 Array.from(
//                     document.getElementsByClassName('report-info')
//                 ).forEach(
//                     el => el.style.display = ''
//                 )
//             }
//         ).catch(
//             error => {
//                 uploadedFile.textContent = error.message
//                 setTimeout(
//                     () => {
//                         uploadedFile.textContent = ''
//                     },
//                     750
//                 )
//             }
//         )

//     })

//     window.fileInputEventListenerDefined = true

//     button.addEventListener('click', () => {
//         const reportId = modal.dataset.reportId
//         const eventId = modal.dataset.eventId


//         var data = {
//             report_description:
//                 document
//                     .getElementById('report_description')
//                         .value,
//             presenter_description:
//                 document
//                     .getElementById('speaker_description')
//                         .value
//         }

//         fetch(
//             `/api/event/report/${reportId}`,
//             {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(data)
//             }
//         ).then(
//             response => {
//                 if (response.status < 200 || response.status >= 300) {
//                     button.disabled = true
//                     return response.json().then(
//                         data => Promise.reject(
//                             {
//                                 code: response.status,
//                                 message: data['error']
//                             }
//                         )
//                     )
//                 }
//                 return response.json()
//             }
//         ).then(
//             body => {
//                 button.textContent = body['description']
//                 var reportButton =
//                 document
//                     .getElementById(`event_report_button_${eventId}`)
                
//                 reportButton
//                     .dataset
//                         .presenterDescription = data['presenter_description']
//                 reportButton
//                     .dataset
//                         .reportDescription = data['report_description']
//                 setTimeout(
//                     () => {
//                         button.disabled = false
//                         button.textContent = 'Сохранить'
//                         $('#uploadReportModal').modal('hide')
//                     },
//                     750
//                 )
//             }
//         ).catch(
//             error => {
//                 button.textContent = error.message
//                 setTimeout(
//                     () => {
//                         button.disabled = false
//                         button.textContent = 'Сохранить'
//                     },
//                     750
//                 )
//             }
//         )
//     })
// }