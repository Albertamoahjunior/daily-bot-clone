import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { moodService } from '../api'
import { CreateMoodPayload, MoodResponsePayload } from '../api'

export function useMoods() {
  return useQuery({
    queryKey: ['moods'],
    queryFn: moodService.getMoods,
  })
}

export function useCreateMood() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateMoodPayload[]) => moodService.createMood(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['moods'] }),
  })
}

export function useCreateMoodResponse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: MoodResponsePayload) => moodService.createMoodResponse(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['moodResponses'] }),
  })
}

export function useGetMoodResponse(userId: string) {
  return useQuery({
    queryKey: ['moodResponse', userId],
    queryFn: () => moodService.getMoodResponse(userId),
    enabled: !!userId,
  })
}

export function useMoodAnalyticsForTeam(teamId: string) {
  return useQuery({
    queryKey: ['moodAnalytics', teamId],
    queryFn: () => moodService.getMoodAnalyticsForTeam(teamId),
    enabled: !!teamId,
  })
}
