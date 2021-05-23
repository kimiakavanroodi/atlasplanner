import { Card } from '@material-ui/core';
import React, { useState } from 'react';
import { Input } from 'semantic-ui-react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label,  CardBody, Row, Col, DropdownMenu } from 'reactstrap';
import { db } from '../../firebase';
import { updateLocale } from 'moment';
import 'semantic-ui-css/semantic.min.css'

export const AddEventModal = (props) => {
  const {
    orgId,
    className,
    updateEvents,
    children,
  } = props;

  const [modal, setModal] = useState(false);
  const [projectName, setName] = useState("");

  const toggle = () => setModal(!modal);

  const createEvent = async(name) => {
    const uid = await new Promise((resolve, reject) => {
        db.auth().onAuthStateChanged((user) => {
            resolve(user.uid)
        }, reject)
    });

    db.database('https://atlasplanner-e530e-default-rtdb.firebaseio.com/').ref('/' + uid + '/' + orgId + '/events/' + projectName).set({
        "mentors": "None",
        "activity": "None"
    })

    db.database('https://atlasplanner-e530e-default-rtdb.firebaseio.com/').ref('/organizations/' + orgId + '/events/' + projectName).set({"mentors": "None"})
    toggle()
    updateEvents(orgId)
  }

  return (
    <div onClick={toggle}>
        {children}
      <Modal style={{padding: 20}} overlay={false} isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader cssModule={{'modal-title': 'w-100 text-center'}} style={{borderBottom: 'none', paddingBottom: '0px', padding: 10, fontWeight: 600, fontSize: '17px', textAlign: 'center'}} className="createProjectTitle" toggle={toggle}> <span style={{borderBottom: 'none', paddingBottom: '0px', fontWeight: 600, fontSize: '17px', textAlign: 'center'}}> create an event </span></ModalHeader>
        <ModalBody>
        <Label style={{marginBottom: 9}} className="createProjectLabel"> create event </Label>
        <br></br>
        <Input style={{width: '100%', border: '1px solid black', borderRadius: '5px'}} onChange={(text) => setName(text.target.value)} placeholder="Enter event name" />
        <br></br>
        </ModalBody>
        <ModalFooter style={{borderTop: 'none'}}>
          <Button style={{border: 'none', boxShadow: '0px 4px 14px rgba(58, 116, 148, 0.23)'}} className="createEventBtn" onClick={() => createEvent(projectName)} color="primary"> + Create </Button>{' '}
        </ModalFooter>
      </Modal>
    </div>
  );
}



