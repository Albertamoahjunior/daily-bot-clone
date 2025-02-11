import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { kudosService } from '../api'
import { CreateKudosPayload, CreateKudosCategoryPayload } from '../api'

export function useKudos() {
  return useQuery({
    queryKey: ['kudos'],
    queryFn: kudosService.getAllKudos,
  })
}

export function useCreateKudos() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateKudosPayload) => kudosService.createKudos(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['kudos'] }),
  })
}

export function useGetTeamKudos(teamId: string) {
  return useQuery({
    queryKey: ['teamKudos', teamId],
    queryFn: () => kudosService.getTeamKudos(teamId),
    enabled: !!teamId,
  })
}

export function useCreateKudosCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateKudosCategoryPayload) => kudosService.createKudosCategory(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['kudosCategories'] }),
  })
}
