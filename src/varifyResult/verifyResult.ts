const verifySteps = ['regex', 'disposable', 'mx', 'smtp'] as const
export type Result = {
    valid: boolean,
    reason?: string
}
export type SubVerifyResult = typeof verifySteps[number]
export type VerifyResult = {
    [K in SubVerifyResult]?: Result;
}
