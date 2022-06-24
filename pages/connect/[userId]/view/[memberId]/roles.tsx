import { MenuAlt1Icon, SearchIcon } from '@heroicons/react/outline'
import prisma from '../../../../../library/utilities/prisma'
import WhiteCard from '../../../../../components/card/white-card'
import Foundation from '../../../../../components/foundation'
import Header from '../../../../../components/header'
import Icon from '../../../../../components/icon/icon'
import Layout from '../../../../../components/layout'
import Main from '../../../../../components/main'
import Member from '../../../../../components/members/member'
import useClientStore from '../../../../../library/stores/client'
import objectified from '../../../../../library/utilities/objectified'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import {
  IMember,
  IProject,
  IUser,
} from '../../../../../library/schemas/interfaces'
import { useEffect, useState } from 'react'
import Sidebar from '../../../../../components/sidebar/sidebar'
import Linker from '../../../../../components/link/link'
import ProjectRole from '../../../../../components/role/project-role'

interface IProps {
  initialUser: IUser
  initialMember: IMember
  initialProject: IProject
}

const Roles: NextPage<IProps> = ({
  initialUser,
  initialMember,
  initialProject,
}) => {
  const [ready, setReady] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const user = useClientStore((state) => state.user)
  const project = useClientStore((state) => state.project)
  const member = useClientStore((state) => state.member)
  const [roles, setRoles] = useState(project.roles)

  useEffect(() => {
    setReady(true)
    setRoles(project.roles)
    useClientStore.getState().read.user(initialUser)
    useClientStore.getState().read.member(initialMember)
    useClientStore.getState().read.project(initialProject)
  }, [initialUser, initialMember, initialProject, project])

  if (!ready) return <></>

  return (
    <Foundation title="Project Members">
      <Layout>
        <Header fullname={user.name} image={user.image} id={user.id} />
        <Main>
          <section>
            <div className="grid gap-10">
              {/* Search */}
              <WhiteCard>
                <div className="flex items-center gap-2">
                  <Icon icon={<SearchIcon />} />
                  <input
                    type="string"
                    className="w-full h-full py-2 pl-4 placeholder:text-typography placeholder:text-sm md:placeholder:text-md placeholder:opacity-30 outline-none"
                    placeholder="Search Role"
                  />
                </div>
              </WhiteCard>
              {/* sidebar */}
              <div className="grid relative">
                <button onClick={() => setIsOpen(!isOpen)} className="relative">
                  <Icon icon={<MenuAlt1Icon />} />
                </button>

                {/* side bar */}
                {isOpen && <Sidebar userId={user.id} memberId={member.id} />}
              </div>
              {/* role counts */}
              <h4>
                All (<span className="font-bold">{roles?.length}</span>)
              </h4>
              {/* project roles */}
              <div className="grid grid-cols-4 gap-5">
                {roles?.map((role) => (
                  <ProjectRole key={role.id} role={role} />
                ))}
              </div>
            </div>
          </section>
        </Main>
      </Layout>
    </Foundation>
  )
}

export default Roles

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
          authorizations: {
            include: {
              role: {
                include: {
                  permission: true,
                },
              },
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
      roles: {
        include: {
          permission: true,
          authorizations: {
            include: {
              member: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      },
    },
  })

  return {
    props: {
      initialUser: objectified(user),
      initialMember: objectified(member),
      initialProject: objectified(project),
    },
    revalidate: 1,
  }
}
