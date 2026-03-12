import CharacterList from '../characters/CharacterList'

// Muestra el tipo MBTI obtenido y los personajes que lo comparten
function MBTIResult({ mbtiType, characters }) {
  return (
    <div className="mbti-result">
      <h2>Tu tipo de personalidad: {mbtiType}</h2>
      <CharacterList characters={characters} />
    </div>
  )
}

export default MBTIResult
