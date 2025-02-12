import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { teamService, memberService } from '../api'
import { CreateTeamPayload, AddMembersPayload } from '../api'

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: teamService.getTeams,
  })
}

//get all the members
export function useMembers() {
  return useQuery({
    queryKey: ['members'],
    queryFn: () => memberService.getMembers(),
  })
}

export function useTeam(teamId: string) {
  return useQuery({
    queryKey: ['team', teamId],
    queryFn: () => teamService.getTeam(teamId),
    enabled: !!teamId, // Only fetch when teamId is available
  })
}

export function useCreateTeam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateTeamPayload) => teamService.createTeam(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teams'] }),
  })
}

export function useAddMembersToTeam(teamId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AddMembersPayload) => teamService.addMembersToTeam(teamId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team', teamId] }),
  })
}

export function useRemoveMembersFromTeam(teamId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AddMembersPayload) => teamService.removeMembersFromTeam(teamId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team', teamId] }),
  })
}

export function useRemoveTeam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: teamService.removeTeam,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teams'] }),
  })
}
