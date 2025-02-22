import {createEvents, EventAttributes} from 'npm:ics';
import {Class} from "./types.ts";

export function createCalendar(classes: Class[]) {
    let eventAttributes: EventAttributes[] = [];

    for (const classDetails of classes) {
        for (const instance of classDetails.instances) {
            eventAttributes.push({
                title: classDetails.type,
                start: [instance.start.year, instance.start.month, instance.start.day, instance.start.hour, instance.start.minute],
                end: [instance.end.year, instance.end.month, instance.end.day, instance.end.hour, instance.end.minute],
                location: instance.location,
                calName: classDetails.course.subjectCategory + " " + classDetails.course.subjectCode + " " + classDetails.course.title,
            })
        }
    }

    return createEvents(eventAttributes).value;
}