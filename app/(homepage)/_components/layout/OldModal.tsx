import React, { Fragment } from "react";
import ReactModal, { Styles } from "react-modal";
import "./component-styles/modal.css"
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const customStyles: Styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(76, 76, 76, 0.7)",
    zIndex: 9999,
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    border: "none",
    borderRadius: "0px",
    backgroundColor:"rgba(76, 76, 76, 0)",
    padding: 0,
  },
};

// ReactModal.setAppElement('#modals');

const OldModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Modal"
      //       className=" ReactModal__Content"
      //       overlayClassName="modal-overlay"
      ariaHideApp={false}
      // appElement={typeof window !== 'undefined' ? document.getElementById('__next')! : undefined}
      style={customStyles}
    >
      <Fragment>
        {children}
      </Fragment>
    </ReactModal>
  );
};

export default OldModal;
