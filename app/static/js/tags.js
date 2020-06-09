export { tagsSelection, tagBadge, removeTag }

function tagBadge (name) {
    var badge = document.createElement('a')
    badge.textContent = name
    badge.href = '#'
    badge.classList.add('badge')
    badge.classList.add('badge-primary')
    badge.dataset.tag = name
    return badge
}

function removeTag(value, select, display, target) { // TODO

    var tags = target.dataset.tags
    
    var tagsSet =   new Set(
                        tags ? JSON.parse(target.dataset.tags) : undefined
                    )
    tagsSet.delete(value)

    target.dataset.tags = JSON.stringify(Array.from(tagsSet))

    var badges = display.querySelectorAll('.badge')

    var badge = Array.from(badges).find(
        el => el.textContent == value
    )

    display.removeChild(badge)

    var options = select.querySelectorAll('option')

    var option = Array.from(options).find(
        el => el.textContent == value
    )

    option.style.display = ''

}

function tagsSelection(select, display, target) {

    var value = select.value

    var badge = tagBadge(value)
    badge.addEventListener(
        'click',
        () => removeTag(value, select, display, target)
    )

    display.appendChild(badge)
    display.appendChild(document.createTextNode (' '));

    var tags = target.dataset.tags
    var tagsSet =
        new Set(
            tags ? JSON.parse(target.dataset.tags) : undefined
        )
        .add(value)

    target.dataset.tags = JSON.stringify(Array.from(tagsSet))

    var option = select.querySelector(`option[value="${value}"]`)
    option.style.display = 'none'
    select.value = ''

    if (select.options.length == 1) select.style.display = 'none'
}