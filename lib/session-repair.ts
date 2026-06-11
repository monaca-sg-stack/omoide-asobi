import { isDeepBoxDay, pickDailyQuestions } from "@/lib/daily";
import { getQuestionById } from "@/lib/questions";
import type { DailySession } from "@/types/session";

export function hasValidQuestions(session: DailySession): boolean {
  if (!Array.isArray(session.questionIds) || session.questionIds.length === 0) {
    return false;
  }
  return session.questionIds.every((id) => typeof id === "string" && !!getQuestionById(id));
}

export function repairSession(
  session: DailySession,
  pastSessions: DailySession[],
): DailySession {
  if (hasValidQuestions(session)) {
    return {
      ...session,
      answers: Array.isArray(session.answers) ? session.answers : [],
      isDeepBox: session.isDeepBox ?? isDeepBoxDay(session.date),
    };
  }

  const others = pastSessions.filter((s) => s.id !== session.id);
  const { questionIds, isDeepBox } = pickDailyQuestions(session.date, others);

  return {
    ...session,
    questionIds,
    isDeepBox,
    answers: [],
    openedAt: undefined,
    completedAt: undefined,
    emotion: undefined,
  };
}

export function repairAllSessions(sessions: DailySession[]): DailySession[] {
  return sessions.map((session, _, all) => repairSession(session, all));
}
