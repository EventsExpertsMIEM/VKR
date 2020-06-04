import { changeUserRole, banUser, deleteUser } from './user.js'
import { createTag, deleteTag, editTag } from './tag.js'

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
        event => banUser(event.target.dataset.userId)
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
        event => deleteUser(event.target.dataset.userId)
    )

    document.getElementById('createTagForm').addEventListener(
        'submit',
        event => {
            event.preventDefault()
            var input = document.getElementById('tagName')
            createTag(input.value)
        }
    )

    var editTagForm = document.getElementById('editTagModalForm')
    var newTagNameinput = document.getElementById('editTagModalName')

    Array.from(document.getElementsByClassName('edit-tag-button')).forEach(
        button => button.addEventListener(
            'click',
            event => {
                newTagNameinput.value = event.target.dataset.tagName
                editTagForm.dataset.tagId = event.target.dataset.tagId
            }
        )
    )

    editTagForm.addEventListener(
        'submit',
        event => {
            event.preventDefault()
            editTag(event.target.dataset.tagId, newTagNameinput.value)
        }
    )

    var deleteTagButton = document.getElementById('deleteTagModalButton')
    
    Array.from(document.getElementsByClassName('delete-tag-button')).forEach(
        button => button.addEventListener(
            'click',
            event => {
                deleteTagButton.dataset.tagId =
                    event.target.dataset.tagId
            }
        )
    )

    deleteTagButton.addEventListener(
        'click',
        event => deleteTag(event.target.dataset.tagId)
    )
}

document.addEventListener('DOMContentLoaded', setupHandlers)