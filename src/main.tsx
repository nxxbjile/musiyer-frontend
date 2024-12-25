import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './components/Layout'
import Upload from './pages/Upload'
import { Globals } from './contexts/Globals'
import Playlists from './pages/Playlists'
import Playlist from './pages/Playlist'
import Songs from './pages/Songs'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Favorites from './pages/Favorites'
import AddPlaylist from './pages/AddPlaylist'

const router = createBrowserRouter([
  {
    path:"/",
    element:<Layout />,
    children:[
      {
        index:true,
        element:<Home />
      },
      {
        path:"upload",
        element:<Upload />
      },
      {
        path:"playlists",
        element:<Playlists />,
      },
      {
        path:"playlists/:id",
        element:<Playlist />
      },
      {
        path:"playlist/add",
        element:<AddPlaylist />
      },
      {
        path:"songs",
        element:<Songs />
      },
      {
        path:"favorites",
        element: <Favorites />
      },
    ]
  },
  {
    path:"signup",
    element:<Signup />
  },
  {
    path:"login",
    element:<Login />
  }
])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Globals>
      <RouterProvider router={router} />  
    </Globals>
  </StrictMode>,
)
