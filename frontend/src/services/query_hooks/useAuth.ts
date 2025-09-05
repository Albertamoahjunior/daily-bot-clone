import { useMutation, useQuery } from '@tanstack/react-query'
import { authService } from '../api'

export function useLogin() {
  return useMutation({
    mutationFn: authService().login
  })
}

export function useVerifyUser() {
  return useMutation({
    mutationFn: authService().verifyUser
})
}

export function useLogout() {
  return useMutation({
    mutationFn: authService().logout
  })
}

export function useGetUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: authService().getUser,
  })
}
