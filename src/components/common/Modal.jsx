import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, footer }) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/68" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center px-4 py-8 sm:items-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="scale-95 opacity-0"
              enterTo="scale-100 opacity-100"
              leave="ease-in duration-150"
              leaveFrom="scale-100 opacity-100"
              leaveTo="scale-95 opacity-0"
            >
              <DialogPanel className="modal-shadow w-full max-w-[760px] overflow-hidden rounded-lg bg-white text-[#071154]">
                <div className="flex items-center justify-between border-b border-[#dbe3f1] px-8 py-7">
                  <DialogTitle className="text-2xl font-extrabold tracking-[-0.01em]">{title}</DialogTitle>
                  <button
                    type="button"
                    className="rounded-md p-1 text-[#071154] transition hover:bg-[#eef4ff]"
                    onClick={onClose}
                    aria-label="Close modal"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="px-8 py-8">{children}</div>
                {footer ? <div className="flex justify-end gap-4 border-t border-[#dbe3f1] px-8 py-5">{footer}</div> : null}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
