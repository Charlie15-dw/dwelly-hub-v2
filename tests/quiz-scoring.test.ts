import { describe, it, expect } from 'vitest'
import { scoreQuiz } from '@/lib/quiz-scoring'
import type { QuizQuestion } from '@/lib/data'

// Build a question whose correct option is `correct`. Only `correct` and the
// array length matter to the scorer, but we fill the rest to match the type.
function q(id: string, correct: number): QuizQuestion {
  return {
    id,
    question: `Q${id}`,
    options: ['a', 'b', 'c', 'd'],
    correct,
    rationale: '',
    moduleId: 'm1',
  }
}

const questions: QuizQuestion[] = [q('1', 0), q('2', 1), q('3', 2), q('4', 3)]

describe('scoreQuiz', () => {
  it('scores a perfect run as 100% and passed', () => {
    const result = scoreQuiz([0, 1, 2, 3], questions, 80)
    expect(result).toEqual({ correctCount: 4, total: 4, score: 100, passed: true })
  })

  it('scores a zero run as 0% and not passed', () => {
    const result = scoreQuiz([1, 0, 0, 0], questions, 80)
    expect(result).toEqual({ correctCount: 0, total: 4, score: 0, passed: false })
  })

  it('rounds partial scores to the nearest percent', () => {
    // 2/3 correct -> 66.67 -> 67
    const three = [q('1', 0), q('2', 1), q('3', 2)]
    const result = scoreQuiz([0, 1, 9], three, 60)
    expect(result.correctCount).toBe(2)
    expect(result.score).toBe(67)
    expect(result.passed).toBe(true)
  })

  it('treats unanswered (null) as incorrect', () => {
    const result = scoreQuiz([0, null, 2, null], questions, 50)
    expect(result.correctCount).toBe(2)
    expect(result.score).toBe(50)
    expect(result.passed).toBe(true)
  })

  it('passes only when score meets or exceeds the passmark (boundary)', () => {
    // 3/4 = 75%
    const atBoundary = scoreQuiz([0, 1, 2, 9], questions, 75)
    expect(atBoundary.score).toBe(75)
    expect(atBoundary.passed).toBe(true)

    const belowBoundary = scoreQuiz([0, 1, 2, 9], questions, 76)
    expect(belowBoundary.passed).toBe(false)
  })

  it('ignores extra answers beyond the question count', () => {
    const result = scoreQuiz([0, 1, 2, 3, 0, 1], questions, 80)
    expect(result.total).toBe(4)
    expect(result.correctCount).toBe(4)
    expect(result.score).toBe(100)
  })

  it('does not divide by zero for an empty quiz', () => {
    const result = scoreQuiz([], [], 50)
    expect(result).toEqual({ correctCount: 0, total: 0, score: 0, passed: false })
  })
})
