import React from 'react';
import '../styles/Coin.scss';

const Coin = ({
    name,
    price,
    symbol,
    marketcap,
    image,
    priceChange,
    low24h,
    high24h
}) => {
    return (
        <div className='coin-item'>

            <img src={image} alt={name} className="coin-item__thumbnail" />

            <div className="coin-item__main">
                <h1 className="name">{name} <span>({symbol})</span> </h1>
                <div className="low-high">
                    <div className="low">
                        Low 24h <span>{low24h?.toFixed(2)}</span></div>
                    <div className="high">High 24h <span>{high24h?.toFixed(2)}</span></div>
                </div>
            </div>

            <div className="coin-item__market-cap">
                <h3 className="label">Market cap.</h3>
                <h4>{marketcap}</h4>
            </div>

            <div className="coin-item__price">
                <h3>$ {price}</h3>
                <h4 className={`price-change ${priceChange < 0 ? 'negative' : 'positive'}`}>
                    {priceChange.toFixed(2)}%
                </h4>
            </div>
        </div>
    );
};

export default Coin;