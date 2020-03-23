import { DetectModifyUrlConfig, SiteConfig } from '@urltools/utils/lib/types/detectModifyUrl'

export type ModifiedUrl = {
  url: string
  match?: SiteConfig
}

export type DetectModifyUrl = (config: DetectModifyUrlConfig) => (url: string) => ModifiedUrl
