# PDM Authentication — Architecture & Flow

## Overview

The PDM portal uses **JWT-based authentication** with a Redux slice for session state and
`localStorage` for persistence across page refreshes. No separate session server is needed —
the backend validates the JWT on every API call.

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                         BROWSER                                      │
│                                                                      │
│  ┌──────────────┐    dispatch      ┌──────────────────────────────┐  │
│  │  LoginPage   │─setCredentials──►│    Redux Store               │  │
│  │              │                  │                              │  │
│  │  username +  │◄── error ───────│  auth slice                  │  │
│  │  password    │                  │  ├─ token: string|null       │  │
│  └──────┬───────┘                  │  ├─ username: string|null    │  │
│         │ POST /api/v1/auth/login  │  ├─ fullName: string|null    │  │
│         ▼                          │  └─ roles: UserRole[]        │  │
│  ┌──────────────┐                  └────────────┬─────────────────┘  │
│  │  authApi     │                               │ selectIsAuthenticated│
│  │  RTK Query   │                               ▼                    │
│  └──────────────┘                  ┌──────────────────────────────┐  │
│                                    │   ProtectedRoute             │  │
│  ┌──────────────────────────────┐  │                              │  │
│  │  apiSlice (fetchBaseQuery)   │  │  isAuth? → render children   │  │
│  │                              │  │         → <Navigate /login>  │  │
│  │  prepareHeaders:             │  └──────────────────────────────┘  │
│  │   Authorization: Bearer <t> │                                    │
│  └──────────────────────────────┘  ┌──────────────────────────────┐  │
│                                    │   NavBar (top-right)         │  │
│  localStorage                      │                              │  │
│  ├─ pdm_token   ◄──────────────────│  Avatar + FullName           │  │
│  └─ pdm_user (JSON)                │  ├─ Roles chips              │  │
│                                    │  └─ Logout → clears store    │  │
│                                    └──────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
                         │
                         │ HTTPS
                         ▼
              ┌──────────────────────┐
              │   Spring Boot API    │
              │   /api/v1/auth/login │
              │   validates JWT on   │
              │   every request      │
              └──────────────────────┘
```

---

## Login Flow (Step by Step)

```
User                  LoginPage              authApi           Redux Store       Backend
 │                       │                     │                   │               │
 │── enter credentials──►│                     │                   │               │
 │                       │── login(payload) ──►│                   │               │
 │                       │                     │── POST /auth/login────────────────►│
 │                       │                     │◄─ { token, username, fullName,    │
 │                       │                     │     fullName, roles }  ────────────│
 │                       │◄── result.data ─────│                   │               │
 │                       │── dispatch(setCredentials) ────────────►│               │
 │                       │                     │        store token in localStorage │
 │                       │── navigate('/') ────►                   │               │
```

---

## Logout Flow

```
User clicks "Logout"
        │
        ▼
dispatch(logout())
        │
        ├── Clears Redux state (token, username, fullName, roles → null/[])
        ├── localStorage.removeItem('pdm_token')
        └── localStorage.removeItem('pdm_user')
        │
        ▼
navigate('/login', { replace: true })
        │
        ▼
ProtectedRoute on any other page → redirects back to /login
```

---

## Session Persistence (Page Refresh)

On app boot, `authSlice` reads from `localStorage`:

```
app loads
    │
    ▼
authSlice initialState
    ├── token    = localStorage.getItem('pdm_token')       // JWT string or null
    └── ...rest  = JSON.parse(localStorage.getItem('pdm_user'))  // { username, fullName, roles }
    │
    ▼
selectIsAuthenticated = !!token
    │
    ├── true  → ProtectedRoute renders the page normally
    └── false → redirected to /login
```

The token is also automatically attached to every API call via `prepareHeaders` in `apiSlice`.

---

## File Structure

```
src/
├── app/
│   ├── authSlice.ts        Redux slice: setCredentials, logout, selectors
│   ├── apiSlice.ts         RTK Query base — attaches Bearer token to all requests
│   ├── store.ts            Registers auth reducer + api reducer
│   └── hooks.ts            useAppDispatch / useAppSelector typed wrappers
│
├── features/auth/
│   ├── authApi.ts          RTK Query mutation: useLoginMutation → POST /auth/login
│   └── LoginPage.tsx       Login UI (username, password, show/hide, error alert)
│
├── components/
│   └── ProtectedRoute.tsx  Checks selectIsAuthenticated; redirects to /login if false
│
├── types/
│   └── auth.ts             UserRole, AuthState, LoginPayload, AuthResponse
│
└── App.tsx                 Routes + NavBar (avatar, name, roles, logout menu)
```

---

## API Contract

### POST `/api/v1/auth/login`

**Request body:**
```json
{ "username": "admin", "password": "Admin@PDM1" }
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "admin",
  "fullName": "System Administrator",
  "roles": ["PD_ADMIN"]
}
```

**Response (401 Unauthorized):**
```json
{ "message": "Invalid credentials" }
```

---

## Role Reference

| Role           | Capabilities                                      |
|----------------|---------------------------------------------------|
| `PD_ADMIN`     | Full access: terminate/reinstate, credentialing   |
| `PD_ASSOCIATE` | Read + add licenses, attestations, notes, address |
| `READ_ONLY`    | View only, no mutations                           |

Access is enforced at the API level; the frontend uses `RoleGuard` to show/hide buttons.

---

## NavBar Wireframe

```
┌────────────────────────────────────────────────────────────────────────────┐
│ PDM · Provider Data Management  │ Dashboard  Practitioners  Organizations  │  JD ▼ │
└────────────────────────────────────────────────────────────────────────────┘
                                                                     │
                                                            ┌────────┴──────────┐
                                                            │  John Doe         │
                                                            │  @johndoe         │
                                                            │  [PD_ADMIN]       │
                                                            │─────────────────── │
                                                            │  👤 My Profile    │
                                                            │  🚪 Logout        │
                                                            └───────────────────┘
```

---

## Login Page Wireframe

```
                    ┌──────────────────────────┐
                    │                          │
                    │         [ 🔒 ]           │
                    │      PDM Portal          │
                    │  Provider Data Mgmt Sys  │
                    │  ─── Sign in ──────────  │
                    │                          │
                    │  👤 Username             │
                    │  ┌────────────────────┐  │
                    │  │                    │  │
                    │  └────────────────────┘  │
                    │                          │
                    │  🔒 Password         👁  │
                    │  ┌────────────────────┐  │
                    │  │                    │  │
                    │  └────────────────────┘  │
                    │                          │
                    │  ┌────────────────────┐  │
                    │  │     Sign In        │  │
                    │  └────────────────────┘  │
                    │                          │
                    │  [PD_ADMIN] [PD_ASSOC]   │
                    │   Contact admin for creds│
                    └──────────────────────────┘
```
