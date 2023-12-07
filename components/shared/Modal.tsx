"use client"
import { Fragment, useState } from "react";
import { Dialog, Transition } from '@headlessui/react'
import { ModalCard } from "../cards";

interface Props{
    data: string[];
    title: string;
    btnTitle: string;
}

export const Modal = ({data, title, btnTitle}: Props) => {

    const [isOpen, setIsOpen] = useState(false)

  return (
    <>
    <button className='text-sm hover:underline text-neutral-400' onClick={() => setIsOpen(true)}> <span className="text-text font-semibold">{data.length}</span> {btnTitle}</button>

    <Transition
    show={isOpen}
    as={Fragment}
    >

    <Dialog onClose={() => setIsOpen(false)}
    className="relative z-50"
    >
        <Transition.Child 
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        >
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">

        <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
        >
        <Dialog.Panel className="max-w-[400px] w-full mx-auto bg-darkAccent p-3 rounded-md">
            <div className="flex items-center justify-between gap-2 mb-3 px-2">
                <Dialog.Title className="text-2xl font-extrabold text-text">{title}</Dialog.Title>
                <button onClick={() => setIsOpen(false)}> <i className="fas fa-times text-xl text-text"></i> </button>
            </div>

            <div className="flex flex-col gap-3 justify-center max-h-[500px] overflow-y-scroll">
            {
            data.length > 0 ?
            data.map((elem:any, i:number) => (
                <ModalCard id={elem} key={i}/>
            ))
            : (
                <h3 className='text-text text-xl font-semibold sm:px-7 px-3 sm:py-7 py-5'>No {title} :&#40;</h3>
            )
            }
            </div>

        </Dialog.Panel>
        </Transition.Child>
        </div>
    </Dialog>
    </Transition>
    </>
  )
}
