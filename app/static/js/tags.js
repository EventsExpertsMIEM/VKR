export { tagsSelection, tagBadge }

function tagBadge (name) {
    var badge = document.createElement('a')
    badge.textContent = name
    badge.href = '#'
    badge.classList.add('badge')
    badge.classList.add('badge-primary')
    return badge
}

function removeTag(value, select, display, target) { // TODO

    

}

function tagsSelection(select, display, target) {

    var value = select.value

    display.appendChild(tagBadge(value))
    display.appendChild(document.createTextNode (' '));


    target.dataset.tags =
        target.dataset.tags ? target.dataset.tags + ` ${value}` : value

    var option = select.querySelector(`option[value=${value}]`)
    option.style.display = 'none'
    select.value = ''

    if (select.options.length == 1) select.style.display = 'none'
}