import generateTenant from '../lib/generate-tenant'
import { TenantConfiguration } from '../lib/types'
import generateForms from './Forms'
import generateFormsApps from './FormsApps'
import generateJobs from './Jobs'
import generateKeys from './Keys'
import generateOrganisations from './Organisations'
import generateTeamMembers from './TeamMembers'
import generatePDF from './PDF'
import generateSendEmail, {
  SendEmailOptions,
  SendEmailResult,
} from './sendEmail'
import generateApprovals from './Approvals'

export { SendEmailOptions, SendEmailResult }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (tenantConfiguration: TenantConfiguration) => {
  const tenant = generateTenant(tenantConfiguration)

  return {
    Forms: generateForms(tenant),
    FormsApps: generateFormsApps(tenant),
    Jobs: generateJobs(tenant),
    Keys: generateKeys(tenant),
    Organisations: generateOrganisations(tenant),
    TeamMembers: generateTeamMembers(tenant),
    PDF: generatePDF(tenant),
    sendEmail: generateSendEmail(tenant),
    Approvals: generateApprovals(tenant),
  }
}
