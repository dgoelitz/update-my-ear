const express = require("express");
const app = express();
const request = require('request');
const path = require("path");
const PORT = 3000;
const token = "Bearer BQC7WSaRZkmYhRcEunrU_iL2XX1DtVmgMHJlIhk3SoCFJ6QwfeZTjekrGMSFoOjyN7uhDKZb2srPAQakgrg";
// const queries = require("./queries");

// app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get('/api/2021', (req, res) => {
//   request('https://api.spotify.com/v1/search?q=%20year:2021&type=album', { Authorization: token }, (error, response, body) => {
//     if (error) {
//       console.error('error:', error);
//     } else {
//       body = JSON.parse(body);
//       wrangle(body);
//     }
//   });
// });

app.get('*', (req, res) => {
  console.log('welp wees tryin');
  console.log(`${__dirname}/public/index.html`);
  res.sendFile(path.join(__dirname+'/public/index.html'));
});

const wrangle = ((returnedFromAPI) => {
  console.log(returnedFromAPI);
  let stats = {};
  let statsArr = [];
  const items = returnedFromAPI.albums.items;
  for (let i = 0; i < items.length; i++) items[i].release_date = items[i].release_date.replace(/-/g, '');
  for (let i = 0; i < items.length; i++) stats[items[i].release_date] = (stats[items[i].release_date] || 0) + 1;
  for (let key in stats) statsArr.push([key, stats[key]]);
  statsArr.sort((a, b) => a[0] - b[0]);
  console.log(statsArr);
});

console.log('im scared');

app.listen(PORT, () => {
  console.log(`server is running and listening on port ${PORT}`);
});
