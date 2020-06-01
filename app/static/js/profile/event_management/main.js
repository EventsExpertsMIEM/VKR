import { renderParticipants } from "./participants.js"
import { renderReports } from "./reports.js"
import {
        loadData as loadTasks,
        createTask,
        editTask,
        deleteTask,
        addManager,
        removeManager,
        renderTasksForCreator,
        renderTasksForManager,

} from './tasks.js'

import { loadEventInfo, editEventInfo } from './info.js'

function showCreatorTab(eventId) {

    var managementNav =
        document.getElementById('nav-events-management-tab')

    var managementTab =
        document.getElementById('events-management-tab')
    managementTab.dataset.eventId = eventId

    var managerNavs = document.getElementsByClassName('manager-only-nav')
    Array.from(managerNavs).forEach(
        nav => nav.style.display = 'none'
    )

    var creatorNavs = document.getElementsByClassName('creator-only-nav')
    Array.from(creatorNavs).forEach(
        nav => nav.style.display = ''
    )

    renderParticipants(eventId)

    document.getElementById('nav-org-participants').click()
    managementNav.click()

    renderReports(eventId)
    renderTasksForCreator(eventId)
    loadEventInfo(eventId)
}

function showManagerTab(eventId) {

    var managementNav =
        document.getElementById('nav-events-management-tab')

    var managementTab =
        document.getElementById('events-management-tab')
    managementTab.dataset.eventId = eventId

    var managerNavs = document.getElementsByClassName('manager-only-nav')
    Array.from(managerNavs).forEach(
        nav => nav.style.display = ''
    )

    var creatorNavs = document.getElementsByClassName('creator-only-nav')
    Array.from(creatorNavs).forEach(
        nav => nav.style.display = 'none'
    )

    renderParticipants(eventId)

    document.getElementById('nav-org-participants').click()
    managementNav.click()

    renderReports(eventId)
    renderTasksForManager(eventId)
}


document.addEventListener('DOMContentLoaded', () => {
    var manageEventButtons =
        document.getElementsByClassName('manage-event-button')

    Array.from(manageEventButtons).forEach(
        button => button.addEventListener(
            'click',
            event => {

                var eventId = event.target.dataset.eventId

                showCreatorTab(eventId)

            }
        )
    )

    var managerManageEventsButtons =
        document.getElementsByClassName('manage-event-manager-button')
    
    Array.from(managerManageEventsButtons).forEach(
        button => button.addEventListener(
            'click',
            event => {
                var eventId = event.target.dataset.eventId
                showManagerTab(eventId)
            }
        )
    )

    var today = new Date().toISOString().split('T')[0]

    document.getElementById('editTaskModalDeadline').min = today

    document.getElementById('createTaskModalDeadline').min = today // TODO: for all other date inputs

    document.getElementById('createTaskModalForm').addEventListener(
        'submit',
        createTask
    )

    document.getElementById('editTaskModalForm').addEventListener(
        'submit',
        editTask
    )

    document.getElementById('deleteTaskModalButton').addEventListener(
        'click', deleteTask
    )

    document.getElementById('editEventInfoForm').addEventListener(
        'submit',
        editEventInfo
    )

    document.getElementById('addManagerModalForm').addEventListener(
        'submit',
        addManager
    )

    document.getElementById('removeManagerModalButton').addEventListener(
        'click',
        removeManager
    )
})