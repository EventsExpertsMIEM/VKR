import { tagsSelection } from './tags.js'

function search(name, tags, target) {

    eventsContainer.innerHTML = ''

    var searchString = `/search?name=${name}`
    if (tags != undefined) {
        searchString = `${searchString}&tags=${tags}`
    }

    fetch(searchString).then(
        response => {
            if (response.status != 200) {
                return Promise.reject(
                    {
                        code: response.status
                    }
                )
            }
            return response.text()
        }
    ).then(
        body => {
            target.classList.add('card-deck')
            target.innerHTML = body
        }
    ).catch(
        error => {
            if (error.code == 404) {
                var div = document.createElement('div')
                div.classList.add('text-center')
                var text = document.createElement('div')
                text.classList.add('lead')
                text.classList.add('text-gray-800')
                text.classList.add('mb-5')
                text.textContent = 'Ничего не найдено'
                div.appendChild(text)
                target.appendChild(div)
                target.classList.remove('card-deck')
            }
        }
    )
}

function init() {
    
    var button = document.getElementById('searchButton')

    var eventsContainer = document.getElementById('eventsContainer')
    
    var searchInput = document.getElementById('event_name_search')

    var tagsDisplay = document.getElementById('tagsDisplay')

    tagsSelect.addEventListener(
        'change',
        event => tagsSelection(event.target, tagsDisplay, button)
    )

    button.addEventListener(
        'click',
        () => search(searchInput.value, button.dataset.tags, eventsContainer))
}

document.addEventListener('DOMContentLoaded', init)