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
            ['info', 'nav-personal-tab'],
            ['education', 'nav-education-tab'],
            ['security', 'nav-security-tab'],
            ['participation', 'na-events-part-tab'],
            ['presentations', 'na-events-lect-tab'],
            ['organisation', 'na-events-org-tab']
        ]
    )

    var hash = window.location.hash.slice(1)

    if (hash == '') return

    var tabId = tabsAnchors.get(hash)

    var tab = $(document.getElementById(tabId))

    tab.tab('show')
})