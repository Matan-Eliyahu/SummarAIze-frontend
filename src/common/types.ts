export type FormType = {
    formId: string
    elements: InputFormElement[]
    confirmButton: {
        text: string
        className: string
        handler: Function
    }
}

export type InputFormElement = {
    label: string
    name: string
    type: string
}
