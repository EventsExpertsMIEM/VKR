document.addEventListener('DOMContentLoaded', () => {


    var fileInput = document.getElementById('upload_report_file')

    var button = document.getElementById('save_report_info_button')

    var modal = document.getElementById('upload_report_modal')

    var uploadedFile = document.getElementById('uploaded_file')

    fileInput.addEventListener('change', () => {

        const MAX_FILE_SIZE = 32 * 1024 * 1024

        const file = fileInput.files[0]

        if (file === undefined) return

        if (file.size > MAX_FILE_SIZE) return

        const formData = new FormData()

        formData.append('file', file)

        const eventId = modal.dataset.eventId

        fileInput.files.value = null

        fetch(
            `/api/event/${eventId}/report`,
            {
                method: 'POST',
                body: formData
            }
        ).then(
            response => {
                if (response.status < 200 || response.status >= 300) {
                    return response.json().then(
                        data => Promise.reject(
                            {
                                code: response.status,
                                message: data['error']
                            }
                        )
                    )
                }
                return response.json()
            }
        ).then(
            body => {
                modal.dataset.reportId = body['description']
                fileInput.style.display = 'none'
                uploadedFile.textContent =
`Uploaded file ${file.name}
Status: unseen`
                Array.from(
                    document.getElementsByClassName('report-info')
                ).forEach(
                    el => el.style.display = ''
                )
            }
        ).catch(
            error => {
                uploadedFile.textContent = error.message
                setTimeout(
                    () => {
                        uploadedFile.textContent = ''
                    },
                    750
                )
            }
        )

    })

    button.addEventListener('click', () => {
        var reportId = modal.dataset.reportId

        var data = {
            report_description:
                document
                    .getElementById('report_description')
                        .value,
            presenter_description:
                document
                    .getElementById('speaker_description')
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
                if (response.status < 200 || response.status >= 300) {
                    button.disabled = true
                    return response.json().then(
                        data => Promise.reject(
                            {
                                code: response.status,
                                message: data['error']
                            }
                        )
                    )
                }
                return response.json()
            }
        ).then(
            body => {
                button.textContent = body['description']
                setTimeout(
                    () => {
                        button.disabled = false
                        button.textContent = 'Сохранить'
                    },
                    750
                )
            }
        ).catch(
            error => {
                button.textContent = error.message
                setTimeout(
                    () => {
                        button.disabled = false
                        button.textContent = 'Сохранить'
                    },
                    750
                )
            }
        )
    })
})