import { Dialog } from '@headlessui/react'
import React from 'react'

interface ModalProps {
  isOpen: boolean
  onDismiss: () => void
  minHeight?: number | false
  maxHeight?: number
  initialFocusRef?: React.RefObject<unknown>
  children?: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({
  isOpen = false,
  onDismiss,
  children,
}) => {
  return (
    // <Transition  as={Fragment}>
    <Dialog
      open={isOpen}
      onClose={onDismiss}
      className="fixed z-40 inset-0 overflow-y-auto"
    >
      {/* <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        > */}
      <Dialog.Overlay className="fixed inset-0 bg-overlay" />
      {/* </Transition.Child> */}
      <div className="min-h-full flex pt-28 max-w-6xl w-full mx-auto px-4">
        <div className="relative flex justify-center rounded-3xl w-full p-4 sm:p-6 custom-daliog-root">
          {/* <div className="absolute -right-3 -top-3.5 custom-modal-close">
            <button
              onClick={onDismiss}
              className="p-1 text-white rounded-full inline-flex outline-none focus:outline-none custom-dialog-btn"
            >
              <span className="sr-only">Close</span>
              <XIcon className="w-6 h-6" />
            </button>
          </div> */}
          {children}
        </div>
      </div>
    </Dialog>
    // </Transition>
  )
}

export default Modal
