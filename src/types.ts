import jwksClient from 'jwks-rsa'
export * from '@oneblink/types'

export type ConstructorOptions = {
  accessKey: string
  secretKey: string
}

export type AWSCredentials = {
  AccessKeyId: string
  SecretAccessKey: string
  SessionToken: string
}

export type FormRetrievalData = {
  credentials: AWSCredentials
  s3: {
    bucket: string
    key: string
    region: string
  }
}

export type PreFillMeta = FormRetrievalData & {
  preFillFormDataId: string
}

export type BaseSearchResult = {
  meta: {
    limit: null
    offset: null
    nextOffset: null
  }
}

export type TenantBase = {
  awsRegion: string
}

export type TenantEnvironment = {
  apiOrigin: string
  pdfOrigin: string
  jwtIssuer: string
}

export type TenantConfiguration = TenantBase & {
  test: TenantEnvironment
  prod: TenantEnvironment
}

export type Tenant = TenantBase &
  TenantEnvironment & {
    jwksInstance: jwksClient.JwksClient
  }
