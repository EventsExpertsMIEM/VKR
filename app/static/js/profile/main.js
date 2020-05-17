document.addEventListener('DOMContentLoaded', () => {

    var elements = Array.from(document.getElementsByClassName('nav-link'))
    
    elements.forEach(
        el => {
            $(el).on(
                'shown.bs.tab',
                e => {
                    window.location.hash = e.currentTarget.dataset.anchor
                }
            )
        }
    )

    const tabsAnchors = new Map(
        [
            ['', 'nav-personal-tab'],
            ['info', 'nav-personal-tab'],
            ['education', 'nav-education-tab'],
            ['security', 'nav-security-tab'],
            ['participation', 'na-events-part-tab'],
            ['presentations', 'na-events-lect-tab'],
            ['organisation', 'na-events-org-tab']
        ]
    )

    var hash = window.location.hash.slice(1)

    var tabId = tabsAnchors.get(hash)

    var tab = $(`#${tabId}`)

    tab.tab('show')
})