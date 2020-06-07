export { changeUserRole, banUser, deleteUser }

function changeUserRole(userId, newRole) {


    fetch(
        `/api/user/${userId}/role/${newRole}`
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
        json_body => {}
    ).catch(
        error => console.log(error)
    )

}

function banUser(userId) {
    fetch(
        `/api/user/${userId}/ban`
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
        json_body => window.location = ''
    ).catch(
        error => console.log(error)
    )
}

function deleteUser(userId) {
    fetch(
        `/api/user/${userId}`,
        {
            method: 'DELETE'
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
        json_body => window.location = ''
    ).catch(
        error => console.log(error)
    )
}