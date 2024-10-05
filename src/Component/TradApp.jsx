import React, { useEffect, useState } from 'react';
import "../Styles/TradApp.css";

export default function TradApp() {
    const [inputValue, setInputValue] = useState("");
    const [data, setData] = useState([]);
    const [sortOrder, setSortOrder] = useState({ mktCap: null, percentage: null });

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch(
                    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false`
                );
                const json = await response.json();
                setData(json);
            } catch {
                console.log("Error");
            }
        };
        getData();
    }, []);

    // Filter data based on input value
    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(inputValue.toLowerCase()) ||
        item.symbol.toLowerCase().includes(inputValue.toLowerCase())
    );

    // Sort by market cap
    const sortByMarketCap = () => {
        const sorted = [...data].sort((a, b) => {
            if (sortOrder.mktCap === 'asc') {
                return a.market_cap - b.market_cap; // Ascending order
            } else {
                return b.market_cap - a.market_cap; // Descending order
            }
        });
        setData(sorted);
        setSortOrder({ mktCap: sortOrder.mktCap === 'asc' ? 'desc' : 'asc', percentage: null });
    };

    // Sort by percentage change in 24h
    const sortByPercentage = () => {
        const sorted = [...data].sort((a, b) => {
            if (sortOrder.percentage === 'asc') {
                return a.price_change_percentage_24h - b.price_change_percentage_24h; // Ascending order
            } else {
                return b.price_change_percentage_24h - a.price_change_percentage_24h; // Descending order
            }
        });
        setData(sorted);
        setSortOrder({ percentage: sortOrder.percentage === 'asc' ? 'desc' : 'asc', mktCap: null });
    };

    return (
        <>
            <div className="container">
                <div className="nav-bar">
                    <input 
                        type="search" 
                        placeholder='Search By Name or Symbol' 
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)} 
                    />
                    <button onClick={sortByMarketCap}>Sort By Mkt Cap</button>
                    <button onClick={sortByPercentage}>Sort By Percentage</button>
                </div>
                <div className="card">
                    {filteredData.length > 0 ? (
                        filteredData.map((item) => {
                            return (
                                <div className="card-item" key={item.id}>
                                    <img src={item.image} alt={item.name} />
                                    <p style={{ color: "white" }}>{item.name}</p>
                                    <p>{item.symbol}</p>
                                    <p>${item.current_price}</p>
                                    <p>${item.total_volume}</p>
                                    <p className='percentage' style={{ color: item.price_change_percentage_24h >= 0 ? "green" : "red" }}>
                                        {item.price_change_percentage_24h}%
                                    </p>
                                    <p>Mkt Cap: ${item.market_cap}</p>
                                </div>
                            );
                        })
                    ) : (
                        <h1>Not Found</h1>
                    )}
                </div>
            </div>
        </>
    );
}
