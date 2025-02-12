import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { pollService } from '../api'
import { CreatePollQuestionsPayload, CreatePollResponsesPayload } from '../api'

export function usePolls() {
  return useQuery({
    queryKey: ['polls'],
    queryFn: pollService.getAllPolls,
  })
}

export function useCreatePollQuestions() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreatePollQuestionsPayload) => pollService.createPollQuestions(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['polls'] }),
  })
}

export function useCreatePollResponses() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreatePollResponsesPayload) => pollService.createPollResponses(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pollResponses'] }),
  })
}

export function useTeamPollResponses(teamId: string) {
  return useQuery({
    queryKey: ['teamPollResponses', teamId],
    queryFn: () => pollService.getTeamPollResponses(teamId),
    enabled: !!teamId,
  })
}
