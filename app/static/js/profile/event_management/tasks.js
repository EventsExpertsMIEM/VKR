export {
    loadData,
    createTask,
    editTask,
    deleteTask,
    getManager,
    addManager,
    removeManager,
    renderTasksForCreator,
    renderTasksForManager
};

var eventID;

function setInfoModalData(data, count) {

    var modal = document.getElementById('taskInfoModal')

    modal.querySelector('#taskInfoModalLabel').textContent = `Задача ${count}`
    modal.querySelector('#taskInfoModalName').textContent = data.name
    modal
        .querySelector('#taskInfoModalDescription')
            .textContent = 
                data.description
    modal.querySelector('#taskInfoModalDeadline').textContent = data.deadline
    modal.querySelector('#taskInfoModalStatus').textContent = data.status

}

function setEditModalData(data) {

    var modal = document.getElementById('editTaskModal')

    modal.querySelector('form').dataset.taskId = data.id

    modal.querySelector('#editTaskModalName').value = data.name
    modal
        .querySelector('#editTaskModalDescription')
            .value = 
                data.description
    
    modal.querySelector('#editTaskModalDeadline').value = data.deadline

}

function getManager(eventId) {
    
    fetch(`/api/event/${eventId}/manager`).then(
        response => {
            if (response.status != 200) {
                return Promise.reject(
                    {
                        message: 'Something went wrong',
                        body: response.json(),
                        code: response.status
                    }
                )
            }
            return response.json()
        }
    ).then(
        body => {
            var currentManagerDisplay =
                document.getElementById('addMangerModalCurrentManager')
            currentManagerDisplay.textContent =
                `Текущий менеджер: ${body.description}`
            var removeManagerButton = 
                document.getElementById('removeManagerButton')
            removeManagerButton.style.display = ''
        }
    ).catch(
        error => {
            if (error.code == 404) {
                removeManagerButton.style.display = 'none'
            }
            error.body.then(
                msg => console.log(msg)
            )
        }
    )
}

function addManager(event) {

    event.preventDefault()

    var data = {
        email: document.getElementById('addManagerModalEmail').value
    }

    fetch(
        `/api/event/${eventID}/manager`,
        {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    ).then(
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
            var currentManagerDisplay =
                document.getElementById('addMangerModalCurrentManager')
            currentManagerDisplay.textContent =
                `Текущий менеджер: ${data.email}`
            var removeManagerButton = 
                document.getElementById('removeManagerButton')
            removeManagerButton.style.display = ''
        }
    ).catch(
        error => console.log(error)
    )

}

function removeManager() {

    fetch(
        `/api/event/${eventID}/manager`,
        {
            method: 'DELETE'
        }
    ).then(
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
            var currentManagerDisplay =
                document.getElementById('addMangerModalCurrentManager')
            currentManagerDisplay.textContent = ''
            var removeManagerButton = 
                document.getElementById('removeManagerButton')
            removeManagerButton.style.display = 'none'
            var modal = document.getElementById('removeManagerModal')
            $(modal).modal('hide')
        }
    ).catch(
        error => console.log(error)
    )

}

function createTask(event) {

    event.preventDefault()


    var data = {
        name: document.getElementById('createTaskModalName').value,
        description: document.getElementById('createTaskModalDescription').value,
    }

    var deadline = document.getElementById('createTaskModalDeadline').value
    if (deadline != "") {
        data['deadline'] = deadline
    }
    
    fetch(
        `/api/event/${eventID}/task`,
        {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    ).then(
        response => {
            if (response.status != 201) {
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
        () => {
            var modal = document.getElementById('createTaskModal')
            $(modal).modal('hide')
            event.target.reset()
            renderTasksForCreator(eventID)
        }
    ).catch(
        error => console.log(error)
    )

}

function editTask(event) {

    event.preventDefault()

    var eventId = eventID
    var taskId = event.target.dataset.taskId

    var data = {
        name: document.getElementById('editTaskModalName').value,
        description: document.getElementById('editTaskModalDescription').value,
    }

    var deadline = document.getElementById('editTaskModalDeadline').value
    if (deadline != "") {
        data['deadline'] = deadline
    }

    fetch(
        `/api/event/${eventId}/task/${taskId}`,
        {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    ).then(
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
        () => {
            var modal = document.getElementById('editTaskModal')
            $(modal).modal('hide')
            renderTasksForCreator(eventId)
        }
    ).catch(
        error => console.log(error)
    )

}

function deleteTask(event) {

    var eventId = event.target.dataset.eventId
    var taskId = event.target.dataset.taskId

    fetch(
        `/api/event/${eventId}/task/${taskId}`,
        {
            method: 'DELETE'
        }
    ).then(
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
        () => {
            var modal = document.getElementById('deleteTaskModal')
            $(modal).modal('hide')
            renderTasksForCreator(eventId)
        }
    ).catch(
        error => console.log(error)
    )

}

function updateTaskStatus(event) {

    var eventId = event.target.dataset.eventId
    var taskId = event.target.dataset.taskId
    var status = event.target.value

    fetch(
        `/api/event/${eventId}/task/${taskId}/move/${status}`,
        {
            method: 'PUT'
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
        body => {
            console.log(body)
        }
    ).catch(
        error => console.log(error)
    )


}

function renderTaskForCreator(data, count) {

    var getCell = text => {
        var cell = document.createElement('td')
        cell.textContent = text
        return cell
    }

    var row = document.createElement('tr')

    if (data.status == 'failed') {
        row.style.backgroundColor = 'lightcoral';
    }

    var countCell = document.createElement('th')
    countCell.textContent = count
    countCell.scope = 'row'

    var nameCell = getCell('')

    var link = document.createElement('a')
    link.href="#taskInfoModal"
    link.dataset.toggle="modal"
    link.dataset.target="#taskInfoModal"
    link.textContent = data.name

    link.addEventListener('click', () => {
        setInfoModalData(data, count)
    })

    nameCell.appendChild(link)

    var controlCell = getCell('')

    var div = document.createElement('div')
    div.classList.add('btn-group')
    div.role = 'group'

    var editButton = document.createElement('editButton')
    editButton.type = 'editButton'
    editButton.classList.add('btn', 'btn-outline-secondary')
    editButton.dataset.toggle="modal"
    editButton.dataset.target="#editTaskModal"
    editButton.textContent = 'Редактировать'

    editButton.addEventListener('click', () => {
        setEditModalData(data)
    })


    var deleteButton = document.createElement('deleteButton')
    deleteButton.type = 'deleteButton'
    deleteButton.classList.add('btn', 'btn-outline-danger')
    deleteButton.dataset.toggle="modal"
    deleteButton.dataset.target="#deleteTaskModal"
    deleteButton.textContent = 'Удалить'

    deleteButton.addEventListener('click', event => {
        var deleteModalButton = document.getElementById('deleteTaskModalButton')
        deleteModalButton.dataset.eventId = eventID
        deleteModalButton.dataset.taskId = data.id
    })

    div.appendChild(editButton)
    div.appendChild(deleteButton)

    controlCell.appendChild(div)

    var deadline = data.deadline ? data.deadline : 'Нет'

    var cells = [
        countCell,
        nameCell,
        getCell(deadline),
        getCell(data.status),
        controlCell
    ]

    for(let i of cells) {
        row.appendChild(i)
    }

    return row
}

function renderTaskForManager(data, count) {

    var getCell = text => {
        var cell = document.createElement('td')
        cell.textContent = text
        return cell
    }

    var row = document.createElement('tr')

    if (data.status == 'failed') {
        row.style.backgroundColor = 'lightcoral';
    }

    var countCell = document.createElement('th')
    countCell.textContent = count
    countCell.scope = 'row'

    var nameCell = getCell('')

    var link = document.createElement('a')
    link.href="#taskInfoModal"
    link.dataset.toggle="modal"
    link.dataset.target="#taskInfoModal"
    link.textContent = data.name

    link.addEventListener('click', () => {
        setInfoModalData(data, count)
    })

    nameCell.appendChild(link)

    var statusCell
    
    if(data.status != 'failed') {
        statusCell = getCell('')

        var statusSelect = document.createElement('select')

        statusSelect.classList.add('form-control')
        
        var statuses = new Map(
            [
                ['todo', 'Не выполнено'],
                ['inprocess', 'В работе'],
                ['done', 'Выполнено']
            ]
        )

        for(let [k,v] of statuses) {
            var option = document.createElement('option')
            option.value = k
            option.textContent = v
            statusSelect.appendChild(option)
        }

        statusSelect.value = data.status
        statusSelect.dataset.eventId = eventID
        statusSelect.dataset.taskId = data.id
        statusSelect.addEventListener('change', updateTaskStatus)

        statusCell.appendChild(statusSelect)
    } else {
        statusCell = getCell('Просрочено')
    }

    var deadline = data.deadline ? data.deadline : 'Нет'

    var cells = [
        countCell,
        nameCell,
        getCell(deadline),
        statusCell
    ]

    for(let i of cells) {
        row.appendChild(i)
    }

    return row
}

function renderDataForCreator(data) {

    var taskTableBody = 
        document
            .getElementById('management_tasks_table')
                .getElementsByTagName('tbody')[0]

    taskTableBody.innerHTML = ''

    for (let i in data) {
        taskTableBody.appendChild(renderTaskForCreator(data[i], Number(i) + 1))
    }
}

function renderDataForManager(data) {
    var taskTableBody = 
        document
            .getElementById('taskManagerTable')
                .getElementsByTagName('tbody')[0]

    taskTableBody.innerHTML = ''

    for (let i in data) {
        taskTableBody.appendChild(renderTaskForManager(data[i], Number(i) + 1))
    }
}

async function loadData(eventId) {

    eventID = eventId   // Nope

    return fetch(`api/event/${eventId}/task/all`).then(
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

async function renderTasksForCreator(eventId) {
    renderDataForCreator(await loadData(eventId))
    getManager(eventId)
}

async function renderTasksForManager(eventId) {
    renderDataForManager(await loadData(eventId))
}