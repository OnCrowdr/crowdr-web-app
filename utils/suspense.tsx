import { ComponentProps, PropsWithChildren, Suspense } from "react"

function suspense<P extends object>(
  Component: React.ComponentType<PropsWithChildren<P>>,
  fallback: React.ReactNode = null
) {
  return function (props: P) {
    return (
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    )
  }
}

export default suspense
