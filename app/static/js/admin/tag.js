export { createTag, editTag, deleteTag }


function createTag(name) {

    fetch(
        '/api/tag',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    name: name
                }
            )
        }
    ).then(
        response => {
            if (response.status != 201) {
                return response.json().then(
                    json_body => Promise.reject(
                        {
                            code: response.status,
                            message: json_body.error
                        }
                    )
                )
            }
        }
    ).then(
        json_body => window.location = ''
    ).catch(
        error => console.log(error)
    )

}

function editTag(id, newName) {

    fetch(
        `/api/tag/${id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    name: newName
                }
            )
        }
    ).then(
        response => {
            if ( response.status != 200 ) {
                return response.json().then(
                    json_body => Promise.reject(
                        {
                            code: response.status,
                            message: json_body.error
                        }
                    )
                )
            }
        }
    ).then(
        json_body => window.location = ''
    ).catch(
        error => console.log(error)
    )

}

function deleteTag(id) {

    fetch(
        `/api/tag/${id}`,
        {
            method: 'DELETE'
        }
    ).then(
        response => {
            if ( response.status != 200 ) {
                return response.json().then(
                    json_body => Promise.reject(
                        {
                            code: response.status,
                            message: json_body.error
                        }
                    )
                )
            }
        }
    ).then(
        json_body => window.location = ''
    ).catch(
        error => console.log(error)
    )
}