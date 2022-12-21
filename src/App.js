import './App.css';
import React from 'react';
import Wrangle from './WrangleData.js';
import GetDate from './GetDate.js';
import Card from './Card.js';
import Title from './title.png';
import Subtitle from './subtitle.png';
import { } from 'dotenv/config';

const AUTH = process.env.REACT_APP_AUTH;
let token = '',
  returnedFromAPI = [];

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      finalList: [],
      hipsterList: [],
      indie: false,
      loading: <p className="date">Please wait for albums to load...</p>,
      standardColor: "#AD7D2D",
      indieColor: "gray",
      standardCursor: "default",
      indieCursor: "pointer"
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
      if (returnedFromAPI.length === 20) this.compile(hipster);
    }

    userAction(offset, indie);
  };

  compile = ((hipster) => {
    let data = {},
      items = [],
      linksToDedup = {};
    for (let i = 0; i < returnedFromAPI.length; i++) items = items.concat(returnedFromAPI[i].albums.items);
    for (let i = 0; i < items.length; i++) {
      if (items[i]?.images[1] === undefined || linksToDedup[items[i].external_urls.spotify]) {
        items.splice(i, 1);
        i--;
        continue;
      }
      linksToDedup[items[i].external_urls.spotify] = 1;
      let obj = {};
      obj.image = items[i].images[1].url;
      obj.artist = items[i].artists[0].name;
      obj.album = items[i].name;
      obj.link = items[i].external_urls.spotify;
      obj.artistLink = items[i].artists[0].external_urls.spotify;
      obj.tracks = items[i].total_tracks;
      obj.artistId = items[i].artists[0].id
      obj.type = items[i].type;
      if (obj.artist.length > 26) obj.artist = obj.artist.slice(0, 25) + '...';
      if (obj.album.length > 26) obj.album = obj.album.slice(0, 25) + '...';
      items[i].release_date = items[i].release_date.replace(/-/g, '');
      data[items[i].release_date] = data[items[i].release_date] || [];
      data[items[i].release_date].push(obj);
    }
    if (hipster) {
      this.setState({
        hipsterList: Wrangle(data)
      });
    }
    else {
      this.setState({
        finalList: Wrangle(data),
        loading: null,
      });
    }
  });

  indie = ((indieClick) => {
    if (this.state.indie === indieClick) return;
    if (this.state.hipsterList.length === 0) {
      returnedFromAPI = [];
      for (let i = 0; i <= 950; i += 50) this.callAPI(i, '+tag:hipster');
    }
    this.setState({
      indie: !this.state.indie,
      standardColor: this.state.indieColor,
      indieColor: this.state.standardColor,
      standardCursor: this.state.indieCursor,
      indieCursor: this.state.standardCursor
    });
  })

  listToDisplay = (() => {
    return this.state.indie ? this.state.hipsterList : this.state.finalList;
  })

  render() {
    return (
      <div className="App">
        <div className="floating">
          <button className="mode" style={{ color: this.state.standardColor, cursor: this.state.standardCursor }} onClick={() => this.indie(false)}>Standard</button>
          <button className="mode" style={{ color: this.state.indieColor, cursor: this.state.indieCursor }} onClick={() => this.indie(true)}>Indie Mode</button>
        </div>
        <img className="title title-main" src={Title} alt="update my ear" />
        <img className="title" src={Subtitle} alt="new releases from Spotify" />
        {this.state.loading}
        {this.listToDisplay().map(item => {
          for (let key in item) {
            return (
              <div key={`childkey${key}`}>
                <p className="date">{GetDate(key, item[key].length)}</p>
                <div className="grid">
                  {item[key].map(track => {
                    return (
                      <Card key={`childkey${track.link + key}`} track={track} />
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
