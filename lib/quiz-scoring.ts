import type { QuizQuestion } from '@/lib/data'

// Pure scoring for assessments/quizzes. An answer is correct when the chosen
// option index matches the question's `correct` index; unanswered (null) counts
// as incorrect. Score is a 0–100 percentage, rounded. Kept free of React so it
// can be unit-tested in isolation.

export interface QuizScore {
  correctCount: number
  total: number
  score: number
  passed: boolean
}

export function scoreQuiz(
  answers: (number | null)[],
  questions: QuizQuestion[],
  passmark: number
): QuizScore {
  const total = questions.length
  const correctCount = answers.filter((a, i) => a === questions[i]?.correct).length
  const score = total > 0 ? Math.round((correctCount / total) * 100) : 0
  const passed = score >= passmark
  return { correctCount, total, score, passed }
}
