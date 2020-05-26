export {loadData, deleteTask};

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

    modal.querySelector('#editTaskModalName').value = data.name
    modal
        .querySelector('#editTaskModalDescription')
            .value = 
                data.description
    
    modal.querySelector('#editTaskModalDeadline').value = data.deadline

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
                return Promise.reject('Something went wrong')
            }

            return response.json()
        }
    ).then(
        () => {
            var modal = document.getElementById('deleteTaskModal')
            $(modal).modal('hide')
            loadData(eventId)
            
        }
    ).catch(
        error => console.log(error)
    )

}

function renderTask(data, count) {

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

function renderData(data) {

    var taskTableBody = 
        document
            .getElementById('management_tasks_table')
                .getElementsByTagName('tbody')[0]

    taskTableBody.innerHTML = ''

    for (let i in data) {
        taskTableBody.appendChild(renderTask(data[i], Number(i) + 1))
    }
}

var eventID;

function loadData(eventId) {

    eventID = eventId // Horrible, horrible hack

    fetch(`api/event/${eventId}/task/all`).then(
        response => {
            if (response.status != 200) {
                return Promise.reject('Something went wrong')
            }

            return response.json()
        }
    ).then(
        body => renderData(body)
    ).catch(
        error => console.log(error)
    )
}