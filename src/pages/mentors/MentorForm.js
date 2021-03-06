import React from "react"
import { Button, CardBody, Col,  Row } from "reactstrap";
import 'react-toastify/dist/ReactToastify.css';
import { SessionService } from "../networking/sessions/SessionService";
import { TabManager } from "./subtabs/TabManager";
import history from "../history";
import { io } from "socket.io-client";
import { PageNotFound } from "../PageNotFound";
import { LoadingPage } from "../LoadingPage";
import { ToastContainer } from "react-toastify";

class MentorForm extends React.Component {
    constructor() {
        super()
        this.orgId = ""
        this.uid = ""
        this.socket = io("//atlasplanner.ue.r.appspot.com")
        this.eventId = ""
        this.state={
            sessions: [],
            pageNotFound: false,
            pageComponent: [],
            eventInfo: [],
            tab: "create-session",
            isLoading: true,
        }
    }

    getSessions = async(orgId, eventId) => {
        await SessionService.getAllSessions(orgId, eventId).then((sessions) => {
            if (sessions) {
                this.setState({ eventInfo : sessions['event_info'] })
                this.setState({ sessions : sessions['sessions'] })
                this.updateTabData(this.state.tab)
            } else {
                this.pageNotFound()
            }
            this.setState({ isLoading : false })
        });
    };

    pageNotFound() {
        this.setState({ pageNotFound : true })
    }

    updateTabData = (name) => {
        history.push("?tab-name=" + name)
        this.setState({ tab : name })
        this.setState({ pageComponent : TabManager.getTabComponent(name, this.props.match.params.orgId, this.props.match.params.eventId, this.state.sessions, this.getSessions, this.state.eventInfo) })
    }

    componentDidMount() {
        this.getSessions(this.props.match.params.orgId, this.props.match.params.eventId).then(() => {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('tab-name') != "") {
                this.updateTabData(urlParams.get('tab-name'))
            }
        })
    }
    
      render() {
          if (this.state.pageNotFound) {
              return <PageNotFound />
          }
          if (this.state.isLoading) {
              return <LoadingPage />
          }

          console.log(this.state.eventInfo)
                   
        return (
            <div className="eventBody">
                <div className="top_form_header"></div>
                <div className="container">
                    <img style={{marginTop: 20}} src={require('../../assets/icon.svg')} />
                        </div>
                

            <div style={{paddingTop: 50, zIndex:999, position: 'relative'}} className="eventPageBody container">          
            <p className="eventWhiteHeaderTitle" style={{marginBottom: 5, marginTop: 25, fontSize: 45, color: 'white'}}>{this.props.match.params.eventId}</p>
            <p className="eventWhiteHeaderTitle" style={{marginBottom: 5, marginTop: 15, fontSize: 18, color: 'white'}}>{this.props.match.params.orgId}</p>
            <p style={{color: 'white', cursor: 'pointer', textDecoration: 'underline'}} onClick={() => window.open(window.location.origin + '/c/' + this.props.match.params.orgId + '/' + this.props.match.params.eventId)}> Live Site: {window.location.origin + '/c/' + this.props.match.params.orgId + '/' + this.props.match.params.eventId} </p>

            <p> </p>

            <Button style={{background: 'none', marginRight: 10, color: 'white', border: '1px solid white'}} onClick={() => this.updateTabData("create-session")}> Create Session  </Button>
            <Button style={{background: 'none', marginRight: 10, color: 'white', border: '1px solid white'}}  onClick={() => this.updateTabData("delete-session")}> Delete Session  </Button>
            {/* <Button disabled style={{background: 'none', color: 'white', border: '1px solid white'}}  onClick={() => this.updateTabData("edit-session")}> Edit </Button> */}
            <br></br>
            <br></br>

            {this.state.pageComponent}

            <br></br>
            </div>
            <ToastContainer />
          </div>
        );
      }
}

export default MentorForm;