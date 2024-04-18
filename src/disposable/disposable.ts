import domains from 'disposable-email-domains'
import { Result } from '../varifyResult/verifyResult'
const disposableDomains: Set<string> = new Set(domains)

export const checkDisposable = async (domain: string): Promise<Result> => {
    return disposableDomains.has(domain) ? {
        valid: false, reason: "Email was created using a disposable email service"
    } :
        { valid: true };
}
