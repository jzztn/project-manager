import { IMember } from '../../library/schemas/interfaces'
import { useState } from 'react'
import sortLeaderBoard from '../../library/utilities/sort-leaderboard'
import TopRank from './top-rank'

interface IProps {
  members: IMember[]
}

const TopRanks = ({ members }: IProps) => {
  const [sortedMembers] = useState(sortLeaderBoard(members, false))

  return (
    <div className='grid grid-flow-col gap-4'>
      {sortedMembers.slice(0,3).map((member) => (
        <TopRank key={member.id} member={member}/>
      ))}
    </div>
  )
}

export default TopRanks
