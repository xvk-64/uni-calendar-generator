export type ClassInstance = {
    location: string;
    start: Temporal.ZonedDateTime;
    end: Temporal.ZonedDateTime;
}

export type Course = {
    subjectCategory: string,
    subjectCode: number,
    title: string,
}

export type Class = {
    classNumber: number,
    type: string,
    course: Course,
    instances: Array<ClassInstance>,
}