import { Link } from 'react-router-dom'

// Tarjeta de vista previa de un personaje (usada en listados y búsqueda)
function CharacterCard({ character }) {
  return (
    <div className="character-card">
      <Link to={`/personaje/${character._id}`}>
        <img src={character.image} alt={character.name} />
        <h3>{character.name}</h3>
        <span>{character.mbtiType}</span>
      </Link>
    </div>
  )
}

export default CharacterCard
