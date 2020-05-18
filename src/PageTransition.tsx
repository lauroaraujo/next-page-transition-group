import React, { useEffect, useState, useRef, ReactNode } from 'react'
import { useRouter, Router } from 'next/router'
import { CSSTransition } from 'react-transition-group'
import { CSSTransitionClassNames } from 'react-transition-group/CSSTransition'

type PageTransitionProps = {
  children: ReactNode,
  classNames: string | CSSTransitionClassNames,
  enterDelay?: number,
  exitDelay?: number,
  shouldTransition?: (oldPath: string, newPath: string) => boolean,
  beforeEnter?: (url: string) => void,
  beforeExit?: (url: string) => void
}

export default function PageTransition ({
  children,
  classNames,
  enterDelay = 0,
  exitDelay = 0,
  shouldTransition = defaultShouldTransition,
  beforeEnter = defaultBeforeEnter,
  beforeExit = defaultBeforeExit
}: PageTransitionProps) {
  const router = useRouter()
  const [isIn, setIsIn] = useState(true)

  const animationTimeout = isIn ? enterDelay : exitDelay

  const childrenRef = useRef(children)
  const exitTransitionStartRef = useRef(Date.now())

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      if (!shouldTransition(router.asPath, url)) {
        return
      }

      exitTransitionStartRef.current = Date.now()

      beforeExit(url)
      setIsIn(false)
    }

    const handleRouteChangeComplete = (url: string) => {
      if (!shouldTransition(router.asPath, url)) {
        return
      }

      const delaySoFar = Date.now() - exitTransitionStartRef.current
      const delayBeforeIn = Math.max(exitDelay - delaySoFar, 0)

      setTimeout(() => {
        beforeEnter(url)
        setIsIn(true)
      }, delayBeforeIn)
    }

    const handleRouteChangeError = (url: string) => {
      beforeEnter(url)
      setIsIn(true)
    }

    Router.events.on('routeChangeStart', handleRouteChangeStart)
    Router.events.on('routeChangeComplete', handleRouteChangeComplete)
    Router.events.on('routeChangeError', handleRouteChangeError)

    return () => {
      Router.events.off('routeChangeStart', handleRouteChangeStart)
      Router.events.off('routeChangeComplete', handleRouteChangeComplete)
      Router.events.off('routeChangeError', handleRouteChangeError)
    }
  }, [router.asPath])

  if (isIn) {
    childrenRef.current = children
  }

  return (
    <CSSTransition
      in={isIn}
      timeout={animationTimeout}
      classNames={classNames}
    >
      {childrenRef.current}
    </CSSTransition>
  )
}

function defaultShouldTransition (oldPath: string, newPath: string): boolean {
  return normalizePath(oldPath) !== normalizePath(newPath)
}

function defaultBeforeEnter (): void {
  window.scrollTo(0, 0)
}

function defaultBeforeExit (): void {}

function normalizePath (path: string): string {
  return new URL(`https://localhost${path}`).pathname
}
