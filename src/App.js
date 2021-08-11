// import logo from './logo.svg';
import './App.css';
import React from 'react';
// const axios = require('axios');
// const server = 'http://localhost:3000';

// const express = require("express");
// const app = express();
// const request = require('request');
// const path = require("path");
// const PORT = 3000;
const token = "Bearer BQBymMAhiB1s9sPYCTx9Ga2ZggX4ys5hy0L7rsTVxIX-O1gEw0-kvYQ07RywLfNF220OUeVMQdkZc3-s0Ho";
// const queries = require("./queries");

// app.use(express.static(path.join(__dirname, '/public')));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      stats: {},
      data: {},
      finalList: []
    };
  }

  componentDidMount() {



    console.log('bout to call da api');
    this.callAPI(0);

  }

  callAPI(offset) {
    // request('https://api.spotify.com/v1/search?q=%20year:2021&type=album', { Authorization: token }, (error, response, body) => {
    //   if (error) {
    //     console.error('error:', error);
    //   } else {
    //     body = JSON.parse(body);
    //     this.wrangle(body);
    //   }
    // });
    const defaultOptions = {
      headers: {
        'Authorization': token,
      },
    };
    const userAction = async (offset) => {
      let url = `https://api.spotify.com/v1/search?query=+tag:new&type=album&offset=${offset}&limit=50`;
      const response = await fetch(url, defaultOptions);
      const myJson = await response.json();
      this.compile(myJson, offset);
    }
    userAction(offset);
  };



  compile = ((returnedFromAPI, offset) => {
    console.log(returnedFromAPI);
    let data = this.state.data;
    let stats = this.state.stats;
    let statsArr = [];
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
      data[items[i].release_date] = data[items[i].release_date] || [];
      data[items[i].release_date].push(obj);
    }
    this.setState({ data: data });
    if (offset < 950) {
      console.log(statsArr);
      offset += 50;
      this.callAPI(offset);
    }
    else {
      console.log('final:', statsArr);
      this.wrangle();
    }
  });

  wrangle = (() => {
    let data = this.state.data;
    let list = [];
    for (let key in data) {
      let obj = {};
      obj[key] = [];
      for (let i = 0; i < data[key].length; i++) obj[key].push(data[key][i]);
      list.push(obj);
    }
    list.sort((a, b) => {
      for (let key in a) {
        for (let key2 in b) {
          return key2 - key;
        }
      }
    });
    console.log('data', data);
    console.log('list', list);
    this.setState({ finalList: list });
  });

  getDate = ((date) => {
    const months = {
      '01': 'Jan',
      '02': 'Feb',
      '03': 'Mar',
      '04': 'Apr',
      '05': 'May',
      '06': 'Jun',
      '07': 'Jul',
      '08': 'Aug',
      '09': 'Sep',
      '10': 'Oct',
      '11': 'Nov',
      '12': 'Dec'
    };
    let year = date.substr(0, 4);
    let month = months[date.substr(4, 2)];
    let day = date.substr(6, 2);
    let suffix = 'th';
    if (day[1] === '1') suffix = 'st';
    if (day[1] === '2') suffix = 'nd';
    if (day[1] === '3') suffix = 'rd';
    if (day[0] === '1') suffix = 'th';
    return `${month} ${day}${suffix}, ${year}`;
  });

  // final list... [{20210811: [{image: pic, artist: smw, album: socold, link: coolsite.com}, {}, ...]}, {20210810: [{etc}]}]


  // app.listen(PORT, () => {
  //   console.log(`server is running and listening on port ${PORT}`);
  // });

  render() {
    return (
      <div className="App">
        <h1>
          Update My Ear
        </h1>
        <h2>
          most recent spotify releases
        </h2>
        {this.state.finalList.map(item => {
          for (let key in item) {
            return (
              <div>
                <p>{this.getDate(key)}</p>
                {item[key].map(track => {
                  return (
                    <div>
                      <img alt={track.album} src={track.image}></img>
                      <p>{track.artist}</p>
                      <a href={track.link}>{track.album}</a>
                    </div>
                  )
                })}
              </div>
            )
          }
        })}
      </div>
    );
  }
}

export default App;
