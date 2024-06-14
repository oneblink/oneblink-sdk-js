import { formSchema } from '../../src/lib/forms-schema'
import { validateWithFormSchema } from '../../src/lib/forms-validation'

function validateFormThrowError(data: unknown) {
  const result = validateWithFormSchema(data)
  if (!result.success) {
    throw result.error
  }
  return result.data
}

describe('submission event conditional logic', () => {
  test('should allow both OPTIONS and NUMERIC conditional types', () => {
    const result = formSchema.validate(
      {
        name: 'conditionally execute event via number input',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        tags: [],
        elements: [
          {
            id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
            name: 'Numbers',
            label: 'Numbers',
            type: 'number',
            required: false,
            minNumber: 1,
            maxNumber: 6,
            defaultValue: 3,
          },
          {
            id: '8e4d819b-97fa-438d-b613-a092d38c3b23',
            name: 'Select',
            label: 'Select',
            type: 'select',
            required: false,
            options: [
              {
                id: '9e50b6e5-52b7-48ab-ab86-542ccba82205',
                value: 'ONE',
                label: 'one',
              },
              {
                id: '5c82ef40-779a-46fb-8860-c9b4969518ec',
                value: 'TWO',
                label: 'two',
              },
            ],
          },
        ],
        isAuthenticated: true,
        submissionEvents: [
          {
            type: 'PDF',
            configuration: {
              email: 'developers@oneblink.io',
            },
            conditionallyExecute: true,
            requiresAllConditionallyExecutePredicates: true,
            conditionallyExecutePredicates: [
              {
                elementId: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
                type: 'NUMERIC',
                operator: '<',
                value: 5,
              },
              {
                elementId: '8e4d819b-97fa-438d-b613-a092d38c3b23',
                type: 'OPTIONS',
                optionIds: ['5c82ef40-779a-46fb-8860-c9b4969518ec'],
              },
            ],
          },
        ],
      },
      {
        abortEarly: false,
      },
    )
    expect(result.error).toBe(undefined)
  })

  test('should set correct defaults for submission event conditional properties', () => {
    const result = formSchema.validate(
      {
        name: 'conditionally show via number input',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
            name: 'Numbers',
            label: 'Numbers',
            type: 'number',
            required: false,
            minNumber: 1,
            maxNumber: 6,
            defaultValue: 3,
          },
        ],
        isAuthenticated: true,
        submissionEvents: [
          {
            type: 'PDF',
            configuration: {
              email: 'developers@oneblink.io',
              includeSubmissionIdInPdf: true,
            },
            // Should strip
            isDraft: false,
          },
        ],
      },

      {
        abortEarly: false,
        stripUnknown: true,
      },
    )

    expect(result.value.submissionEvents[0]).toEqual({
      type: 'PDF',
      configuration: {
        email: 'developers@oneblink.io',
        includeSubmissionIdInPdf: true,
        excludedElementIds: [],
        excludedAttachmentElementIds: [],
        excludedCSSClasses: [],
      },
      conditionallyExecute: false,
      requiresAllConditionallyExecutePredicates: false,
    })
    expect(result.error).toBe(undefined)
  })

  test('should allow element with valid between conditional logic', () => {
    const result = formSchema.validate(
      {
        name: 'conditionally show element via number input',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
            name: 'Numbers',
            label: 'Numbers',
            type: 'number',
            required: false,
            minNumber: 1,
            maxNumber: 6,
            defaultValue: 3,
          },
          {
            id: '8e4d819b-97fa-438d-b613-a092d38c3b23',
            name: 'Text',
            label: 'Text',
            type: 'text',
            required: false,
            defaultValue: 'text',
            isDataLookup: false,
            isElementLookup: false,
            readOnly: false,
            conditionallyShow: true,
            requiresAllConditionallyShowPredicates: false,
            conditionallyShowPredicates: [
              {
                elementId: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
                type: 'BETWEEN',
                min: 2,
                max: 5,
              },
            ],
          },
        ],
        isAuthenticated: true,
      },

      {
        abortEarly: false,
      },
    )
    expect(result.error).toBe(undefined)
  })
  test('should reject element with missing property in between conditional logic', () => {
    const result = formSchema.validate(
      {
        name: 'conditionally show element via number input',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
            name: 'Numbers',
            label: 'Numbers',
            type: 'number',
            required: false,
            minNumber: 1,
            maxNumber: 6,
            defaultValue: 3,
          },
          {
            id: '8e4d819b-97fa-438d-b613-a092d38c3b23',
            name: 'Text',
            label: 'Text',
            type: 'text',
            required: false,
            defaultValue: 'text',
            isDataLookup: false,
            isElementLookup: false,
            readOnly: false,
            conditionallyShow: true,
            requiresAllConditionallyShowPredicates: false,
            conditionallyShowPredicates: [
              {
                elementId: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
                type: 'BETWEEN',
                min: 2,
              },
            ],
          },
        ],
        isAuthenticated: true,
      },

      {
        abortEarly: false,
      },
    )

    expect(result.error?.message).toContain(
      '"elements[1].conditionallyShowPredicates[0].max" is required',
    )
  })
  test('should reject element with conditional between predicate where max is lower than min', () => {
    const result = formSchema.validate(
      {
        name: 'conditionally show element via number input',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
            name: 'Numbers',
            label: 'Numbers',
            type: 'number',
            required: false,
            minNumber: 1,
            maxNumber: 6,
            defaultValue: 3,
          },
          {
            id: '8e4d819b-97fa-438d-b613-a092d38c3b23',
            name: 'Text',
            label: 'Text',
            type: 'text',
            required: false,
            defaultValue: 'text',
            isDataLookup: false,
            isElementLookup: false,
            readOnly: false,
            conditionallyShow: true,
            requiresAllConditionallyShowPredicates: false,
            conditionallyShowPredicates: [
              {
                elementId: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
                type: 'BETWEEN',
                min: 8,
                max: 6,
              },
            ],
          },
        ],
        isAuthenticated: true,
      },

      {
        abortEarly: false,
      },
    )

    expect(result.error?.message).toContain(
      '"elements[1].conditionallyShowPredicates[0].max" must be greater than or equal to 8',
    )
  })
  test('should reject element if maxLength is less than minLength', () => {
    const result = formSchema.validate(
      {
        name: 'min & max text element length',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: '8e4d819b-97fa-438d-b613-a092d38c3b23',
            name: 'Text',
            label: 'Text',
            type: 'text',
            required: false,
            defaultValue: 'text',
            isDataLookup: false,
            isElementLookup: false,
            readOnly: false,
            conditionallyShow: false,
            requiresAllConditionallyShowPredicates: false,
            minLength: 4,
            maxLength: 3,
          },
        ],
        isAuthenticated: true,
      },

      {
        abortEarly: false,
      },
    )

    expect(result.error?.message).toContain(
      '"elements[0].maxLength" must be greater than or equal to 4',
    )
  })

  test('should not reject element if maxLength is greater than minLength', () => {
    const result = formSchema.validate(
      {
        name: 'min & max text element length',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: '8e4d819b-97fa-438d-b613-a092d38c3b23',
            name: 'Text',
            label: 'Text',
            type: 'text',
            required: false,
            defaultValue: 'text',
            isDataLookup: false,
            isElementLookup: false,
            readOnly: false,
            conditionallyShow: false,
            requiresAllConditionallyShowPredicates: false,
            minLength: 3,
            maxLength: 4,
          },
        ],
        isAuthenticated: true,
      },

      {
        abortEarly: false,
      },
    )

    expect(result.error).toBe(undefined)
  })

  test('should reject element if defaultValue is less than minLength', () => {
    const result = formSchema.validate(
      {
        name: 'min & max text element length',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: '8e4d819b-97fa-438d-b613-a092d38c3b23',
            name: 'Text',
            label: 'Text',
            type: 'text',
            required: false,
            defaultValue: 'text',
            isDataLookup: false,
            isElementLookup: false,
            readOnly: false,
            conditionallyShow: false,
            requiresAllConditionallyShowPredicates: false,
            minLength: 5,
            maxLength: 6,
          },
        ],
        isAuthenticated: true,
      },

      {
        abortEarly: false,
      },
    )

    expect(result.error?.message).toBe(
      '"elements[0].defaultValue" length must be at least 5 characters long',
    )
  })

  test('should reject element if defaultValue is greater than maxLength', () => {
    const result = formSchema.validate(
      {
        name: 'min & max text element length',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: '8e4d819b-97fa-438d-b613-a092d38c3b23',
            name: 'Text',
            label: 'Text',
            type: 'text',
            required: false,
            defaultValue: 'text',
            isDataLookup: false,
            isElementLookup: false,
            readOnly: false,
            conditionallyShow: false,
            requiresAllConditionallyShowPredicates: false,
            minLength: 2,
            maxLength: 3,
          },
        ],
        isAuthenticated: true,
      },

      {
        abortEarly: false,
      },
    )

    expect(result.error?.message).toBe(
      '"elements[0].defaultValue" length must be less than or equal to 3 characters long',
    )
  })

  test('should not reject element if defaultValue is between minLength and maxLength', () => {
    const result = formSchema.validate(
      {
        name: 'min & max text element length',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: '8e4d819b-97fa-438d-b613-a092d38c3b23',
            name: 'Text',
            label: 'Text',
            type: 'text',
            required: false,
            defaultValue: 'text',
            isDataLookup: false,
            isElementLookup: false,
            readOnly: false,
            conditionallyShow: false,
            requiresAllConditionallyShowPredicates: false,
            minLength: 4,
            maxLength: 5,
          },
        ],
        isAuthenticated: true,
      },

      {
        abortEarly: false,
      },
    )

    expect(result.error).toBe(undefined)
  })

  test('should reject element if minLength is negative', () => {
    const result = formSchema.validate(
      {
        name: 'min & max text element length',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: '8e4d819b-97fa-438d-b613-a092d38c3b23',
            name: 'Text',
            label: 'Text',
            type: 'text',
            required: false,
            isDataLookup: false,
            isElementLookup: false,
            readOnly: false,
            conditionallyShow: false,
            requiresAllConditionallyShowPredicates: false,
            minLength: -4,
            maxLength: 5,
          },
        ],
        isAuthenticated: true,
      },

      {
        abortEarly: false,
      },
    )

    expect(result.error?.message).toContain(
      '"elements[0].minLength" must be greater than or equal to 0',
    )
  })

  test('should reject element if maxLength is negative', () => {
    const result = formSchema.validate(
      {
        name: 'min & max text element length',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: '8e4d819b-97fa-438d-b613-a092d38c3b23',
            name: 'Text',
            label: 'Text',
            type: 'text',
            required: false,
            isDataLookup: false,
            isElementLookup: false,
            readOnly: false,
            conditionallyShow: false,
            requiresAllConditionallyShowPredicates: false,
            maxLength: -5,
          },
        ],
        isAuthenticated: true,
      },

      {
        abortEarly: false,
      },
    )

    expect(result.error?.message).toContain(
      '"elements[0].maxLength" must be greater than or equal to 0',
    )
  })

  test('should reject number element with decimal default value when isInteger set to true', () => {
    const result = formSchema.validate(
      {
        name: 'conditionally show element via number input',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
            name: 'Numbers',
            label: 'Numbers',
            type: 'number',
            required: false,
            defaultValue: 3.2,
            isInteger: true,
          },
        ],
        isAuthenticated: true,
      },

      {
        abortEarly: false,
      },
    )

    expect(result.error?.message).toContain(
      '"elements[0].defaultValue" must be an integer',
    )
  })

  test('should allow property: "includeTimestampWatermark" to be set for camera elements', () => {
    const result = formSchema.validate(
      {
        name: 'conditionally show element via number input',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
            name: 'camera',
            label: 'camera',
            type: 'camera',
            includeTimestampWatermark: true,
          },
        ],
        isAuthenticated: true,
      },

      {
        abortEarly: false,
      },
    )

    expect(result.value.elements[0].includeTimestampWatermark).toBe(true)
  })

  test('should strip property: "includeTimestampWatermark" if element is not of type "camera"', () => {
    const result = formSchema.validate(
      {
        name: 'conditionally show element via number input',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
            name: 'text',
            label: 'text',
            type: 'text',
            includeTimestampWatermark: true,
          },
        ],
        isAuthenticated: true,
      },

      {
        abortEarly: false,
      },
    )

    expect(result.value.elements[0].includeTimestampWatermark).toBe(undefined)
  })

  test('should reject property: "includeTimestampWatermark" if it is not a boolean', () => {
    const result = formSchema.validate(
      {
        name: 'conditionally show element via number input',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
            name: 'camera',
            label: 'camera',
            type: 'camera',
            includeTimestampWatermark: 'true1',
          },
        ],
        isAuthenticated: true,
      },

      {
        abortEarly: false,
      },
    )

    expect(result.error?.message).toContain(
      '"elements[0].includeTimestampWatermark" must be a boolean',
    )
  })
})

describe('Conditional Predicates', () => {
  test('should allow both OPTIONS and NUMERIC conditional types', () => {
    const { error } = formSchema.validate(
      {
        name: 'conditionally show via number input',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        tags: [],
        elements: [
          {
            id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
            name: 'Numbers',
            label: 'Numbers',
            type: 'number',
            required: false,
            minNumber: 1,
            maxNumber: 6,
            defaultValue: 3,
          },
          {
            id: '8e4d819b-97fa-438d-b613-a092d38c3b23',
            name: 'My_Multi_Select',
            label: 'My Select',
            type: 'select',
            required: false,
            options: [
              {
                id: '9e50b6e5-52b7-48ab-ab86-542ccba82205',
                value: 'ONE',
                label: 'one',
              },
              {
                id: '5c82ef40-779a-46fb-8860-c9b4969518ec',
                value: 'TWO',
                label: 'two',
              },
              {
                id: '55568d62-6ac5-4504-a88d-e2311a026776',
                value: 'THREE',
                label: 'three',
              },
            ],
          },
          {
            id: '59b723a9-00e2-493f-8d76-84ea71a178ee',
            name: 'Just_Text',
            label: 'Just Text',
            type: 'text',
            required: false,
            defaultValue: 'single line text',
            conditionallyShow: true,
            requiresAllConditionallyShowPredicates: true,
            conditionallyShowPredicates: [
              {
                elementId: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
                type: 'NUMERIC',
                operator: '<',
                value: 5,
              },
              {
                elementId: '8e4d819b-97fa-438d-b613-a092d38c3b23',
                type: 'OPTIONS',
                optionIds: ['5c82ef40-779a-46fb-8860-c9b4969518ec'],
              },
            ],
          },
        ],
        isAuthenticated: true,

        submissionEvents: [],
      },

      {
        abortEarly: false,
      },
    )
    expect(error).toBe(undefined)
  })

  test('should error if conditional predicate types are missing required values', () => {
    const { error } = formSchema.validate(
      {
        name: 'conditionally show via number input',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
            name: 'Numbers',
            label: 'Numbers',
            type: 'number',
            required: false,
            minNumber: 1,
            maxNumber: 6,
            defaultValue: 3,
          },
          {
            id: '8e4d819b-97fa-438d-b613-a092d38c3b23',
            name: 'My_Multi_Select',
            label: 'My Select',
            type: 'select',
            required: false,
            options: [
              {
                id: '9e50b6e5-52b7-48ab-ab86-542ccba82205',
                value: 'ONE',
                label: 'one',
              },
              {
                id: '5c82ef40-779a-46fb-8860-c9b4969518ec',
                value: 'TWO',
                label: 'two',
              },
              {
                id: '55568d62-6ac5-4504-a88d-e2311a026776',
                value: 'THREE',
                label: 'three',
              },
            ],
          },
          {
            id: '59b723a9-00e2-493f-8d76-84ea71a178ee',
            name: 'Just_Text',
            label: 'Just Text',
            type: 'text',
            required: false,
            defaultValue: 'single line text',
            conditionallyShow: true,
            requiresAllConditionallyShowPredicates: true,
            conditionallyShowPredicates: [
              {
                elementId: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
                type: 'OPTIONS',
                operator: '<',
                value: 5,
              },
              {
                elementId: '8e4d819b-97fa-438d-b613-a092d38c3b23',
                type: 'NUMERIC',
                optionIds: ['5c82ef40-779a-46fb-8860-c9b4969518ec'],
              },
            ],
          },
        ],
        isAuthenticated: true,

        submissionEvents: [],
      },
      {
        abortEarly: false,
      },
    )
    expect(error?.details[0].message).toBe(
      '"elements[2].conditionallyShowPredicates[0].optionIds" is required',
    )
    expect(error?.details[1].message).toBe(
      '"elements[2].conditionallyShowPredicates[1].operator" is required',
    )
    expect(error?.details[2].message).toBe(
      '"elements[2].conditionallyShowPredicates[1].value" is required',
    )
  })

  test('should throw error when passing number value with `compareWith`: `ELEMENT`', () => {
    const { error } = formSchema.validate(
      {
        name: 'conditionally show via number input',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
            name: 'Numbers',
            label: 'Numbers',
            type: 'number',
            required: false,
            minNumber: 1,
            maxNumber: 6,
            defaultValue: 3,
          },
          {
            id: '59b723a9-00e2-493f-8d76-84ea71a178ee',
            name: 'Just_Text',
            label: 'Just Text',
            type: 'text',
            required: false,
            defaultValue: 'single line text',
            conditionallyShow: true,
            requiresAllConditionallyShowPredicates: true,
            conditionallyShowPredicates: [
              {
                elementId: '8e4d819b-97fa-438d-b613-a092d38c3b23',
                type: 'NUMERIC',
                operator: '===',
                compareWith: 'ELEMENT',
                value: 5,
              },
            ],
          },
        ],
        isAuthenticated: true,

        submissionEvents: [],
      },
      {
        abortEarly: false,
      },
    )
    expect(error?.details.length).toBe(1)
    expect(error?.details[0].message).toBe(
      '"elements[1].conditionallyShowPredicates[0].value" must be a string',
    )
  })

  test.only('should throw error when if compareWith element does not exist', () => {
    const func = () =>
      validateFormThrowError({
        name: 'conditionally show via number input',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
            name: 'Number1',
            label: 'Number 1',
            type: 'number',
            required: false,
            minNumber: 1,
            maxNumber: 6,
            defaultValue: 3,
          },
          {
            id: '8e4d819b-97fa-438d-b613-a092d38c3b23',
            name: 'Number2',
            label: 'Number 2',
            type: 'number',
            required: false,
            minNumber: 1,
            maxNumber: 6,
            defaultValue: 3,
          },
          {
            id: '59b723a9-00e2-493f-8d76-84ea71a178ee',
            name: 'Just_Text',
            label: 'Just Text',
            type: 'text',
            required: false,
            defaultValue: 'single line text',
            conditionallyShow: true,
            requiresAllConditionallyShowPredicates: true,
            conditionallyShowPredicates: [
              {
                elementId: '8e4d819b-97fa-438d-b613-a092d38c3b23',
                type: 'NUMERIC',
                operator: '===',
                compareWith: 'ELEMENT',
                value: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b0',
              },
            ],
          },
        ],
        isAuthenticated: true,

        submissionEvents: [],
      })

    expect(func).toThrow('Referenced elementId not found')
  })

  test.only('should throw error when if compareWith element is not correct type', () => {
    const func = () =>
      validateFormThrowError({
        name: 'conditionally show via number input',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
            name: 'Number1',
            label: 'Number 1',
            type: 'text',
          },
          {
            id: '8e4d819b-97fa-438d-b613-a092d38c3b23',
            name: 'Number2',
            label: 'Number 2',
            type: 'number',
            required: false,
            minNumber: 1,
            maxNumber: 6,
            defaultValue: 3,
          },
          {
            id: '59b723a9-00e2-493f-8d76-84ea71a178ee',
            name: 'Just_Text',
            label: 'Just Text',
            type: 'text',
            required: false,
            defaultValue: 'single line text',
            conditionallyShow: true,
            requiresAllConditionallyShowPredicates: true,
            conditionallyShowPredicates: [
              {
                elementId: '8e4d819b-97fa-438d-b613-a092d38c3b23',
                type: 'NUMERIC',
                operator: '===',
                compareWith: 'ELEMENT',
                value: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
              },
            ],
          },
        ],
        isAuthenticated: true,

        submissionEvents: [],
      })

    expect(func).toThrow(
      'Referenced compareWith element text type not one of number,calculation',
    )
  })

  test('should throw error when passing string to value with `compareWith`: `VALUE` | `undefined`', () => {
    const { error } = formSchema.validate(
      {
        name: 'conditionally show via number input',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
            name: 'Numbers',
            label: 'Numbers',
            type: 'number',
            required: false,
            minNumber: 1,
            maxNumber: 6,
            defaultValue: 3,
          },
          {
            id: '55568d62-6ac5-4504-a88d-e2311a026776',
            name: 'Numbers_2',
            label: 'Numbers_2',
            type: 'number',
            required: false,
            minNumber: 1,
            maxNumber: 6,
            defaultValue: 3,
          },
          {
            id: '59b723a9-00e2-493f-8d76-84ea71a178ee',
            name: 'Just_Text',
            label: 'Just Text',
            type: 'text',
            required: false,
            defaultValue: 'single line text',
            conditionallyShow: true,
            requiresAllConditionallyShowPredicates: true,
            conditionallyShowPredicates: [
              {
                elementId: '8e4d819b-97fa-438d-b613-a092d38c3b23',
                type: 'NUMERIC',
                operator: '===',
                value: '5c82ef40-779a-46fb-8860-c9b4969518ec',
              },
              {
                elementId: '55568d62-6ac5-4504-a88d-e2311a026776',
                type: 'NUMERIC',
                operator: '===',
                compareWith: 'VALUE',
                value: '5c82ef40-779a-46fb-8860-c9b4969518ec',
              },
            ],
          },
        ],
        isAuthenticated: true,

        submissionEvents: [],
      },
      {
        abortEarly: false,
      },
    )
    expect(error?.details.length).toBe(2)
    expect(error?.details[0].message).toBe(
      '"elements[2].conditionallyShowPredicates[0].value" must be a number',
    )
    expect(error?.details[1].message).toBe(
      '"elements[2].conditionallyShowPredicates[1].value" must be a number',
    )
  })

  test('should throw error if referenced numeric element does not exist', () => {
    const func = () =>
      validateFormThrowError({
        name: 'conditionally show via number input',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        tags: [],
        elements: [
          {
            id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
            name: 'Numbers',
            label: 'Numbers',
            type: 'number',
            required: false,
            minNumber: 1,
            maxNumber: 6,
            defaultValue: 3,
          },
          {
            id: '59b723a9-00e2-493f-8d76-84ea71a178ee',
            name: 'Just_Text',
            label: 'Just Text',
            type: 'text',
            required: false,
            defaultValue: 'single line text',
            conditionallyShow: true,
            requiresAllConditionallyShowPredicates: true,
            conditionallyShowPredicates: [
              {
                elementId: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b0',
                type: 'NUMERIC',
                operator: '<',
                value: 5,
              },
            ],
          },
        ],
        isAuthenticated: true,

        submissionEvents: [],
      })
    expect(func).toThrow('Referenced elementId not found')
  })

  test('should throw error if referenced numeric element is the wrong type', () => {
    const func = () =>
      validateFormThrowError({
        name: 'conditionally show via number input',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        tags: [],
        elements: [
          {
            id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
            name: 'Numbers',
            label: 'Numbers',
            type: 'text',
            required: false,
            defaultValue: 'taxt',
          },
          {
            id: '59b723a9-00e2-493f-8d76-84ea71a178ee',
            name: 'Just_Text',
            label: 'Just Text',
            type: 'text',
            required: false,
            defaultValue: 'single line text',
            conditionallyShow: true,
            requiresAllConditionallyShowPredicates: true,
            conditionallyShowPredicates: [
              {
                elementId: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
                type: 'NUMERIC',
                operator: '<',
                value: 5,
              },
            ],
          },
        ],
        isAuthenticated: true,

        submissionEvents: [],
      })
    expect(func).toThrow('Referenced text type not one of number,calculation')
  })

  test('should allow REPEATABLESET conditional predicate type', () => {
    const result = formSchema.validate(
      {
        name: 'conditionally show element via number input',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b7',
            name: 'RepeatableSet',
            label: 'Repeatable Set',
            type: 'repeatableSet',
            required: false,
            elements: [
              {
                id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
                name: 'Numbers',
                label: 'Numbers',
                type: 'number',
                required: false,
                minNumber: 1,
                maxNumber: 6,
                defaultValue: 3,
              },
            ],
          },
          {
            id: '8e4d819b-97fa-438d-b613-a092d38c3b23',
            name: 'Text',
            label: 'Text',
            type: 'text',
            required: false,
            defaultValue: 'text',
            isDataLookup: false,
            isElementLookup: false,
            readOnly: false,
            conditionallyShow: true,
            requiresAllConditionallyShowPredicates: false,
            conditionallyShowPredicates: [
              {
                elementId: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b7',
                type: 'REPEATABLESET',
                repeatableSetPredicate: {
                  elementId: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
                  type: 'BETWEEN',
                  min: 2,
                  max: 5,
                },
              },
            ],
          },
        ],
        isAuthenticated: true,
      },

      {
        abortEarly: false,
      },
    )
    expect(result.error).toBe(undefined)
  })

  test('should NOT allow REPEATABLESET conditional predicate type in repeatableSetPredicate', () => {
    const result = formSchema.validate(
      {
        name: 'conditionally show element via number input',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b7',
            name: 'RepeatableSet',
            label: 'Repeatable Set',
            type: 'repeatableSet',
            required: false,
            elements: [
              {
                id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
                name: 'Numbers',
                label: 'Numbers',
                type: 'number',
                required: false,
                minNumber: 1,
                maxNumber: 6,
                defaultValue: 3,
              },
            ],
          },
          {
            id: '8e4d819b-97fa-438d-b613-a092d38c3b23',
            name: 'Text',
            label: 'Text',
            type: 'text',
            required: false,
            defaultValue: 'text',
            isDataLookup: false,
            isElementLookup: false,
            readOnly: false,
            conditionallyShow: true,
            requiresAllConditionallyShowPredicates: false,
            conditionallyShowPredicates: [
              {
                elementId: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b7',
                type: 'REPEATABLESET',
                repeatableSetPredicate: {
                  elementId: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
                  type: 'REPEATABLESET',
                },
              },
            ],
          },
        ],
        isAuthenticated: true,
      },

      {
        abortEarly: false,
      },
    )
    expect(result.error?.message).toBe(
      '"elements[1].conditionallyShowPredicates[0].repeatableSetPredicate.type" must be one of [OPTIONS, NUMERIC, VALUE, BETWEEN, FORM, ADDRESS_PROPERTY]',
    )
  })

  test('should throw error if referenced element does not exist in REPEATABLESET predicate', () => {
    const func = () =>
      validateFormThrowError({
        name: 'conditionally show element via number input',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b7',
            name: 'RepeatableSet',
            label: 'Repeatable Set',
            type: 'repeatableSet',
            required: false,
            elements: [
              {
                id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
                name: 'Numbers',
                label: 'Numbers',
                type: 'number',
                required: false,
                minNumber: 1,
                maxNumber: 6,
                defaultValue: 3,
              },
            ],
          },
          {
            id: '8e4d819b-97fa-438d-b613-a092d38c3b23',
            name: 'Text',
            label: 'Text',
            type: 'text',
            required: false,
            defaultValue: 'text',
            isDataLookup: false,
            isElementLookup: false,
            readOnly: false,
            conditionallyShow: true,
            requiresAllConditionallyShowPredicates: false,
            conditionallyShowPredicates: [
              {
                elementId: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b6',
                type: 'REPEATABLESET',
                repeatableSetPredicate: {
                  elementId: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
                  type: 'BETWEEN',
                  min: 2,
                  max: 5,
                },
              },
            ],
          },
        ],
        isAuthenticated: true,
      })

    expect(func).toThrow('Referenced elementId not found')
  })

  test('should throw error if referenced element incorrect type in REPEATABLESET predicate', () => {
    const func = () =>
      validateFormThrowError({
        name: 'conditionally show element via number input',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b5',
            name: 'info',
            label: 'Info',
            type: 'html',
            defaultValue: '<div>Hello</div>',
          },
          {
            id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b7',
            name: 'RepeatableSet',
            label: 'Repeatable Set',
            type: 'repeatableSet',
            required: false,
            elements: [
              {
                id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
                name: 'Numbers',
                label: 'Numbers',
                type: 'number',
                required: false,
                minNumber: 1,
                maxNumber: 6,
                defaultValue: 3,
              },
            ],
          },
          {
            id: '8e4d819b-97fa-438d-b613-a092d38c3b23',
            name: 'Text',
            label: 'Text',
            type: 'text',
            required: false,
            defaultValue: 'text',
            isDataLookup: false,
            isElementLookup: false,
            readOnly: false,
            conditionallyShow: true,
            requiresAllConditionallyShowPredicates: false,
            conditionallyShowPredicates: [
              {
                elementId: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b5',
                type: 'REPEATABLESET',
                repeatableSetPredicate: {
                  elementId: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
                  type: 'BETWEEN',
                  min: 2,
                  max: 5,
                },
              },
            ],
          },
        ],
        isAuthenticated: true,
      })

    expect(func).toThrow('Referenced html type not a repeatableSet')
  })

  test('should throw error if referenced element does not exist in REPEATABLESET repeatableSetPredicate', () => {
    const func = () =>
      validateFormThrowError({
        name: 'conditionally show element via number input',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b7',
            name: 'RepeatableSet',
            label: 'Repeatable Set',
            type: 'repeatableSet',
            required: false,
            elements: [
              {
                id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
                name: 'Numbers',
                label: 'Numbers',
                type: 'number',
                required: false,
                minNumber: 1,
                maxNumber: 6,
                defaultValue: 3,
              },
            ],
          },
          {
            id: '8e4d819b-97fa-438d-b613-a092d38c3b23',
            name: 'Text',
            label: 'Text',
            type: 'text',
            required: false,
            defaultValue: 'text',
            isDataLookup: false,
            isElementLookup: false,
            readOnly: false,
            conditionallyShow: true,
            requiresAllConditionallyShowPredicates: false,
            conditionallyShowPredicates: [
              {
                elementId: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b7',
                type: 'REPEATABLESET',
                repeatableSetPredicate: {
                  elementId: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b0',
                  type: 'BETWEEN',
                  min: 2,
                  max: 5,
                },
              },
            ],
          },
        ],
        isAuthenticated: true,
      })

    expect(func).toThrow('Referenced elementId not found')
  })

  test.only('should throw error if referenced element incorrect in REPEATABLESET repeatableSetPredicate', () => {
    const func = () =>
      validateFormThrowError({
        name: 'conditionally show element via number input',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b7',
            name: 'RepeatableSet',
            label: 'Repeatable Set',
            type: 'repeatableSet',
            required: false,
            elements: [
              {
                id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
                name: 'Numbers',
                label: 'Numbers',
                type: 'text',
                required: false,
              },
            ],
          },
          {
            id: '8e4d819b-97fa-438d-b613-a092d38c3b23',
            name: 'Text',
            label: 'Text',
            type: 'text',
            required: false,
            defaultValue: 'text',
            isDataLookup: false,
            isElementLookup: false,
            readOnly: false,
            conditionallyShow: true,
            requiresAllConditionallyShowPredicates: false,
            conditionallyShowPredicates: [
              {
                elementId: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b7',
                type: 'REPEATABLESET',
                repeatableSetPredicate: {
                  elementId: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
                  type: 'BETWEEN',
                  min: 2,
                  max: 5,
                },
              },
            ],
          },
        ],
        isAuthenticated: true,
      })

    expect(func).toThrow('Referenced text type not one of number,calculation')
  })

  test('Should allow FORM type predicates', () => {
    const result = formSchema.validate(
      {
        name: 'conditionally show element via number input',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b7',
            name: 'Form',
            type: 'form',
            formId: 1,
          },
          {
            id: '8e4d819b-97fa-438d-b613-a092d38c3b23',
            name: 'Text',
            label: 'Text',
            type: 'text',
            required: false,
            defaultValue: 'text',
            isDataLookup: false,
            isElementLookup: false,
            readOnly: false,
            conditionallyShow: true,
            requiresAllConditionallyShowPredicates: false,
            conditionallyShowPredicates: [
              {
                elementId: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b7',
                type: 'FORM',
                predicate: {
                  elementId: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
                  type: 'NUMERIC',
                  operator: '>',
                  value: 1,
                },
              },
            ],
          },
        ],
        isAuthenticated: true,
      },

      {
        abortEarly: false,
      },
    )
    expect(result.error?.message).toBe(undefined)
  })

  test('Should validate predicates within FORM type predicates', () => {
    const result = formSchema.validate(
      {
        name: 'conditionally show element via number input',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b7',
            name: 'Form',
            type: 'form',
            formId: 1,
          },
          {
            id: '8e4d819b-97fa-438d-b613-a092d38c3b23',
            name: 'Text',
            label: 'Text',
            type: 'text',
            required: false,
            defaultValue: 'text',
            isDataLookup: false,
            isElementLookup: false,
            readOnly: false,
            conditionallyShow: true,
            requiresAllConditionallyShowPredicates: false,
            conditionallyShowPredicates: [
              {
                elementId: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b7',
                type: 'FORM',
                predicate: {
                  elementId: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b1',
                  type: 'INVALID_TYPE',
                },
              },
            ],
          },
        ],
        isAuthenticated: true,
      },

      {
        abortEarly: false,
      },
    )
    expect(result.error?.message).toBe(
      '"elements[1].conditionallyShowPredicates[0].predicate.type" must be one of [REPEATABLESET, OPTIONS, NUMERIC, VALUE, BETWEEN, FORM, ADDRESS_PROPERTY]',
    )
  })

  test('Should allow ADDRESS_PROPERTY type predicates', () => {
    const result = formSchema.validate(
      {
        name: 'conditionally show element via number input',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b7',
            label: 'Address',
            name: 'Address',
            type: 'pointAddress',
          },
          {
            id: '8e4d819b-97fa-438d-b613-a092d38c3b23',
            name: 'Text',
            label: 'Text',
            type: 'text',
            required: false,
            defaultValue: 'text',
            isDataLookup: false,
            isElementLookup: false,
            readOnly: false,
            conditionallyShow: true,
            requiresAllConditionallyShowPredicates: false,
            conditionallyShowPredicates: [
              {
                elementId: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b7',
                type: 'ADDRESS_PROPERTY',
                definition: {
                  property: 'IS_PO_BOX_ADDRESS',
                  value: true,
                },
              },
            ],
          },
          {
            id: '8e4d819b-97fa-438d-b613-a092d38c3b24',
            name: 'Text2',
            label: 'Text',
            type: 'text',
            required: false,
            defaultValue: 'text',
            isDataLookup: false,
            isElementLookup: false,
            readOnly: false,
            conditionallyShow: true,
            requiresAllConditionallyShowPredicates: false,
            conditionallyShowPredicates: [
              {
                elementId: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b7',
                type: 'ADDRESS_PROPERTY',
                definition: {
                  property: 'STATE_EQUALITY',
                  value: 'NSW',
                },
              },
            ],
          },
        ],
        isAuthenticated: true,
      },

      {
        abortEarly: false,
      },
    )
    expect(result.error?.message).toBe(undefined)
  })

  test('Should validate conditions within ADDRESS_PROPERTY type', () => {
    const result = formSchema.validate(
      {
        name: 'conditionally show element via number input',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b7',
            label: 'Address',
            name: 'Address',
            type: 'pointAddress',
          },
          {
            id: '8e4d819b-97fa-438d-b613-a092d38c3b23',
            name: 'Text',
            label: 'Text',
            type: 'text',
            required: false,
            defaultValue: 'text',
            isDataLookup: false,
            isElementLookup: false,
            readOnly: false,
            conditionallyShow: true,
            requiresAllConditionallyShowPredicates: false,
            conditionallyShowPredicates: [
              {
                elementId: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b7',
                type: 'ADDRESS_PROPERTY',
                definition: {
                  property: 'IS_PO_BOX_ADDRESS',
                  value: 'NSW',
                },
              },
            ],
          },
          {
            id: '8e4d819b-97fa-438d-b613-a092d38c3b24',
            name: 'Text2',
            label: 'Text',
            type: 'text',
            required: false,
            defaultValue: 'text',
            isDataLookup: false,
            isElementLookup: false,
            readOnly: false,
            conditionallyShow: true,
            requiresAllConditionallyShowPredicates: false,
            conditionallyShowPredicates: [
              {
                elementId: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b7',
                type: 'ADDRESS_PROPERTY',
                definition: {
                  property: 'STATE_EQUALITY',
                  value: true,
                },
              },
            ],
          },
        ],
        isAuthenticated: true,
      },

      {
        abortEarly: false,
      },
    )
    expect(result.error?.message).toBe(
      '"elements[1].conditionallyShowPredicates[0].definition.value" must be a boolean. "elements[2].conditionallyShowPredicates[0].definition.value" must be a string',
    )
  })

  test('should validate referenced element exists in ADDRESS_PROPERTY predicate', () => {
    const func = () =>
      validateFormThrowError({
        name: 'conditionally show element via number input',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b7',
            label: 'Address',
            name: 'address',
            type: 'pointAddress',
          },
          {
            id: '8e4d819b-97fa-438d-b613-a092d38c3b23',
            name: 'Text',
            label: 'Text',
            type: 'text',
            required: false,
            defaultValue: 'text',
            isDataLookup: false,
            isElementLookup: false,
            readOnly: false,
            conditionallyShow: true,
            requiresAllConditionallyShowPredicates: false,
            conditionallyShowPredicates: [
              {
                elementId: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b6',
                type: 'ADDRESS_PROPERTY',
                definition: {
                  property: 'IS_PO_BOX_ADDRESS',
                  value: true,
                },
              },
            ],
          },
        ],
        isAuthenticated: true,
      })

    expect(func).toThrow('Referenced elementId not found')
  })

  test('should validate referenced element is correct type in ADDRESS_PROPERTY predicate', () => {
    const func = () =>
      validateFormThrowError({
        name: 'conditionally show element via number input',
        description: 'string',
        formsAppEnvironmentId: 1,
        formsAppIds: [1],
        organisationId: 'ORGANISATION_00000000001',
        postSubmissionAction: 'FORMS_LIBRARY',
        isMultiPage: false,
        elements: [
          {
            id: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b7',
            label: 'Number',
            name: 'number',
            type: 'number',
          },
          {
            id: '8e4d819b-97fa-438d-b613-a092d38c3b23',
            name: 'Text',
            label: 'Text',
            type: 'text',
            required: false,
            defaultValue: 'text',
            isDataLookup: false,
            isElementLookup: false,
            readOnly: false,
            conditionallyShow: true,
            requiresAllConditionallyShowPredicates: false,
            conditionallyShowPredicates: [
              {
                elementId: 'b941ea2d-965c-4d40-8c1d-e5a231fc18b7',
                type: 'ADDRESS_PROPERTY',
                definition: {
                  property: 'IS_PO_BOX_ADDRESS',
                  value: true,
                },
              },
            ],
          },
        ],
        isAuthenticated: true,
      })

    expect(func).toThrow(
      'Referenced number type not one of pointAddress,geoscapeAddress',
    )
  })
})
