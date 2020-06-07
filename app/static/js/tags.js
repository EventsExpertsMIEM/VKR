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

    var oldTags = target.dataset.tags

    var regexp = new RegExp(`(^|\\s)${value}(\\s|$)`, 'g')

    var newTags = oldTags.replace(regexp, ' ').trim()

    target.dataset.tags = newTags

    var badges = display.querySelectorAll('.badge')

    var badge = Array.from(badges).find(
        el => el.textContent == value
    )

    display.removeChild(badge)

    var options = select.querySelectorAll('option')

    var option = Array.from(options).find(
        el => el.textContent == value
    )

    console.log(options)
    console.log(option)

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


    target.dataset.tags =
        target.dataset.tags ? target.dataset.tags + ` ${value}` : value

    var option = select.querySelector(`option[value=${value}]`)
    option.style.display = 'none'
    select.value = ''

    if (select.options.length == 1) select.style.display = 'none'
}