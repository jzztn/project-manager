import { DotsHorizontalIcon, ThumbDownIcon, ThumbUpIcon } from "@heroicons/react/outline"
import { useState } from "react"
import { ISuggestion } from "../../library/schemas/interfaces"
import useClientStore from "../../library/stores/client"
import Icon from "../icon/icon"
import IconLabel from "../icon/icon-with-label"
import Linker from "../link/link"
import Profile from "../members/profile"
import SuggestionStatus from "./status"

interface IProps {
  suggestion:ISuggestion
  firstName:string
  lastName:string
  id:string
}

const Suggestion = ({suggestion, firstName, lastName, id} : IProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const deleteSuggestion = useClientStore((state) => state.delete.suggestion)

  return (
    <div className='bg-white py-5 px-8 grid gap-8'>
      <div className='grid grid-cols-[1fr,auto] items-center'>
        {/* title & description */}
        <div className='grid gap-3'>
          <h1 className='leading-relaxed font-semibold tracking-wide'>{suggestion.name}</h1>
          <p className='leading-relaxed text-sm tracking-wide'>{suggestion.description}</p>
        </div>
        {/* options */}
        <div className='relative'>
          <button onClick={() => setIsOpen(!isOpen)}>
            <Icon icon={<DotsHorizontalIcon/>}/>
          </button>

          {isOpen && 
            <div className='absolute top-6 right-0 bg-white shadow-md shadow-violet'>
              {/* Edit Suggestion */}
              <Linker
                name={'Edit Suggestion'}
                link={'#'}
                style={'py-4 px-8 hover:bg-snow transition-all duration-300'}
              />

              {/* Delete Suggestion */}
              <button onClick={() => deleteSuggestion({id:id})}>
                <Linker
                  name={'Delete Suggestion'}
                  link={'#'}
                  style={'py-4 px-8 hover:bg-snow transition-all duration-300'}
                />
              </button>
            </div>
          }
        </div>
      </div>

      <div className='grid md:grid-cols-[1fr,auto] items-center'>
        {/* created by and reactions */}
        <div className='flex items-center gap-16'>
          {/* created by */}
          <h1 className='text-xs text-gray-500 tracking-wide'>Posted by {firstName} {lastName}</h1>

          {/* reactions */}
          <div className='flex items-center gap-10 ml-12 md:ml-0'>
            <IconLabel icon={<ThumbUpIcon/>} label={20} style={'w-5 h-5 cursor-pointer hover:scale-125 hover:text-pink transiton-all duration-500'}/>
            <IconLabel icon={<ThumbDownIcon/>} label={12} style={'w-5 h-5 cursor hover:scale-125 hover:text-black transiton-all duration-300'}/>
          </div>
        </div>

        {/* status */}
        <SuggestionStatus id={suggestion.id} status={suggestion.status}/>
      </div>
    </div>
  )
}

export default Suggestion