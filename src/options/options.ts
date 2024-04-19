export type Options = {
    sender: string;
    validateRegex: boolean;
    validateMx: boolean;
    validateDisposable: boolean;
    validateSMTP: boolean;
    validateSMTPdeep?: boolean,
    timeout: number;
    port: number,
}
export type EmailValidatorOption = Partial<Options>;

const emailDefaultOption: EmailValidatorOption = {
    validateRegex: true,
    validateDisposable: true,
    validateMx: false,
    validateSMTP: false,
    validateSMTPdeep: false,
    timeout: 8000,
    port: 25,
}



export function GenerateDefaultOptions(options: EmailValidatorOption): Options {
    const incoming = options;
    if (options.validateSMTP) {
        incoming.validateMx = true;
    }
    if (options.validateSMTPdeep) {
        incoming.validateSMTP = true;
        incoming.validateMx = true;
    }
    return { ...emailDefaultOption, ...incoming } as Options
}