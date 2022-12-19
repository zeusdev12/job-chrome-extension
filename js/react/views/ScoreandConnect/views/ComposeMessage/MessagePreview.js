import React from 'react';
import {  Modal, ModalHeader, ModalBody } from 'reactstrap';

const MessagePreview = ({ toggle, modal, description }) => {


  return (
    <div>
      <Modal placement='bottom' isOpen={modal} toggle={toggle} centered unmountOnClose={false}>
        <ModalHeader toggle={toggle} >
          <p >
            Message Preview
          </p>
        </ModalHeader>
        <ModalBody>
          <p >
            {description}
          </p>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default MessagePreview;