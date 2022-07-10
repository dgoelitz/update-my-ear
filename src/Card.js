const Card = ((props) => {
  return (
    <div className="card">
      <a href={props.track.link} target="_blank" rel="noreferrer noopener">
        <img alt={props.track.album} src={props.track.image} loading="lazy" />
      </a>
      <br/>
      <a className="text" href={props.track.artistLink} target="_blank" rel="noreferrer noopener">{props.track.artist}</a>
      <br/>
      <a className="text" href={props.track.link} target="_blank" rel="noreferrer noopener">{props.track.album}</a>
      <p className="text tracks">{`${props.track.tracks} track${props.track.tracks > 1 ? 's' : ''}`}</p>
    </div>
  )
});

export default Card;