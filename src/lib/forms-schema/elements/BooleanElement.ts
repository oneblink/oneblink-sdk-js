import Joi from 'joi'
import {
  id,
  name,
  label,
  hint,
  readOnly,
  required,
  requiredMessage,
  conditionallyShowSchemas,
  lookupSchemas,
  customCssClasses,
} from '../property-schemas'

export const type = 'boolean'

export default Joi.object({
  id,
  name,
  label,
  hint,
  readOnly,
  required,
  requiredMessage,
  ...conditionallyShowSchemas,
  ...lookupSchemas,
  defaultValue: Joi.boolean().default(false),
  customCssClasses,
})
