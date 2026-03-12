// Renderiza una pregunta individual del test MBTI
// props: question (objeto), onAnswer (función callback)
function MBTIQuestion({ question, onAnswer }) {
  return (
    <div className="mbti-question">
      <p>{question.text}</p>
      {question.options.map((opt) => (
        <button key={opt.value} onClick={() => onAnswer(opt.value)}>
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default MBTIQuestion
