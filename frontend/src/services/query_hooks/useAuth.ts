import { useMutation, useQuery } from '@tanstack/react-query'
import { authService } from '../api'

export function useLogin() {
  return useMutation(authService().login)
}

export function useVerifyUser() {
  return useMutation(authService().verifyUser)
}

export function useLogout() {
  return useMutation(authService().logout)
}

export function useGetUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: authService().getUser,
  })
}
