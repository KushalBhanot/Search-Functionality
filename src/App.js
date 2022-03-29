import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import './styles/App.scss';
import Coin from './components/Coin';
import { debounce } from 'lodash';
import Loader from './components/Loader';

function App() {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('');
  const coinsPerPage = 5;
  const [nextCoins, setNextCoins] = useState(5);
  const [nextFilteredCoins, setNextFilteredCoins] = useState(5);
  const [status, setStatus] = useState('idle');
  const [showLoadBtn, setShowLoadBtn] = useState(false);

  // cache object
  const cache = useRef({});

  let cancelToken;

  useEffect(() => {
    if (!search) return;
    if (search.length > 2) {
      //Check if there are any previous pending requests
      if (typeof cancelToken != typeof undefined) {
        cancelToken.cancel("Operation canceled due to new request.")
      }

      //Save the cancel token for the current request
      cancelToken = axios.CancelToken.source()

      setStatus('fetching');
      setTimeout(() => {
        console.log("Loading timer for 2 seconds");
        if (cache.current[search]) {
          setCoins(cache.current[search]);
          setStatus('fetched');
        }
        else {
          axios
            .get(
              'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&page=1&sparkline=false',
              { cancelToken: cancelToken.token }
            )
            .then(res => {
              setShowLoadBtn(true);
              cache.current[search] = res.data;
              setCoins(res.data);
              setStatus('fetched');
              console.log("Cached responses will expire in 2 minutes");
              setTimeout(() => {
                cache.current = {};
                console.log("Your cache has expired.");
                console.log(cache.current);
              }, 120000);
            })
            .catch(error => console.log(error));
        }
      }, 2000);
    }
  }, [search]);

  const deb = useCallback(
    debounce((text) => setSearch(text), 1000),
    []
  );

  const handleChange = (text) => {
    deb(text);
  };

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleShowMoreCoins = () => {
    search.length > 2 ? setNextFilteredCoins(nextFilteredCoins + coinsPerPage)
      : setNextCoins(nextCoins + coinsPerPage);
  }

  return (
    <div className='coin-app'>
      <div className='coin-search'>
        <h1 className='coin-text'>🔍<a href='/'>  cryptocase</a></h1>
        <form>
          <input
            className='coin-input'
            type='text'
            onChange={(e) => handleChange(e.target.value)}
            placeholder='Search for crypto-coin'
          />
        </form>
      </div>
      <div className='coin-results-wrapper'>
        {status == 'fetching' ?
          ([...Array(coinsPerPage)].map((e, i) => <Loader key={i} />))
          : (search.length > 2
            ? filteredCoins.slice(0, nextFilteredCoins).map(coin => {
              return (
                <Coin key={coin.id}
                  name={coin.name}
                  price={coin.current_price}
                  symbol={coin.symbol}
                  marketcap={coin.total_volume}
                  image={coin.image}
                  priceChange={coin.price_change_percentage_24h}
                  low24h={coin.low_24h}
                  high24h={coin.high_24h}
                />
              );
            })
            : coins.slice(0, nextCoins).map(coin => {
              return (
                <Coin key={coin.id}
                  name={coin.name}
                  price={coin.current_price}
                  symbol={coin.symbol}
                  marketcap={coin.total_volume}
                  image={coin.image}
                  priceChange={coin.price_change_percentage_24h}
                  low24h={coin.low_24h}
                  high24h={coin.high_24h}
                />
              );
            }))
        }
      </div>
      {console.log(status)}
      {console.log(coins.length)}
      {console.log(filteredCoins.length)}

      {showLoadBtn && ((nextFilteredCoins < filteredCoins.length)
        && (nextCoins < coins.length)) ?
        (<div className="load-more__wrapper">
          <div className='load-more__container'>
            <button className='load-more__button' onClick={handleShowMoreCoins}>Load more coins</button>
          </div>
        </div>)
        : <></>}
    </div>
  );
}

export default App;