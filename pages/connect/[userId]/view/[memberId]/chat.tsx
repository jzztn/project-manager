import { MenuAlt1Icon } from '@heroicons/react/outline'
import cuid from 'cuid'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useEffect, useState } from 'react'
import Foundation from '../../../../../components/foundation'
import Header from '../../../../../components/header'
import Icon from '../../../../../components/icon/icon'
import Layout from '../../../../../components/layout'
import Main from '../../../../../components/main'
import Sidebar from '../../../../../components/sidebar/sidebar'
import useFetch from '../../../../../library/hooks/fetch'
import prisma from '../../../../../library/utilities/prisma'

import {
  IMember,
  IMessage,
  IProject,
  IUser,
} from '../../../../../library/schemas/interfaces'
import useClientStore from '../../../../../library/stores/client'
import useFieldStore from '../../../../../library/stores/field'
import objectified from '../../../../../library/utilities/objectified'
import { PaperAirplaneIcon } from '@heroicons/react/solid'
import phase from '../../../../../library/utilities/phase'

interface IProps {
  initialUser: IUser
  initialMember: IMember
  initialProject: IProject
}
const Chatbox = ({ initialUser, initialMember, initialProject }: IProps) => {
  const user = useClientStore((state) => state.user)
  const member = useClientStore((state) => state.member)
  const project = useClientStore((state) => state.project)
  const messages = useClientStore((state) => state.messages)
  const messageField = useFieldStore((state) => state.message)
  const create = useClientStore((state) => state.create.message)
  const [isOpen, setIsOpen] = useState(false)

  const { data, mutate } = useFetch<IMessage[]>(
    '/api/message/read',
    project.id,
    {
      fallbackData: messages,
      refreshInterval: 20000,
    }
  )

  useEffect(() => {
    useClientStore.getState().read.user(initialUser)
    useClientStore.getState().read.member(initialMember)
    useClientStore.getState().read.project(initialProject)
    if (JSON.stringify(messages) !== JSON.stringify(data)) {
      useClientStore.getState().read.messages(data!)
    }
  }, [initialUser, initialMember, messages, data])

  if (JSON.stringify(messages) !== JSON.stringify(data)) return <></>

  console.log('Chatbox Rendered', messages)

  const handler = () => {
    if (messageField.value.text) {
      const newData: IMessage = {
        ...messageField.value,
        id: cuid(),
        member: member,
      }
      messageField.clear()
      mutate([...messages!, newData], false)
      create({
        text: newData.text,
        memberId: member.id,
        projectId: project.id,
      })
    }
  }

  return (
    <Foundation title="Project Team Chat">
      <Layout>
        <Header
          fullname={user.name} image={user.image} id={user.id}
        />
        <Main>
          <section>
            <div className="max-w-7xl mx-auto full grid gap-5">
              {/* sidebar */}
              <div className="grid grid-cols-[auto,1fr] gap-20 relative">
                <button onClick={() => setIsOpen(!isOpen)} className="relative">
                  <Icon icon={<MenuAlt1Icon />} />
                </button>

                {/* side bar */}
                {isOpen && <Sidebar userId={user.id} memberId={member.id} />}

                <div>
                  <h1 className='font-medium tracking-wide'>{project.name}</h1>
                  {/* <p className='text-xs mt-1'>{project!.members!.length} members</p> */}
                </div>
              </div>

              {/* chat */}
              <div className="grid grid-rows-[1fr,auto] gap-3">
                {/* chats */}
                <div className="flex flex-col gap-4 h-[700px] bg-snow p-4 overflow-y-scroll">
                  {messages?.map((message) => {
                    return (
                      <div
                        key={message.id}
                        className={`${
                          message.member?.id === member.id
                            ? 'ml-auto' : 'mr-auto'
                        }`}
                      >
                        <div className={`${
                          message.member?.id === member.id
                            ? 'bg-blue text-white' : 'bg-white text-black'} text-center rounded-full py-2 px-4 text-sm`}>
                          {message.text}
                        </div>
                        <div className={`${
                          message.member?.id === member.id
                            ? 'text-right' : 'text-left'} text-xs text-gray-500 tracking-wider mt-1`}>
                          {message.member?.user!.username}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="grid grid-cols-[1fr,auto] items-center gap-6">
                  <input
                    type="text"
                    value={messageField.value.text}
                    onChange={(event) =>
                      messageField.set({
                        ...messageField.value,
                        text: event.target.value,
                      })
                    }
                    className="w-full py-3 pl-6 outline-none placeholder:text-sm placeholder:text-opacity-50"
                    placeholder="Type Here ..."
                  />

                  <div>
                    <button onClick={handler}>
                      <PaperAirplaneIcon className="text-blue w-8 h-8 rotate-90 cursor-pointer hover:scale-125" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Main>
      </Layout>
    </Foundation>
  )
}

export default Chatbox

export const getStaticPaths: GetStaticPaths = async () => {
  const members = await prisma.member.findMany()

  const paths = members.map((member) => {
    return {
      params: { userId: member.userId, memberId: member.id },
    }
  })

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const user = await prisma.user.findUnique({
    where: { id: String(params!.userId) },
    include: {
      members: {
        include: {
          _count: { select: { tasks: true } },
          project: {
            include: {
              _count: { select: { members: true, tasks: true } },
            },
          },
        },
      },
    },
  })

  const member = await prisma.member.findUnique({
    where: { id: String(params!.memberId) },
    include: {
      user:true
    }
  })

  const project = await prisma.project.findUnique({
    where: { id: member?.projectId },
    include: {
      members: {
        include: {
          user: true,
          authorizations: {
            include: {
              role: true,
            },
          },
        },
      },
      tasks: {
        include: {
          todos: true,
        },
      },
      suggestions: true,
      files: true,
      announcements: true,
    },
  })

  return {
    props: {
      initialUser: objectified(user),
      initialMember: objectified(member),
      initialProject: objectified(project)
    },
    revalidate: 1,
  }
}
