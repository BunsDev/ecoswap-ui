// Files and modules

import { useEffect, useState } from "react"

// Chain tokens hook

function useTokens(chainId) {
    // Tokens state data

    const tokenList = require(`../data/tokens/${chainId}.json`)
    for (const token of tokenList) {
        token.default = true
    }
    const [ tokens, setTokens ] = useState(tokenList)

    // Get external tokens from local storage

    useEffect(() => {
        // Initialize external token store

        if (!localStorage.externalTokens) {
            localStorage.externalTokens = JSON.stringify({ [chainId]: [] })
        } else {
            try {
                const savedTokens = JSON.parse(localStorage.externalTokens)
                if (!savedTokens[chainId]) {
                    savedTokens[chainId] = []
                    localStorage.externalTokens = JSON.stringify(savedTokens)
                }
            } catch {
                localStorage.externalTokens = JSON.stringify([])
            }
        }

        // Load external tokens

        const externalTokens = JSON.parse(localStorage.externalTokens)[chainId]
        setTokens([ ...tokens, ...externalTokens ])
    }, [])

    // Update local storage on token changes

    useEffect(() => {
        const externalTokens = tokens.filter(token => token.external && token.added)
        if (!localStorage.externalTokens) {
            localStorage.externalTokens = JSON.stringify({ [chainId]: externalTokens })
        } else {
            try {
                const savedTokens = JSON.parse(localStorage.externalTokens)
                savedTokens[chainId] = externalTokens
                localStorage.externalTokens = JSON.stringify(savedTokens)
            } catch {
                localStorage.externalTokens = JSON.stringify({ [chainId]: externalTokens })
            }
        }
    }, [tokens])

    // Token data

    return [ tokens, setTokens ]
}

// Exports

export default useTokens