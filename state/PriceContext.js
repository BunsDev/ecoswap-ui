// Files and modules

import axios from "axios"
import { createContext, useEffect, useState } from "react"

// Token price context

const PriceContext = createContext({})

// Token price context provider

const PriceContextProvider = ({ children }) => {
    // Update token prices

    const [ prices, setPrices ] = useState({})

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const prices = {}
                const markets = (await axios("https://api.binance.com/api/v3/ticker/price")).data
                for (const market of markets) {
                    if (market.symbol.endsWith("USDT")) {
                        prices[market.symbol.slice(0, -4)] = +market.price
                    }
                }
                setPrices(prices)
            } catch(error) {
                console.error(error)
            }
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    // Component

    return (
        <PriceContext.Provider value={prices}>
            {children}
        </PriceContext.Provider>
    )
}

// Exports

export { PriceContextProvider }
export default PriceContext