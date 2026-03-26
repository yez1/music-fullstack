import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'

interface Iprops {
  children?: ReactNode
}
const Foucs: FC<Iprops> = () => {
  return <div>Foucs</div>
}

export default memo(Foucs)