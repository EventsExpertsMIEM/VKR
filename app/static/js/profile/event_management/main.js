import {addParticipantsData, showTab} from "./participants.js"
import { loadData as loadReports } from "./reports.js"

document.addEventListener('DOMContentLoaded', () => {
    var manageEventLinks = document.getElementsByClassName('manage_event_link')

    Array.from(manageEventLinks).forEach(
        link => link.addEventListener(
            'click',
            event => {

                var eventId = event.target.dataset.eventId

                fetch(`/api/event/${eventId}/participants`).then(
                    response => {
                        if (response.status != 200) {
                            return Promise.reject('Something went wrong')
                        }

                        return response.json()
                    }
                ).then(
                    body => {

                        addParticipantsData(body.participants)

                        showTab(body.event.id, body.event.name)
                        loadReports()
                    }
                ).catch(
                    error => console.log(error)
                )

            }
        )
    )
})