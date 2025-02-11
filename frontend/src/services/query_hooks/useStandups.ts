import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { standupService } from '../api'
import { ConfigureStandupPayload } from '../api'

export function useStandups() {
  return useQuery({
    queryKey: ['standups'],
    queryFn: standupService.getAllStandups,
  })
}

export function useConfigureStandup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ConfigureStandupPayload) => standupService.configureStandup(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['standups'] }),
  })
}

export function useStandupRespondents(teamId: string) {
  return useQuery({
    queryKey: ['standupRespondents', teamId],
    queryFn: () => standupService.getStandupRespondents(teamId),
    enabled: !!teamId,
  })
}
