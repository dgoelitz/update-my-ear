import './App.css';
import React from 'react';
import Wrangle from './WrangleData.js';
import GetDate from './GetDate.js';
import Card from './Card.js';
import Title from './title.png';
import Subtitle from './subtitle.png';
const token = "Bearer BQDmqSLvoFf-nMwpeRGd1CxrSpCWxwy99ElXIH378OILxssoDq2xHATgYVP_WXYfx3eWOjHWgEBO3fhcJOU";

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      stats: {},
      data: {},
      finalList: []
    };
    this.indie = this.indie.bind(this);
  }

  componentDidMount() {
    this.callAPI(0, '');
  }

  callAPI(offset, indie) {
    const defaultOptions = {
      headers: {
        'Authorization': token,
      },
    };

    const userAction = async (offset, hipster) => {
      let url = `https://api.spotify.com/v1/search?query=+tag:new${hipster}&type=album&offset=${offset}&limit=50`;
      const response = await fetch(url, defaultOptions);
      const myJson = await response.json();
      this.compile(myJson, offset);
    }

    userAction(offset, indie);
  };

  compile = ((returnedFromAPI, offset) => {
    console.log(returnedFromAPI);
    let data = this.state.data;
    let stats = this.state.stats;
    let statsArr = [];
    // let genre = [];
    const items = returnedFromAPI.albums.items;
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
      data[items[i].release_date] = data[items[i].release_date] || [];
      data[items[i].release_date].push(obj);
    }
    this.setState({ data: data });
    if (offset < 950) {
      offset += 50;
      this.callAPI(offset, '');
    }
    else {
      this.setState({ finalList: Wrangle(this.state.data) });
    }
  });

  indie = (() => {
    this.callAPI(0, '+tag:hipster');
  })

  render() {
    return (
      <div className="App">
        <img className="title" src={Title} alt="update my ear" />
        <img className="title" src={Subtitle} alt="update my ear" />
        <button className="button" onClick={this.indie}>Indie Mode</button>
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
