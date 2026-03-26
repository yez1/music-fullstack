import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'

interface Iprops {
  children?: ReactNode
}
const Ranking: FC<Iprops> = () => {
  return <div>Ranking</div>
}

export default memo(Ranking)