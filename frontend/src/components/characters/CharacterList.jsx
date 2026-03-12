import CharacterCard from './CharacterCard'

// Rejilla de tarjetas de personajes
function CharacterList({ characters }) {
  return (
    <div className="character-list">
      {characters.map((char) => (
        <CharacterCard key={char._id} character={char} />
      ))}
    </div>
  )
}

export default CharacterList
