import { formElementsService } from '@oneblink/sdk-core'
import { FormTypes, SubmissionEventTypes } from '@oneblink/types'

type BaseProps = {
  rootFormElements: FormTypes.FormElement[]
  validatedFormElements: FormTypes.FormElement[]
  propertyName: string
}
const validateFormEvents = ({
  rootFormElements,
  validatedFormElements,
  propertyName,
  formEvents,
}: BaseProps & {
  formEvents: SubmissionEventTypes.FormEvent[]
}) => {
  for (
    let formEventIndex = 0;
    formEventIndex < formEvents.length;
    formEventIndex++
  ) {
    const formEvent = formEvents[formEventIndex]
    validateFormEvent({
      formEvent,
      formEventIndex,
      propertyName,
      rootFormElements,
      validatedFormElements,
    })
  }
}
export default validateFormEvents

const validateFormEvent = ({
  formEvent,
  formEventIndex,
  rootFormElements,
  validatedFormElements,
  propertyName,
}: {
  formEvent: SubmissionEventTypes.FormEvent
  formEventIndex: number
  rootFormElements: FormTypes.FormElement[]
  validatedFormElements: FormTypes.FormElement[]
  propertyName: string
}) => {
  // CHECK ANY CONDITIONAL ELEMENT IDS ARE IN THE FORM
  if (
    formEvent.conditionallyExecutePredicates &&
    formEvent.conditionallyExecute
  ) {
    for (
      let conditionallyExecutePredicateIndex = 0;
      conditionallyExecutePredicateIndex <
      formEvent.conditionallyExecutePredicates.length;
      conditionallyExecutePredicateIndex++
    ) {
      const conditionallyExecutePredicate =
        formEvent.conditionallyExecutePredicates[
          conditionallyExecutePredicateIndex
        ]
      if (
        !rootFormElements.some(
          ({ id }) => id === conditionallyExecutePredicate.elementId,
        )
      ) {
        throw new Error(
          `"${propertyName}[${formEventIndex}].conditionallyExecutePredicates[${conditionallyExecutePredicateIndex}].elementId" (${conditionallyExecutePredicate.elementId}) does not exist in "elements"`,
        )
      }
    }
  }

  switch (formEvent.type) {
    case 'CP_PAY':
    case 'WESTPAC_QUICK_WEB':
    case 'BPOINT': {
      const formElement = rootFormElements.find(
        ({ id }) => id === formEvent.configuration.elementId,
      )
      if (!formElement) {
        throw new Error(
          `"${propertyName}[${formEventIndex}].configuration.elementId" (${formEvent.configuration.elementId}) does not exist in "elements"`,
        )
      }
      if (formElement.type !== 'number' && formElement.type !== 'calculation') {
        throw new Error(
          `"${propertyName}[${formEventIndex}].configuration.elementId" (${formEvent.configuration.elementId}) references a form element that is not a "number" or "calculation" element.`,
        )
      }
      break
    }
    case 'SCHEDULING': {
      const nameElementId = formEvent.configuration.nameElementId
      if (nameElementId) {
        const formElement = rootFormElements.find(
          ({ id }) => id === nameElementId,
        )
        if (!formElement) {
          throw new Error(
            `"${propertyName}[${formEventIndex}].configuration.nameElementId" (${nameElementId}) does not exist in "elements"`,
          )
        }
        if (formElement.type !== 'text') {
          throw new Error(
            `"${propertyName}[${formEventIndex}].configuration.nameElementId" (${nameElementId}) references a form element that is not a "text" element.`,
          )
        }
      }
      const emailElementId = formEvent.configuration.emailElementId
      if (emailElementId) {
        const formElement = rootFormElements.find(
          ({ id }) => id === emailElementId,
        )
        if (!formElement) {
          throw new Error(
            `"${propertyName}[${formEventIndex}].configuration.emailElementId" (${emailElementId}) does not exist in "elements"`,
          )
        }
        if (formElement.type !== 'email') {
          throw new Error(
            `"${propertyName}[${formEventIndex}].configuration.emailElementId" (${emailElementId}) references a form element that is not an "email" element.`,
          )
        }
      }
      break
    }
    case 'CIVICA_CRM': {
      for (
        let mappingIndex = 0;
        mappingIndex < formEvent.configuration.mapping.length;
        mappingIndex++
      ) {
        const { formElementId } = formEvent.configuration.mapping[mappingIndex]
        if (!rootFormElements.some(({ id }) => id === formElementId)) {
          throw new Error(
            `"${propertyName}[${formEventIndex}].configuration.mapping[${mappingIndex}].formElementId" (${formElementId}) does not exist in "elements"`,
          )
        }
      }
      break
    }
    case 'CP_HCMS': {
      if (formEvent.configuration.encryptedElementIds) {
        for (const elementId of formEvent.configuration.encryptedElementIds) {
          const element = formElementsService.findFormElement(
            validatedFormElements,
            ({ id }) => id === elementId,
          )
          if (!element) {
            throw new Error(
              `You tried to reference an element ${elementId} that does not exist on the form, in a ${formEvent.type} form event.`,
            )
          }
          const allowedElementTypes = [
            'text',
            'email',
            'telephone',
            'barcodeScanner',
            'radio',
            'autocomplete',
            'camera',
            'draw',
            'files',
            'file',
            'select',
          ]
          if (
            !allowedElementTypes.some(
              (elementType) => elementType === element.type,
            ) ||
            (element.type === 'select' && element.multi)
          ) {
            throw new Error('Encrypted element is not an allowed type')
          }
        }
      }
      break
    }
    case 'PDF': {
      validateEmailTemplateMappingElements({
        formEvent,
        validatedFormElements,
        formEventIndex,
        propertyName,
      })
      if (formEvent.configuration.excludedElementIds) {
        for (const elementId of formEvent.configuration.excludedElementIds) {
          const element = formElementsService.findFormElement(
            validatedFormElements,
            ({ id }) => id === elementId,
          )
          if (!element) {
            throw new Error(
              `You tried to reference an element ${elementId} that does not exist on the form, in a ${formEvent.type} form event.`,
            )
          }
        }
      }
      break
    }
    case 'EMAIL': {
      validateEmailTemplateMappingElements({
        formEvent,
        validatedFormElements,
        formEventIndex,
        propertyName,
      })
      break
    }
    case 'FRESHDESK_CREATE_TICKET': {
      validateFreshdeskCreateTicketMappingElements({
        formEvent,
        validatedFormElements,
        formEventIndex,
        propertyName,
      })
      break
    }
    default: {
      break
    }
  }
}

function validateEmailTemplateMappingElements({
  formEvent,
  validatedFormElements,
  formEventIndex,
  propertyName,
}: {
  formEvent:
    | SubmissionEventTypes.EmailOnlySubmissionEvent
    | SubmissionEventTypes.PdfSubmissionEvent
  validatedFormElements: FormTypes.FormElement[]
  formEventIndex: number
  propertyName: string
}) {
  if (formEvent.configuration.emailTemplate) {
    for (
      let mappingIndex = 0;
      mappingIndex < formEvent.configuration.emailTemplate.mapping.length;
      mappingIndex++
    ) {
      const mapping =
        formEvent.configuration.emailTemplate.mapping[mappingIndex]

      if (mapping.type === 'FORM_ELEMENT') {
        const element = formElementsService.findFormElement(
          validatedFormElements,
          ({ id }) => id === mapping.formElementId,
        )
        if (!element) {
          throw new Error(
            `"${propertyName}[${formEventIndex}].configuration.mapping[${mappingIndex}].formElementId" (${mapping.formElementId}) does not exist in "elements".`,
          )
        }
      }
    }
  }
}

function validateFreshdeskCreateTicketMappingElements({
  formEvent,
  validatedFormElements,
  formEventIndex,
  propertyName,
}: {
  formEvent: SubmissionEventTypes.FreshdeskCreateTicketSubmissionEvent
  validatedFormElements: FormTypes.FormElement[]
  formEventIndex: number
  propertyName: string
}) {
  for (
    let mappingIndex = 0;
    mappingIndex < formEvent.configuration.mapping.length;
    mappingIndex++
  ) {
    const mapping = formEvent.configuration.mapping[mappingIndex]
    if (mapping.type === 'FORM_ELEMENT') {
      const element = formElementsService.findFormElement(
        validatedFormElements,
        ({ id }) => id === mapping.formElementId,
      )
      if (!element) {
        throw new Error(
          `"${propertyName}[${formEventIndex}].configuration.mapping[${mappingIndex}].formElementId" (${mapping.formElementId}) does not exist in "elements".`,
        )
      }
    }
  }
}