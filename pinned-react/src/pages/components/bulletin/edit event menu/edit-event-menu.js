import React from 'react'
import InputTitle from './input-title'

import { IoClose } from "react-icons/io5"
import SubmitButton from './submit-buttom'
import { Input } from 'postcss'

//if usinng this while editing a coimponent, or gonig back to a draft, set the placeholder for all inputs the fetched data

//visible max character limit
//contact type?
//dynamic size div
//make it draggable around the screen?

const EditEventMenu = (props) => {
    const requiredSections = {
        "Title": true, //done
        "Description": true, //done
        "Preview Image": true,
        "Date": false, //done
        "Time": false, //done
        "Tags": true, //done
        "Location": false, //done
        "Upload": false,
        "Contact Info": false //done
    }

    const closeMenu = () => {
        props.setIsEditEventMenuOpen(false)
    }

  return (
    <div className='flex fixed left-0 top-0 bg-black/[0.55] h-screen w-screen justify-center'>
        <div className='relative w-[37rem] flex flex-col border border-black bg-gray-50 rounded-xl my-2 mx-4'>
            <button 
                className="absolute text-[1.5rem] top-2 left-2 text-gray-500 dark:ext-white hover:scale-[1.1] active:scale-105 transition hover:text-gray-800 dark:over:text-gray-200" 
                onClick={() => closeMenu()}
            >
                <IoClose />
            </button>

            <h1 className='font-bold w-full mt-5 text-[1.6rem] text-center'>
                Create New Event
            </h1>

            <form className='flex flex-col mt-8 px-5 text-sm h-full'>
                <InputTitle isRequired={requiredSections["Title"]}>
                    Title
                </InputTitle>
                <input 
                    id="Title"
                    className='h-8 rounded-[0.55rem] borderBlack70 pl-3 w-full mb-3'
                    type='text'
                    name='eventTitle'
                    required={requiredSections["Title"]}
                    maxLength={500}
                    defaultValue={"Hello"}
                />

                <InputTitle isRequired={requiredSections["Description"]}>
                    Description
                </InputTitle>
                <textarea 
                    id='Description'
                    className='h-[7rem] rounded-[0.55rem] borderBlack70 pl-3 pt-1 w-full mb-3'
                    type='text'
                    name='eventDescription'
                    required={requiredSections["Description"]}  
                    maxLength={2000}
                />

                <div className='flex flex-row w-full justify-between gap-6 mb-3'>
                    <div className='flex flex-col w-full'>
                        <InputTitle isRequired={requiredSections["Contact Info"]}>
                            Contact Info
                        </InputTitle>
                        <textarea 
                            id='Contact Info'
                            className='rounded-[0.55rem] borderBlack70 pl-3 pt-1 h-full mb-3'
                            type='text'
                            name='eventContact'
                            required={requiredSections["Contact Info"]} 
                            maxLength={2000}
                        />

                        <InputTitle isRequired={requiredSections["Tags"]} >
                            Tags
                        </InputTitle>
                        <textarea 
                            id='Tags'
                            className='rounded-[0.55rem] borderBlack70 pl-3 pt-1 h-full'
                            type='text'
                            name='eventTags'
                            required={requiredSections["Tags"]} 
                            maxLength={2000}
                        />
                    </div>
                    <div className='max-w-[45%]'>
                        <InputTitle isRequired={requiredSections["Date"]}>
                            Date
                        </InputTitle>
                        <input 
                            id="Date"
                            className='h-8 rounded-[0.55rem] borderBlack70 pl-3 w-full mb-2 pr-2'
                            type='date'
                            name='eventDate'
                            required={requiredSections["Date"]}
                            maxLength={500}
                        />

                        <InputTitle isRequired={requiredSections["Time"]}>
                            Time
                        </InputTitle>
                        <input 
                            id="Time"
                            className='h-8 rounded-[0.55rem] borderBlack70 pl-3 w-full pr-2 mb-3'
                            type='time'
                            name='eventTime'
                            required={requiredSections["Time"]}
                            maxLength={500}
                        /> 

                        <InputTitle isRequired={requiredSections["Location"]}>
                            Location
                        </InputTitle>
                        <input 
                            id="Location"
                            className='h-8 rounded-[0.55rem] borderBlack70 pl-3 w-full pr-2'
                            type='text'
                            name='eventLocation'
                            required={requiredSections["Location"]}
                            maxLength={500}
                        />     
                    </div>
                </div>

                <div className='flex flex-col'>
                    <InputTitle isRequired={requiredSections["Preview Image"]}>
                        Preview Image
                    </InputTitle>
                    <input 
                        id='Preview Image'
                        className='mt-2 pl-2'
                        type='file'
                        name='eventPreview'
                        required={requiredSections["Preview Image"]}
                    />
                </div>


                <button 
                    type='submit' 
                    disabled={false}
                    className='absolute bottom-3 right-3 gap-2 text-xs sm:text-sm font-bold items-center justify-center h-[1.8rem] sm:h-[2rem] w-[4rem] sm:w-[4.5rem] bg-gray-900 text-white rounded-full outline-none transition-all hover:bg-gray-950 hover:scale-[1.07] active:scale-[1.03] disabled:scale-100 disabled:bg-opacity-65'
                    onClick={() => {}}
                >
                    Create
                </button>
            </form>
        </div>
          
    </div>
  )
}

export default EditEventMenu;