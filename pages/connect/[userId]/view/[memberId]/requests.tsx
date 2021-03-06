import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { useEffect, useState } from 'react'
import Chatbox from '../../../../../components/chatbox'
import Header from '../../../../../components/header'
import Layout from '../../../../../components/layout'
import Main from '../../../../../components/main'
import type {
  IMember,
  IMessage,
  IProject,
  IUser,
} from '../../../../../library/schemas/interfaces'
import useClientStore from '../../../../../library/stores/client'
import objectified from '../../../../../library/utilities/objectified'
import prisma from '../../../../../library/utilities/prisma'
import Foundation from '../../../../../components/foundation'
import Icon from '../../../../../components/icon/icon'
import {
  CollectionIcon,
  FolderOpenIcon,
  LightBulbIcon,
  MenuAlt1Icon,
  MenuIcon,
  SpeakerphoneIcon,
} from '@heroicons/react/outline'
import Linker from '../../../../../components/link/link'
import SnowCard from '../../../../../components/card/snow-card'
import WhiteCard from '../../../../../components/card/white-card'
import IconLabel from '../../../../../components/icon/icon-with-label'
import Button from '../../../../../components/button/button'
import Task from '../../../../../components/task/task'
import CreateTaskModal from '../../../../../components/modals/create-task'
import ProjectCodeModal from '../../../../../components/modals/copy-code'
import phase from '../../../../../library/utilities/phase'
import Router, { useRouter } from 'next/router'
import Sidebar from '../../../../../components/sidebar/sidebar'
import Request from '../../../../../components/request/request'

interface IProps {
  initialUser: IUser
  initialMember: IMember
  initialProject: IProject
  initialMessages: IMessage[]
}

const Requests: NextPage<IProps> = ({
  initialUser,
  initialMember,
  initialProject,
  initialMessages,
}) => {
  const user = useClientStore((state) => state.user)
  const member = useClientStore((state) => state.member)
  const project = useClientStore((state) => state.project)
  const deleteProject = useClientStore((state) => state.delete.project)
  const completeProject = useClientStore((state) => state.update.project.over)
  const updateMembership = useClientStore(
    (state) => state.update.member?.active
  )
  const [ready, setReady] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenOption, setIsOpenOption] = useState(false)
  const [isCreate, setIsCreate] = useState(false)
  const [copyCode, setCopyCode] = useState(false)

  useEffect(() => {
    setReady(true)
    useClientStore.getState().read.user(initialUser)
    useClientStore.getState().read.member(initialMember)
    useClientStore.getState().read.project(initialProject)
    useClientStore.getState().read.messages(initialMessages)
  }, [initialUser, initialMember, initialProject, initialMessages])

  if (!ready) return <></>

  console.log('Dashboard Rendered')

  const handleLeaveProject = () => {
    member?.active === !member.active
  }

  return (
    <Foundation title="Dashboard">
      <Layout>
        <Header
          fullname={user.name} image={user.image} id={user.id}
        />
        <Main>
          <section>
            <div className="grid gap-5 relative">
              <button onClick={() => setIsOpen(!isOpen)}>
                <Icon icon={<MenuAlt1Icon />} />
              </button>

              {/* side bar */}
              {isOpen && <Sidebar userId={user.id} memberId={member.id} />}

              {/* project details */}
              <div className="grid">
                <WhiteCard>
                  <div className="grid gap-5">
                    {/* project name and option btn */}
                    <div className="grid grid-cols-[1fr,auto]">
                      <h1 className="md:font-lg font-semibold">
                        {project?.name}
                      </h1>
                      <button onClick={() => setIsOpenOption(!isOpenOption)}>
                        <Icon icon={<MenuIcon />} />
                      </button>

                      {isOpenOption && (
                        <div className="absolute top-11 right-7 bg-white shadow-md shadow-violet grid z-50">
                          {/* Edit Project */}
                          <Linker
                            name={'Edit Project'}
                            link={'#'}
                            style={
                              'py-4 px-8 hover:bg-snow transition-all duration-300'
                            }
                          />

                          {/* Set as done */}
                          {project.over === true ? (
                            <button
                              onClick={() =>
                                completeProject({
                                  id: project.id,
                                  key: 'over',
                                  value: false,
                                })
                              }
                            >
                              <Linker
                                name={'Set as Incomplete'}
                                link={'#'}
                                style={
                                  'py-4 px-8 hover:bg-snow transition-all duration-300'
                                }
                              />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                completeProject({
                                  id: project.id,
                                  key: 'over',
                                  value: true,
                                })
                              }
                            >
                              <Linker
                                name={'Set as Done'}
                                link={'#'}
                                style={
                                  'py-4 px-8 hover:bg-snow transition-all duration-300'
                                }
                              />
                            </button>
                          )}

                          {/* Copy */}
                          <button onClick={() => setCopyCode(!copyCode)}>
                            <Linker
                              name={'Copy Code'}
                              link={'#'}
                              style={
                                'py-4 px-8 hover:bg-snow transition-all duration-300'
                              }
                            />
                          </button>
                          {copyCode && (
                            <ProjectCodeModal
                              handler={() => setCopyCode(!copyCode)}
                              code={project?.code}
                            />
                          )}

                          {/* Delete Project */}
                          <button
                            onClick={() => {
                              deleteProject({ id: project?.id })
                              Router.push(`/connect/${user.id}`)
                            }}
                          >
                            <Linker
                              name={'Delete Project'}
                              link={'#'}
                              style={
                                'py-4 px-8 hover:bg-snow transition-all duration-300'
                              }
                            />
                          </button>

                          {/* Leave Project */}
                          <button
                            onClick={() => {
                              updateMembership({
                                id: member?.id,
                                key: 'active',
                                value: false,
                              })
                              Router.push(`/connect/${user.id}`)
                            }}
                          >
                            <Linker
                              name={'Leave Project'}
                              link={'#'}
                              style={
                                'py-4 px-8 hover:bg-snow transition-all duration-300'
                              }
                            />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* project description */}
                    <p className="leading-relaxed text-sm md:text-md font-light w-[90%]">
                      {project?.description}
                    </p>

                    {/* user's contribution and copy code */}
                    <div className="flex gap-10 items-center mb-28 lg:mb-16">
                      <IconLabel
                        icon={<CollectionIcon />}
                        label={project?.tasks?.length}
                      />
                      <IconLabel
                        icon={<FolderOpenIcon />}
                        label={project?.files?.length}
                      />
                      <IconLabel
                        icon={<SpeakerphoneIcon />}
                        label={project?.announcements?.length}
                      />
                      <IconLabel
                        icon={<LightBulbIcon />}
                        label={project?.suggestions?.length}
                      />
                    </div>
                  </div>
                  <SnowCard>
                    <div className="flex gap-10 items-center">
                      {/* start and due date */}
                      <div className="text-sm tracking-wide">
                        {String(phase(initialProject?.createdAt, 'LL'))} -{' '}
                        {String(phase(initialProject?.dueAt, 'LL'))}
                      </div>
                      {/* completeness */}
                      {project?.over === true ? (
                        <h1 className="text-green-600 font-bold tracking-wide">
                          Completed
                        </h1>
                      ) : (
                        <h1 className="text-red-600 font-bold tracking-wide">
                          Incomplete
                        </h1>
                      )}
                    </div>
                  </SnowCard>
                </WhiteCard>
              </div>

              <div className="grid mt-5 gap-10">
                {/* requests count*/}
                <h1>
                  All (
                  <span className="font-bold">{project!.tickets!.length}</span>)
                </h1>

                {/* join requests */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {project.tickets?.map((ticket) => (
                    <Request
                      firstName={
                        ticket.user!.firstName[0].toUpperCase() +
                        ticket!.user!.firstName.slice(1)
                      }
                      lastName={
                        ticket!.user!.lastName[0].toUpperCase() +
                        ticket!.user!.lastName.slice(1)
                      }
                      userId={ticket!.user!.id}
                      projectId={ticket.projectId}
                      ticketId={ticket.id}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </Main>
      </Layout>
    </Foundation>
  )
}

export default Requests

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
  })

  const project = await prisma.project.findUnique({
    where: { id: member?.projectId },
    include: {
      members: {
        include: {
          user: true,
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
      tickets: {
        include: {
          user: true,
        },
      },
    },
  })

  const messages = await prisma.message.findMany({
    where: { projectId: member!.projectId },
  })

  return {
    props: {
      initialUser: objectified(user),
      initialMember: objectified(member),
      initialProject: objectified(project),
      initialMessages: objectified(messages),
    },
    revalidate: 1,
  }
}
