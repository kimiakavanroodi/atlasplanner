import React, { Component } from "react"
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { Card } from "@material-ui/core";
import { CardBody, Col, Input, Label, Row } from "reactstrap";
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import moment from "moment";
import uuid from 'react-uuid'
import { SessionService } from "../../../networking/sessions/SessionService";
import { Slide, toast } from "react-toastify";

export class MiniCalendar extends Component {
    state = {
        session: this.props.session,
        event: [],
        modal: false,
        reserveInfo: {
            "name": "",
            "description": ""
        },
        orgId: this.props.orgId,
        eventId: this.props.eventId,
    }

    selectEvent = this.props.selectEvent

    toggle = () => {
        this.setState({ modal: !this.state.modal });
    };
    
    handleEventClick = ({ event, el }) => {
        this.toggle();
        console.log(event)
        this.selectEvent(event, "");
        this.setState({ event : event._def.extendedProps.session });
    };

    handleTextChange = (key, value) => {
        var copyReserveInfo = this.state.reserveInfo
        copyReserveInfo[key] = value
        this.setState({ reserveInfo : copyReserveInfo })
    };

    reserveSession = () => {
        var copiedSession = this.state.session
        copiedSession["timeslots"].map((slot, id) => {
            if (slot["_id"] == this.state.event["_id"]) {
                copiedSession["timeslots"][id]["filled"][uuid()] = {
                    "name": this.state.reserveInfo["name"],
                    "description": this.state.reserveInfo["description"]
                }
            }
        })

        const sessionBody = { session: copiedSession }

        SessionService.updateSession(this.state.orgId, this.state.eventId, this.state.session["_id"], sessionBody).then((sessions) => {
            if (sessions) {
                toast.dark('Successfully added to session', {transition: Slide, position: "top-center"})
                this.toggle()
            }
        })
    };

    componentDidUpdate() {
        if (this.state.session != this.props.session) {
            this.setState({ session : this.props.session })
            this.setState({ event : this.state.event })
        }
    };

    render() {

        var events = [];

        this.state.session["timeslots"].map((time) => {
            var bgColor = "black"
            var title = [""]
            if (Object.keys(time["filled"]) != 0) {
                bgColor = "repeating-linear-gradient(45deg, rgb(96, 109, 188), rgb(96, 109, 188) 10px, rgb(70, 82, 152) 10px, rgb(70, 82, 152) 20px)"
                Object.keys(time["filled"]).map((person) => {
                    title[0] = time["filled"][person]["name"]
                })
            }

            events.push({
                title: title[0],
                background: bgColor,
                extraInfo: this.state.session["_id"],
                extendedProps: { 
                    session : {
                        name: this.state.session["name"],
                        descriptions: this.state.session["descriptions"],
                        link: this.state.session["link"],
                        section: this.state.session["section"],
                        start_time: time["actual_start"],
                        end_time: time["actual_end"],
                        filled: time["filled"],
                        _id: time["_id"]
                    }
                },
                editable: true,
                start: time["actual_start"],
                end: time["actual_end"]
            })
        })

        return (
            <div style={{outline: '#ffffff21 solid 40px'}}>

             
            <Card className="formCard">
                <CardBody>

                    <FullCalendar
                        height={500}
                        defaultAllDay={false}
                        allDaySlot={false}
                        eventClick={this.handleEventClick}
                        contentHeight={700}
                        
                        buttonText={{
                                today: 'Today',
                                month: 'Month',
                                week: 'Week',
                                day: 'Day',
                                list: 'List',
                                daygrid: 'Grid',
                            }}
                        expandRows
                        plugins={ [ dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin ]}
                        initialView={ 'timeGridWeek' }
                        events={events}
                        headerToolbar={{
                            left: 'prev',
                            center: 'title',
                            right: 'next'
                        }}
                        eventDidMount={ function (info) {
                                if (info.event.extendedProps.background) {
                                    info.el.style.backgroundColor = 'black'
                                    info.el.style.background = info.event.extendedProps.background;
                                    info.el.style.backgroundSize = '500%';
                                }
                            }}
                        /> 
                    </CardBody>
                </Card>


                <Modal style={{padding: 20}} overlay={false} isOpen={this.state.modal} toggle={this.toggle}>

                <ModalHeader toggle={this.toggle} cssModule={{'modal-title': 'w-100 text-center'}} style={{borderBottom: 'none', paddingBottom: '0px', padding: 10, fontWeight: 600, fontSize: '17px', textAlign: 'center'}} className="createProjectTitle"> <span style={{borderBottom: 'none', paddingBottom: '0px', fontWeight: 600, fontSize: '15px', fontFamily: 'Helvetica', textAlign: 'center'}}> Reserve Session </span></ModalHeader>
                <div>
                    <p style={{textAlign: 'center', fontFamily: 'Helvetica', fontSize: 14}}> {moment(new Date(this.state.event['start_time'])).format('MM-DD-YYYY hh:mm a')} - {moment(new Date(this.state.event['end_time'])).format('MM-DD-YYYY hh:mm a')} </p>
                    </div>
                <ModalBody>

                    <br></br>

                    <Label style={{marginBottom: 9}} className="createProjectLabel"> Your Name </Label>
                    <br></br>

                    <Input style={{width: '100%'}} onChange={(text) => this.handleTextChange("name", text.target.value) } placeholder="Enter name" />
                    <br></br>
                    <br></br>
                </ModalBody>
                <ModalFooter style={{borderTop: 'none'}}>
                    <Button onClick={this.reserveSession} className="createEventBtn" color="primary">Reserve</Button>{" "}
                </ModalFooter>
                </Modal>
        </div>
        )
    }
}