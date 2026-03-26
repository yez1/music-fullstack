import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import {Link} from "react-router-dom"

interface Iprops {
  children?: ReactNode
}
const AppFooter: FC<Iprops> = () => {
  return (
    <div>
        AppFooter
      </div>
  )
}

export default memo(AppFooter)