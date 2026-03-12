import { useState } from 'react'
import mbtiService from '../services/mbtiService'

// Hook para gestionar el flujo del test MBTI
export function useMBTI() {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)

  const loadQuestions = async () => {
    const data = await mbtiService.getQuestions()
    setQuestions(data)
  }

  const answer = (value) => {
    setAnswers((prev) => [...prev, value])
    setCurrentIndex((prev) => prev + 1)
  }

  const submit = async (token) => {
    const data = await mbtiService.submitResult(answers, token)
    setResult(data)
  }

  return { questions, currentIndex, result, loadQuestions, answer, submit }
}
