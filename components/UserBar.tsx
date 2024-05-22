'use client'
import { useSessionStore } from '@/stores/useSessionStore'
import { useRouter } from 'next/navigation'
import { api } from '@/api/api'
import { useUserStateStore } from '@/stores/useUserStateStore'
import { useEffect } from 'react'
import { useStore } from 'zustand'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useShallow } from 'zustand/react/shallow'
const UserBar = () => {
  const userSession = useStore(useSessionStore, (state) => state)
  const { setUser } = useStore(useUserStateStore, (s) => s)
  const { data, isSuccess } = useQuery({
    queryKey: ['user', userSession.user.id],
    queryFn: () => api.get(`/user/${userSession.user.id}`),
  })
  useEffect(() => {
    if (isSuccess && data.data) {
      setUser(data.data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])

  const router = useRouter()
  const [auth, user] = useSessionStore(useShallow((state) => [state.auth, state.user]))

  return (
    <div className="flex-none">
      {/* Giỏ hàng */}
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
          <div className="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="badge badge-sm indicator-item">8</span>
          </div>
        </div>
        <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
          <div className="card-body">
            <span className="font-bold text-lg">8 Items</span>
            <span className="text-info">Subtotal: $999</span>
            <div className="card-actions">
              <button className="btn btn-primary btn-block">View cart</button>
            </div>
            {/* phần này ô Tú handle tiếp */}
          </div>
        </div>
      </div>
      {/* Avatar */}
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img alt="User's Avatar" src={`https://i.pravatar.cc/150?u=${user.id}`} />
          </div>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm w-[350px] dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box"
        >
          <li>
            <div>ID: {auth ? user.id : ''}</div>
          </li>
          <li>
            <Link href="/settings/user-addresses">Quản lý địa chỉ</Link>
          </li>
          <li
            onClick={() => {
              useSessionStore.getState().logout()
              router.push('/')
            }}
          >
            <div>Đăng xuất</div>
          </li>
        </ul>
      </div>
    </div>
  )
}
export default UserBar