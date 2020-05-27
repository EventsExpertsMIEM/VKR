import deleteEvent from './delete_event.js'

document.addEventListener('DOMContentLoaded', () => {

    var elements = Array.from(document.getElementsByClassName('nav-link'))
    
    elements.forEach(
        el => {
            $(el).on(
                'shown.bs.tab',
                e => {
                    window.location.hash = e.currentTarget.dataset.anchor
                }
            )
        }
    )

    var leaveEventButtons = Array.from(
        document.getElementsByClassName('leave-event-button')
    )

    leaveEventButtons.forEach(
        button => button.addEventListener('click', 
            event => {
                var modal = document.getElementById('leave_event_modal')
                modal.dataset.eventId = event.currentTarget.dataset.id
            }
        )
    )

    var deleteEventButtons =
        document.getElementsByClassName('delete-event-button')

    var deleteEventButton = document.getElementById('deletEventModalButton')

    Array.from(deleteEventButtons).forEach(
        button => button.addEventListener(
            'click',
            event => {
                var eventId = event.target.dataset.eventId
                deleteEventButton.dataset.eventId = eventId
            }
        )
    )

    deleteEventButton.addEventListener(
        'click',
        event => {
            deleteEvent(event.target.dataset.eventId)
        }
    )

    var uploadReportButtons = Array.from(
        document.getElementsByClassName('upload-report-button')
    )

    uploadReportButtons.forEach(
        button => button.addEventListener('click', 
            event => { // TODO: REST API info
                var target = event.currentTarget
                var modal = document.getElementById('upload_report_modal')
                modal.dataset.reportId = target.dataset.reportId
                modal.dataset.eventId = target.dataset.id
                var uploadedFile = document.getElementById('uploaded_file')
                var reportDescriptionElement =
                    document.getElementById('report_description')
                var presenterDescriptionElement =
                    document.getElementById('speaker_description')
                var fileInput = document.getElementById('upload_report_file')
                fileInput.value = ''
                if (target.dataset.reportId != "") {
                    Array.from(
                        document.getElementsByClassName('report-info')
                    ).forEach(
                        el => el.style.display = ''
                    )
                    fileInput.style.display = 'none'
                    var text = target.dataset.presenterDescription
                    presenterDescriptionElement.value =
                        text != 'None' ? text : ''
                    text = target.dataset.reportDescription
                    reportDescriptionElement.value =
                        text != 'None' ? text : ''
                    var fileName = target.dataset.reportFilename
                    var reportStatus = target.dataset.reportStatus
                    uploadedFile.textContent =
`Uploaded file ${fileName}
Status: ${reportStatus}`
                } else {
                    fileInput.style.display = ''
                    uploadedFile.textContent = ''
                    presenterDescriptionElement.value = ''
                    reportDescriptionElement.value = ''
                    Array.from(
                        document.getElementsByClassName('report-info')
                    ).forEach(
                        el => el.style.display = 'none'
                    )
                }
            }
        )
    )

    const tabsAnchors = new Map(
        [
            ['info', 'nav-personal-tab'],
            ['education', 'nav-education-tab'],
            ['security', 'nav-security-tab'],
            ['participation', 'na-events-part-tab'],
            ['presentations', 'na-events-lect-tab'],
            ['organisation', 'na-events-org-tab']
        ]
    )

    var hash = window.location.hash.slice(1)

    if (hash == '') return

    var tabId = tabsAnchors.get(hash)

    var tab = $(document.getElementById(tabId))

    tab.tab('show')
})