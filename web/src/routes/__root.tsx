import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>{' '}
        <Link to="/bpmn/viewer" className="[&.active]:font-bold">
          BPMN Viewer
        </Link>{' '}
        <Link to="/bpmn/editor" className="[&.active]:font-bold">
          BPMN Editor
        </Link>
        
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})