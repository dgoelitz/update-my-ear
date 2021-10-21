import './App.css';
import React from 'react';
import Wrangle from './WrangleData.js';
import GetDate from './GetDate.js';
import Card from './Card.js';
import Title from './title.png';
import Subtitle from './subtitle.png';
import {} from 'dotenv/config';

const AUTH = process.env.REACT_APP_AUTH;
let token = '',
returnedFromAPI = [];

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      stats: {},
      data: {},
      finalList: [],
      loading: <p className="date">Please wait for albums to load...</p>,
    };
    this.indie = this.indie.bind(this);
  }

  componentDidMount() {
    this.getToken();
  }

  getToken() {
    let urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");

    const tokenOptions = {
      method: 'POST',
      headers: {
        'Authorization': AUTH,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: urlencoded,
    }

    const getAuth = async () => {
      let url = 'https://accounts.spotify.com/api/token';
      const response = await fetch(url, tokenOptions);
      const myJson = await response.json();
      token = 'Bearer ' + myJson.access_token;

      for (let i = 0; i <= 950; i += 50) this.callAPI(i, '');
    }

    if (!token) getAuth();
  }

  callAPI(offset, indie) {
    const userAction = async (offset, hipster) => {
      const apiCallOptions = {
        headers: {
          'Authorization': token,
        },
      };
      let url = `https://api.spotify.com/v1/search?query=+tag:new${hipster}&type=album&offset=${offset}&limit=50`;
      const response = await fetch(url, apiCallOptions);
      const myJson = await response.json();
      returnedFromAPI.push(myJson);
      if (returnedFromAPI.length === 20) this.compile();
    }

    userAction(offset, indie);
  };

  compile = (() => {
    let data = {};
    let stats = {};
    let statsArr = [];
    let items = [];
    for (let i = 0; i < returnedFromAPI.length; i++) items = items.concat(returnedFromAPI[i].albums.items);
    for (let i = 0; i < items.length; i++) if (items[i] === null) items.splice(i, 1);
    for (let i = 0; i < items.length; i++) items[i].release_date = items[i].release_date.replace(/-/g, '');
    for (let i = 0; i < items.length; i++) stats[items[i].release_date] = (stats[items[i].release_date] || 0) + 1;
    for (let key in stats) statsArr.push([key, stats[key]]);
    statsArr.sort((a, b) => b[0] - a[0]);
    this.setState({ stats: stats });
    for (let i = 0; i < items.length; i++) {
      let obj = {};
      obj.image = items[i].images[0].url;
      obj.artist = items[i].artists[0].name;
      obj.album = items[i].name;
      obj.link = items[i].external_urls.spotify;
      obj.artistLink = items[i].artists[0].external_urls.spotify;
      obj.tracks = items[i].total_tracks;
      if (obj.artist.length > 26) obj.artist = obj.artist.slice(0, 25) + '...';
      if (obj.album.length > 26) obj.album = obj.album.slice(0, 25) + '...';
      data[items[i].release_date] = data[items[i].release_date] || [];
      data[items[i].release_date].push(obj);
    }
      this.setState({ 
        data: data,
        finalList: Wrangle(data),
        loading: null,
      });
  });

  indie = (() => {
    this.callAPI(0, '+tag:hipster');
  })

  render() {
    return (
      <div className="App">
        <img className="title title-main" src={Title} alt="update my ear" />
        <img className="title" src={Subtitle} alt="update my ear" />
        {this.state.loading}
        {/* <button className="button" onClick={this.indie}>Indie Mode</button> */}
        {this.state.finalList.map(item => {
          for (let key in item) {
            return (
              <div>
                <p className="date">{GetDate(key, this.state.data[key].length)}</p>
                <div className="grid">
                  {item[key].map(track => {
                    return (
                      <Card track={track} />
                    )
                  })}
                </div>
              </div>
            )
          }
          return <div></div>;
        })}
      </div>
    );
  }
}

export default App;
