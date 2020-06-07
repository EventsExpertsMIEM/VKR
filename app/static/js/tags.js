export { tagsSelection }

function tagsSelection(select, display, target) {
        
    var tagDisplay = name => {
        var badge = document.createElement('a')
        badge.textContent = name
        badge.href = '#'
        badge.classList.add('badge')
        badge.classList.add('badge-primary')
        return badge
    }

    var value = select.value

    display.appendChild(tagDisplay(value))
    display.appendChild(document.createTextNode (' '));


    target.dataset.tags =
        target.dataset.tags ? target.dataset.tags + ` ${value}` : value

    var option = select.querySelector(`option[value=${value}]`)
    select.removeChild(option)

    if (select.options.length == 1) select.style.display = 'none'
}