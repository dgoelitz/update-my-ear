const RemoveDuplicates = ((data) => {
  for (let i = 0; i < data.length; i++) {
    for (let key in data[i]) {
      let current = data[i][key];
      for (let j = 1; j < current.length; j++) {
        let stepBack = 1;
        while (current[j - stepBack] && current[j - stepBack].artist === current[j].artist) {
          if (current[j - stepBack].album === current[j].album) {
            current.splice(j, 1);
            j--;
            break;
          }
          stepBack++;
        }
      }
    }
  }
  return data;
})

export default RemoveDuplicates;