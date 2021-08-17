const Wrangle = ((data) => {
  let list = [];
  for (let key in data) {
    let obj = {};
    obj[key] = [];
    for (let i = 0; i < data[key].length; i++) obj[key].push(data[key][i]);
    obj[key].sort((a, b) => {
      var textA = a.artist.toUpperCase();
      var textB = b.artist.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    list.push(obj);
  }
  list.sort((a, b) => {
    for (let key in a) {
      for (let key2 in b) {
        return key2 - key;
      }
    }
    return 0;
  });
  return list;
});

export default Wrangle;