import dns from 'dns';
async function getDomainMx(domain: string): Promise<dns.MxRecord[]> {
    return await new Promise((resolve, reject) =>
        dns.resolveMx(domain, (err, addresses) => {
            if (err || !addresses) return resolve([] as dns.MxRecord[])
            resolve(addresses)
        })
    )
}

export const getBestMx = async (domain: string): Promise<dns.MxRecord[] | null> => {
    const addresses = (await getDomainMx(domain)).sort((a, b) => a.priority - b.priority);


    // for (let i = 0; i < addresses.length; i++) {
    //     if (addresses[i].priority < addresses[bestIndex].priority) {
    //         bestIndex = i
    //     }
    // }

    // return addresses[bestIndex]
    return addresses.length === 0 ? null : addresses
}
