export interface ProjectWithDomainProps extends ProjectProps {
  domains: DomainProps[]
  primaryDomain?: DomainProps
}

export interface UserProps {
  id: string
  name: string
  email: string
  image?: string
  createdAt: Date
  role: "owner" | "member"
  projects?: { projectId: string }[]
}

export type DomainVerificationStatusProps = "Valid Configuration" | "Invalid Configuration" | "Pending Verification" | "Domain Not Found" | "Unknown Error"

export interface DomainProps {
  slug: string
  verified: boolean
  primary: boolean
  target?: string
  type: "redirect" | "rewrite"
}
