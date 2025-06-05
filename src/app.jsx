import { useRoutes } from "react-router-dom"
import routes from "~react-pages"
function app() {

  return (
    <>
    {useRoutes(routes)}
    </>
  )
}

export default app
