import { changeUserRole, banUser, deleteUser } from './user.js'

function setupHandlers() {

    Array.from(document.getElementsByClassName('user-status-select')).forEach(
        select => select.addEventListener(
            'change',
            event => {
                var el = event.target
                changeUserRole(el.dataset.userId, el.value)
            }
        )
    )

    Array.from(document.getElementsByClassName('block-user-button')).forEach(
        button => button.addEventListener(
            'click',
            event => 
                document.getElementById('blockUserModalButton').dataset.userId =
                    event.target.dataset.userId

        )
    )

    document.getElementById('blockUserModalButton').addEventListener(
        'click',
        event => {
            banUser(event.target.dataset.userId)
        }
    )

    Array.from(document.getElementsByClassName('delete-user-button')).forEach(
        button => button.addEventListener(
            'click',
            event => 
                document.getElementById('deleteUserModalButton').dataset.userId =
                    event.target.dataset.userId

        )
    )

    document.getElementById('deleteUserModalButton').addEventListener(
        'click',
        event => {
            deleteUser(event.target.dataset.userId)
        }
    )
}

document.addEventListener('DOMContentLoaded', setupHandlers)