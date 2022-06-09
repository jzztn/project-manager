import Link from 'next/link'
import phase from '../../library/utilities/phase'
import WhiteCard from '../card/white-card'
import Profile from '../members/profile'

interface IProps {
  task: any
  index: number
  userId: string
  memberId: string
}
const Task = ({ task, index, userId, memberId }: IProps) => {
  return (
    <Link href={`/connect/${userId}/view/${memberId}/task/${task.id}`}>
      <div>
        {/* for smaller screen */}
        <div className="lg:hidden">
          <div className="cursor-pointer hover:-translate-y-2 transiton-all duration-500">
            <WhiteCard>
              <div className="grid gap-4">
                {/* task name and due date */}
                <div className="grid gap-1">
                  {/* name, priority */}
                  <div className="grid grid-cols-[1fr,auto] items-center">
                    <div className="text-lg lg:text-xl leading-relaxed font-semibold">
                      {task?.name}
                    </div>
                    <div className="text-pink font-semibold text-center">
                      {task?.priority}
                    </div>
                  </div>
                  {/* due date */}
                  <div className="text-sm leading-relaxed">
                    {String(phase(task?.dueAt, 'LL'))}
                  </div>
                </div>

                {/* members */}
                <div className="flex items-center gap-10 ml-3">
                  {/* head member  */}
                  <Profile />

                  {/* task members */}
                  <div className="flex items-center gap-3 ml-3">
                    <Profile />
                    <Profile />
                    <Profile />
                    <Profile />
                    <Profile />
                    {task?.members?.length > 5 && (
                      <h1 className="text-sm ml-5 text-gray-500 whitespace-nowrap">
                        + {task?.members?.length - 5} more
                      </h1>
                    )}
                  </div>
                </div>

                {/* completeness */}
                {task?.over === true ? (
                  <h1 className="text-green-600 font-bold tracking-wide ml-auto">
                    Completed
                  </h1>
                ) : (
                  <h1 className="text-red-600 font-bold tracking-wide ml-auto">
                    Incomplete
                  </h1>
                )}
              </div>
            </WhiteCard>
          </div>
        </div>

        {/* for laptops */}
        <div className="hidden lg:block">
          <div className="bg-white shadow-md shadow-violet py-3 px-6 grid grid-cols-[auto,1fr,1fr,1fr,1fr,1fr,1fr] gap-10 items-center hover:bg-snow hover:-translate-y-1 taransition-all duration-300 cursor-pointer">
            {/* number */}
            <h1 className="font-semibold">{index}</h1>

            {/* task name */}
            <h1 className="leading-relaxed whitespace-nowrap">{task?.name}</h1>

            {/* head task */}
            <Profile />

            {/* Task Members */}
            <div className="flex items-center gap-3 ml-3">
              <Profile />
              <Profile />
              <Profile />
              <Profile />
              <Profile />
              <h1 className="text-sm ml-5 text-gray-500 whitespace-nowrap">
                + 5 more
              </h1>
            </div>

            {/* Task Priority */}
            <div className="text-pink font-semibold text-center">
              {task?.priority}
            </div>

            {/* Task Due Date */}
            <div className="text-sm leading-relaxed whitespace-nowrap">
              {String(phase(task.dueAt, 'LL'))}
            </div>

            {/* completeness */}
            {task?.over === true ? (
              <h1 className="text-green-600 font-bold tracking-wide">
                Completed
              </h1>
            ) : (
              <h1 className="text-red-600 font-bold tracking-wide">
                Incomplete
              </h1>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Task
